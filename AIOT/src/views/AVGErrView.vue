<script setup>
import { ref, inject, onMounted, watch } from "vue";
import avgErrChart from "../components/BarChart.vue";
import { LineElement } from "chart.js";
import { layouts } from "chart.js";
import { Title } from "chart.js";

const axios = inject("axios");
// 後端網址
const APIUrl = inject("APIUrl");

const VueCookies = inject("VueCookies");
// 重製圖表
const componentKey = ref(0);
const forceRerender = () => {
  componentKey.value += 1;
};

const arritem = ref([]);
const arrDataList = ref([]);
const strtime = ref(VueCookies.get("strtime"));
const endtime = ref(VueCookies.get("endtime"));
const item = ref(VueCookies.get("item"));
const product = ref(VueCookies.get("product"));
const line = ref(VueCookies.get("line"));

const reporttype = ref(
  VueCookies.get("reporttype") === null ? "date" : VueCookies.get("reporttype")
);

const deviceName = ref(null);
const labelName = ref(null);
const arrLine = ref([]);
const arrProduct = ref([]);
const arrDeviceName = ref([]);
const arrTarget = ref([]);
const type = ref(null);
const arrDate = ref([]);
const arrCount = ref([]);
const arrAVGCount = ref([]);

const avgErrChartData = ref({ labels: [], datasets: [] });
const avgErrChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
});
//後端取得現有的設備
const getDeviceData = () => {
  axios({
    method: "get",
    url: APIUrl + "getDeviceName",
    params: { item: item.value, line: line.value, product: product.value },
  })
    .then((res) => {
      arrDeviceName.value = res.data;
      deviceName.value = arrDeviceName.value[0];
      deviceName.value = "All";
      type.value = "ERR";
    })
    .catch((err) => {
      if (err.code === "ERR_NETWORK") {
        alert("查詢設備異常，請重新整理");
      }
    });
};
//後端取得資料庫現有的線號
const getLineData = () => {
  axios({
    method: "get",
    url: APIUrl + "getAllLine",
    params: {
      product: product.value,
    },
  })
    .then(function (res) {
      arrLine.value = res.data;
      type.value = "ERR";
      getDeviceData();
    })
    .catch((err) => {
      if (err.code === "ERR_NETWORK") {
        alert("查詢線號異常，請重新整理。");
        return;
      }
    });
};
//後端取得現有的Product
const getProductData = () => {
  axios({
    method: "get",
    url: APIUrl + "getAllProduct",
    params: { item: item.value },
  })
    .then(function (res) {
      arrProduct.value = res.data;
      type.value = "ERR";
      getLineData();
    })
    .catch((err) => {
      if (err.code === "ERR_NETWORK") {
        alert("查詢產品異常，請重新整理。");
        return;
      }
    });
};
const getItemData = () => {
  axios({
    method: "get",
    url: APIUrl + "getAllItem",
  })
    .then(function (res) {
      arritem.value = res.data;
      type.value = "ERR";
      getProductData();
    })
    .catch((err) => {
      if (err.code === "ERR_NETWORK") {
        alert("查詢產品異常，請重新整理。");
        return;
      }
    });
};

