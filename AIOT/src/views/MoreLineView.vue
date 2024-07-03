<script setup>
import { ref, inject, computed, watch, onMounted } from "vue";
import oneLineChart from "../components/BarChart.vue";

const APIUrl = inject("APIUrl");
const axios = inject("axios");
const VueCookies = inject("VueCookies");
const componentKey = ref(0);
const forceRerender = () => {
  componentKey.value += 1;
};

var arrlist = ref([]);
const arritem = ref([]);
const targetValue = ref(null);

const type = ref(null);
const strtime = ref(VueCookies.get("strtime"));
const endtime = ref(VueCookies.get("endtime"));
const item = ref(VueCookies.get("item"));
const product = ref(VueCookies.get("product"));
//預設為日報
const reporttype = ref(
  VueCookies.get("reporttype") === null ? "date" : VueCookies.get("reporttype")
);
const arrProduct = ref([]);
const arrLine = ref([]);
const arrCheckBox = ref([]);
const allCheckBox = ref(false);

//如果超過下列的顏色會出現問題
const arrBorderColor = ref([
  "#2E8B57",
  "#FFA500",
  "#800080",
  "#FFD700",
  "#D2691E",
  "#F0E68C",
  "#00FFFF",
  "#1E90FF",
  "#C0C0C0",
]);
const oneLineChartData = ref({ labels: [], datasets: [] });
const oneLinChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
});
//目標線(虛線)
const arrTargetAvailability = ref([]);
const arrTargetYieId = ref([]);
const arrTargetPerformance = ref([]);
const arrTargetOEE = ref([]);
const arrTargetERR = ref([]);
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
      type.value = "Availability";
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

      type.value = "Availability";
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

      type.value = "Availability";
      getProductData();
    })
    .catch((err) => {
      if (err.code === "ERR_NETWORK") {
        alert("查詢產品異常，請重新整理。");
        return;
      }
    });
};
//後端取值
const getData = () => {
  axios({
    method: "post",
    url: APIUrl + "getMoreLineData",
    data: {
      startDate: strtime.value,
      endDate: endtime.value,
      item: item.value,
      product: product.value,
      selectType: type.value,
      arrLine: arrCheckBox.value,
      reporttype: reporttype.value,
    },
  })
    .then(function (res) {
      arrlist.value = res.data;
      // 清空datasets，重製x軸
      oneLineChartData.value.labels = arrlist.value[0].arrDate;
      oneLineChartData.value.datasets = [];
      arrlist.value.forEach((item, index) => {
        const lindata = item.arrValue.map((x) => parseFloat(x));

        // const lindata = oneLineChartData.value.labels.map((date) => {
        //   const dateIndex = item.arrDate.indexOf(date);
        //   return dateIndex !== -1 ? parseFloat(item.arrValue[dateIndex]) : 0;
        // });

        oneLineChartData.value.datasets.push({
          type: "line",
          label: `${item.label}號產線`,
          backgroundColor: `${arrBorderColor.value[index]}`,
          borderColor: `${arrBorderColor.value[index]}`,
          borderWidth: 3,
          order: 1,
          data: lindata.map((value) => (value === 0 ? null : value)),
          yAxisID: "y2",
          datalabels: {
            align: "top",
            anchor: "end",
          },
        });
      });
      arrTargetAvailability.value = [];
      arrTargetOEE.value = [];
      arrTargetPerformance.value = [];
      arrTargetYieId.value = [];
      arrTargetERR.value = [];
      arrlist.value[0].arrDate.forEach(() => {
        arrTargetAvailability.value.push(85);
        arrTargetYieId.value.push(98);
        arrTargetPerformance.value.push(85);
        arrTargetOEE.value.push(85);
        arrTargetERR.value.push(0.5);
      });
      switch (type.value) {
        case "Availability":
          targetValue.value = 85;
          oneLineChartData.value.datasets.push({
            type: "line",
            label: "稼動率目標值",
            backgroundColor: "#95a5a6",
            borderColor: "#95a5a6",
            borderWidth: 3,
            order: 1,
            data: arrTargetAvailability.value,
            borderDash: [5, 5],
            yAxisID: "y2",
            datalabels: {
              align: "end",
              anchor: "end",
            },
          });
          break;
        case "YieId":
          targetValue.value = 98;
          oneLineChartData.value.datasets.push({
            type: "line",
            label: "良率目標值",
            backgroundColor: "#95a5a6",
            borderColor: "#95a5a6",
            borderWidth: 3,
            order: 1,
            data: arrTargetYieId.value,
            borderDash: [5, 5],
            yAxisID: "y2",
            datalabels: {
              align: "end",
              anchor: "end",
            },
          });
          break;
        case "ERR":
          targetValue.value = 0.5;
          oneLineChartData.value.datasets.push({
            type: "line",
            label: "平均臨停目標值",
            backgroundColor: "#95a5a6",
            borderColor: "#95a5a6",
            borderWidth: 3,
            order: 1,
            data: arrTargetERR.value,
            borderDash: [5, 5],
            yAxisID: "y2",
            datalabels: {
              align: "end",
              anchor: "end",
            },
          });
          break;
        case "Performance":
          targetValue.value = 85;
          oneLineChartData.value.datasets.push({
            type: "line",
            label: "生產效率目標值",
            backgroundColor: "#95a5a6",
            borderColor: "#95a5a6",
            borderWidth: 3,
            order: 1,
            data: arrTargetPerformance.value,
            borderDash: [5, 5],
            yAxisID: "y2",
            datalabels: {
              align: "end",
              anchor: "end",
            },
          });
          break;
        case "OEE":
          targetValue.value = 85;
          oneLineChartData.value.datasets.push({
            type: "line",
            label: "設備綜合效率目標值",
            backgroundColor: "#95a5a6",
            borderColor: "#95a5a6",
            borderWidth: 3,
            order: 1,
            data: arrTargetOEE.value,
            borderDash: [5, 5],
            yAxisID: "y2",
            datalabels: {
              align: "end",
              anchor: "end",
            },
          });
          break;
        default:
          targetValue.value = null;
          break;
      }
      oneLinChartOptions.value = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          datalabels: {
            backgroundColor: function (context) {
              return context.dataset.borderColor;
            },
            borderRadius: 4,
            color: function (context) {
              //null是臨停沒有設定目標值
              switch (type.value) {
                case "ERR":
                  if (
                    targetValue.value === null ||
                    parseFloat(context.dataset.data[context.dataIndex]) >
                      targetValue.value
                  ) {
                    return "red";
                  }
                  return "white";
                default:
                  if (
                    targetValue.value === null ||
                    parseFloat(context.dataset.data[context.dataIndex]) >=
                      targetValue.value
                  ) {
                    return "white";
                  }
                  return "red";
              }
            },
            font: {
              weight: "bold",
            },
            // formatter: Math.round,移除小數點
            padding: 6,
          },
        },
        scales: {
          y2: {
            type: "linear",
            display: "true",
            position: "left",
            // min: 0,
            max: function (context) {
              switch (type.value) {
                case "ERR":
                  return 1.8;

                default:
                  return 105;
              }
            },
            grid: {
              drawOnChartArea: false,
            },
            title: {
              display: true,
              text: function (context) {
                switch (type.value) {
                  case "ERR":
                    return "平均每小時(Hr)";

                  default:
                    return "百分比(%)";
                }
              },
            },
          },
        },
      };

      //重新渲染
      forceRerender();
    })
    .catch((err) => {
      if (err.code === "ERR_NETWORK") {
        alert("查詢異常");
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
  if (arrCheckBox.value.length < 2) {
    alert("請選擇兩條產線以上");
    return;
  }
  VueCookies.set("reporttype", reporttype.value, "1y");
  VueCookies.set("strtime", strtime.value, "1y");
  VueCookies.set("endtime", endtime.value, "1y");
  VueCookies.set("item", item.value, "1y");
  VueCookies.set("product", product.value, "1y");
  getData();
};
onMounted(() => {
  getItemData();
});
const changereport = () => {
  strtime.value = null;
  endtime.value = null;
};
watch(allCheckBox, (newVal) => {
  arrCheckBox.value = newVal ? arrLine.value.slice() : [];
});
watch(arrCheckBox, () => {
  allCheckBox.value = arrCheckBox.value.length === arrLine.value.length;
});
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
    <h1>多線比較圖表</h1>
    <div id="divsearchBar" style="display: flex">
      <span class="btn btn-secondary"
        >報告:<select
          v-model="reporttype"
          class="btn btn-secondary"
          @change="changereport"
        >
          <option value="date" selected>日報</option>
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
        ><button
          type="button"
          class="btn btn-secondary"
          data-bs-toggle="modal"
          data-bs-target="#staticBackdrop"
        >
          產線
        </button></span
      >
      <span class="btn btn-secondary"
        >種類:<select
          v-model="type"
          class="btn btn-secondary"
          name=""
          id="typesearchselect"
        >
          <option value="Availability">稼動率</option>
          <option value="YieId">良率</option>
          <option value="Performance">生產效率</option>
          <option value="OEE">設備綜合效率</option>
          <option value="ERR">臨停</option>
        </select></span
      >
      <span class="btn btn-secondary">
        <button class="btn btn-secondary" @click="btnsearch">搜尋</button></span
      >
    </div>
    <div>
      <oneLineChart
        id="oneLineChart"
        :key="componentKey"
        :data="oneLineChartData"
        :options="oneLinChartOptions"
      />
    </div>
  </div>

  <!-- Modal -->
  <div
    class="modal fade"
    id="staticBackdrop"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="staticBackdropLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">選擇產線</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="form-check form-switch modal-Div">
            <span
              ><input
                class="form-check-input"
                type="checkbox"
                v-model="allCheckBox"
                id="AllCheck"
              />
              <label class="form-check-label" for="flexCheck">全選</label></span
            >
          </div>
          <div class="form-check form-switch modal-Div" v-for="item in arrLine">
            <span>
              <input
                class="form-check-input"
                type="checkbox"
                :value="item"
                :id="'flexCheck' + item"
                v-model="arrCheckBox"
              />
              <label class="form-check-label" :for="'flexCheck' + item">
                {{ item }}線</label
              ></span
            >
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
@media screen and (min-width: 1024px) {
  .modal-body {
    display: flex;
    flex-wrap: wrap;
  }

  .modal-Div {
    box-sizing: border-box;
    width: calc(20% - 5px);
  }

  .modal-Div:nth-child(2n) {
    margin-right: 2px;
  }

  .modal-Div:last-child {
    flex-grow: 1;
  }

  /* 大屏幕样式 */
  span {
    margin: 0.15svw;
  }

  option {
    text-align: center;
  }

  #oneLineChart {
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

  #oneLineChart {
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

  #oneLineChart {
    width: 100svw;
    height: 100svw;
  }

  #divsearchBar {
    flex-direction: column;
  }
}
</style>