const getData = () => {
  axios({
    method: "get",
    url: APIUrl + "getErrData",
    params: {
      startTime: strtime.value,
      endTime: endtime.value,
      item: item.value,
      product: product.value,
      line: line.value,
      type: type.value,
      device: deviceName.value,
      avg: "avg",
      reporttype: reporttype.value,
    },
  })
    .then((res) => {
      arrDate.value = [];
      arrAVGCount.value = [];
      arrCount.value = [];
      arrTarget.value = [];
      res.data.tempChartData.forEach((data) => {
        arrDate.value.push(data.Date);
        arrAVGCount.value.push(data.AVGCount);
        arrCount.value.push(data.Count);
        arrTarget.value.push(0.5);
      });
      arrDataList.value = res.data.tempTableData;

      switch (type.value) {
        case "ERR":
          labelName.value = "臨停";
          break;
        case "PAT":
          labelName.value = "缺料";
          break;
      }

      // 清空datasets，重製x軸
      avgErrChartData.value.labels = arrDate.value;
      avgErrChartData.value.datasets = [];
      avgErrChartData.value.datasets.push({
        type: "bar",
        label: `${labelName.value}總次數`,
        backgroundColor: "#3498db",
        borderColor: "#3498db",
        barThickness: 15,
        order: 2,
        hidden: true,
        data: arrCount.value,
        yAxisID: "y1",
        datalabels: {
          align: "center",
          anchor: "center",
        },
      });
      avgErrChartData.value.datasets.push({
        type: "line",
        label: `每小時平均${labelName.value}次數`,
        backgroundColor: "#2ecc71",
        borderColor: "#2ecc71",
        borderWidth: 3,
        order: 1,
        data: arrAVGCount.value,
        yAxisID: "y2",
        datalabels: {
          align: "end",
          anchor: "end",
        },
        meta: {
          targetValue: 0.5,
        },
      });
      avgErrChartData.value.datasets.push({
        type: "line",
        label: "平均目標值",
        backgroundColor: "#95a5a6",
        borderColor: "#95a5a6",
        borderWidth: 3,
        order: 1,
        data: arrTarget.value,
        borderDash: [5, 5],
        yAxisID: "y2",
        datalabels: {
          align: "start",
          anchor: "start",
        },
      });
      avgErrChartOptions.value = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          //dataset標頭
          legend: {
            padding: {
              top: 40,
              bottom: 40,
            },
            labels: {
              font: {
                size: 16, // 設定圖例標籤的字體大小為 16 像素
              },
            },
          },
          datalabels: {
            backgroundColor: function (context) {
              return context.dataset.borderColor;
            },
            borderRadius: 4,
            color: function (context) {
              if (
                context.dataset.meta === undefined ||
                parseFloat(context.dataset.data[context.dataIndex]) <=
                  context.dataset.meta.targetValue
              ) {
                return "white";
              } else {
                return "red";
              }
            },
            font: {
              weight: "bold",
            },
            padding: 6,
          },
        },
        scales: {
          y1: {
            type: "linear",
            display: "auto",
            position: "left",
            // min: 0,
            // max: 2,
            grid: {
              drawOnChartArea: false,
            },
            title: {
              display: true,
              text: "次數",
            },
          },
          y2: {
            type: "linear",
            display: "auto",
            position: "right",
            // min: 0,
            //max: 1,
            grid: {
              drawOnChartArea: false,
            },
            title: {
              display: true,
              text: "平均每小時(Hr)",
            },
            //修改Y軸最大值或最小值
            afterDataLimits: function (scale) {
              scale.min = scale.min - 0.1;
            },
          },
        },
      };
      forceRerender();
    })
    .catch((err) => {
      if (err.code === "ERR_NETWORK") {
        alert("查詢異常");
        return;
      }
      if (err.response.status === 404) {
        alert("查無資料");
        return;
      }
    });
};
const btnsearch = () => {
  if (strtime.value === null || endtime.value === null) {
    alert("請選擇日期");
    return;
  }
  if (endtime.value < strtime.value) {
    alert("開始時間大於結束時間，請重新選擇");
    return;
  }
  VueCookies.set("strtime", strtime.value, "1y");
  VueCookies.set("endtime", endtime.value, "1y");
  VueCookies.set("item", item.value, "1y");
  VueCookies.set("product", product.value, "1y");
  VueCookies.set("line", line.value, "1y");
  getData();
};
onMounted(() => {
  getItemData();
});
//監控reporttype變更時重置strtime、endtime
watch(
  () => reporttype.value,
  () => {
    strtime.value = null;
    endtime.value = null;
  }
);
</script>
<template>
  <div
    style="
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    "
  >
    <h1>機台平均臨停統計圖</h1>
    <div id="divsearchBar" style="display: flex">
      <span class="btn btn-secondary"
        >報告:<select
          v-model="reporttype"
          class="btn btn-secondary"
          @change="changereport"
        >
          <option value="date">日報</option>
          <option value="week">周報</option>
          <option value="month">月報</option>
        </select></span
      >
      <span class="btn btn-secondary"
        >開始日期:<input
          v-model="strtime"
          class="btn btn-secondary"
          :type="reporttype"
          id="strtime"
      /></span>
      <span class="btn btn-secondary"
        >結束日期:<input
          v-model="endtime"
          class="btn btn-secondary"
          :type="reporttype"
          id="endtime"
      /></span>
      <span class="btn btn-secondary"
        >分類:<select
          v-model="item"
          class="btn btn-secondary"
          name=""
          id="itemSearchSelect"
          @change="getProductData"
        >
          <option v-for="itemData in arritem">{{ itemData }}</option>
        </select></span
      >
      <span class="btn btn-secondary"
        >產品:<select
          v-model="product"
          class="btn btn-secondary"
          name=""
          id="productSearchSelect"
          @change="getLineData"
        >
          <option v-for="productData in arrProduct">{{ productData }}</option>
        </select></span
      >
      <span class="btn btn-secondary"
        >產線:<select
          v-model="line"
          class="btn btn-secondary"
          name=""
          id="linesearchselect"
          @change="getDeviceData"
        >
          <option selected v-for="lineData in arrLine">{{ lineData }}</option>
        </select></span
      >
      <span class="btn btn-secondary"
        >設備:<select
          v-model="deviceName"
          class="btn btn-secondary"
          name=""
          id="devicesearchselect"
        >
          <option value="All">全選</option>
          <option v-for="devicenameData in arrDeviceName">
            {{ devicenameData }}
          </option>
        </select></span
      >
      <span class="btn btn-secondary"
        >種類:<select
          v-model="type"
          class="btn btn-secondary"
          name=""
          id="typesearchselect"
        >
          <option value="ERR">臨停</option>
          <option v-if="false" value="All">全選</option>
          <option v-if="false" value="PAT">缺料</option>
        </select></span
      >
      <span class="btn btn-secondary">
        <button class="btn btn-secondary" @click="btnsearch">搜尋</button></span
      >
    </div>
    <div>
      <avgErrChart
        id="avgErrChart"
        :key="componentKey"
        :data="avgErrChartData"
        :options="avgErrChartOptions"
      />
    </div>
    <div>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">設備名稱</th>
            <th scope="col">日期</th>
            <th scope="col">時間</th>
            <th scope="col">寄存器</th>
            <th scope="col">錯誤訊息</th>
            <th scope="col">計數</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in arrDataList">
            <td>{{ item.DeviceName }}</td>
            <td>{{ item.Date }}</td>
            <td class="segmentation">{{ item.Time }}</td>
            <td>{{ item.Deposit }}</td>
            <td>{{ item.ERRName }}</td>
            <td>{{ item.Count }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<style scoped>
table {
  width: 75svw;
}
/*鎖定Table的th */
th {
  top: 0;
  position: sticky;
  background: white;
}
@media screen and (min-width: 1024px) {
  /* 大屏幕样式 */
  span {
    margin: 0.15svw;
  }

  option {
    text-align: center;
  }

  #avgErrChart {
    width: 75svw;
    height: 40svw;
  }
}

@media screen and (max-width: 1023px) {
  /* 中等屏幕样式 */
  span {
    margin: 0.15svw;
  }

  option {
    text-align: center;
  }

  #avgErrChart {
    width: 100svw;
    height: 75svw;
  }
}

@media screen and (max-width: 600px) {
  span {
    margin: 0.125svw;
  }

  option {
    text-align: center;
  }

  #avgErrChart {
    width: 100svw;
    height: 100svw;
  }

  #divsearchBar {
    flex-direction: column;
  }
}
</style>
