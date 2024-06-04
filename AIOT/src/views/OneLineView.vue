<script setup>
import { ref, inject, computed, watch, onMounted } from "vue";
import oneLineChart from "../components/BarChart.vue";

const APIUrl = inject("APIUrl");
const axios = inject("axios");
const numberfilter = inject("numberfilter");
const componentKey = ref(0);
const forceRerender = () => {
  componentKey.value += 1;
};

const arrlist = ref([]);
const arrTableList = ref([]);
const product = ref(null);
const arritem = ref([]);
const item = ref(null);
const line = ref(null);
const type = ref(null);
const strtime = ref(null);
const endtime = ref(null);
const arrProduct = ref([]);
const arrLine = ref([]);
const arrDate = ref([]);
const arrAO = ref([]);
const arrAvailability = ref([]);
const arrYieId = ref([]);
const arrPerformance = ref([]);
const arrOEE = ref([]);
//預設為日報
const reporttype = ref("date");
//目標線(虛線)
const arrTargetAvailability = ref([]);
const arrTargetYieId = ref([]);
const arrTargetPerformance = ref([]);
const arrTargetOEE = ref([]);
const oneLineChartData = ref({ labels: [], datasets: [] });
const oneLinChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
});

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
      line.value = arrLine.value[0];
      type.value = "All";
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
      product.value = arrProduct.value[0];

      type.value = "All";
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
      item.value = arritem.value[0];

      type.value = "All";
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
    method: "get",
    url: APIUrl + "getOneLineData",
    params: {
      startTime: strtime.value,
      endTime: endtime.value,
      product: product.value,
      item: item.value,
      line: line.value,
      reporttype: reporttype.value,
    },
  })
    .then(function (res) {
      arrlist.value = res.data;

      //塞選圖表List排除，沒有Date 等於是 綜合
      arrlist.value = arrlist.value.filter(
        (item) =>
          item.Date !== undefined && item.Date !== null && item.Date !== ""
      );

      arrTableList.value = res.data;
      arrAO.value = [];
      arrDate.value = [];
      arrPerformance.value = [];
      arrAvailability.value = [];
      arrYieId.value = [];
      arrOEE.value = [];
      arrTargetAvailability.value = [];
      arrTargetOEE.value = [];
      arrTargetPerformance.value = [];
      arrTargetYieId.value = [];
      arrlist.value.forEach((item) => {
        arrDate.value.push(item.Date);
        arrAO.value.push(item.AO);
        arrAvailability.value.push(item.Availability);
        arrTargetAvailability.value.push(85);
        arrYieId.value.push(item.YieId);
        arrTargetYieId.value.push(98);
        arrPerformance.value.push(item.Performance);
        arrTargetPerformance.value.push(85);
        arrOEE.value.push(item.OEE);
        arrTargetOEE.value.push(85);
      });
      // 清空datasets，重製x軸
      oneLineChartData.value.labels = arrDate.value;
      oneLineChartData.value.datasets = [];
      switch (type.value) {
        case "All":
          oneLineChartData.value.datasets.push({
            type: "bar",
            label: "產量",
            backgroundColor: "#3498db",
            borderColor: "#3498db",
            barThickness: 15,
            order: 2,
            data: arrAO.value,
            yAxisID: "y1",
            datalabels: {
              align: "center",
              anchor: "center",
            },
          });
          oneLineChartData.value.datasets.push({
            type: "line",
            label: "良率",
            backgroundColor: "#2ecc71",
            borderColor: "#2ecc71",
            borderWidth: 3,
            order: 1,
            data: arrYieId.value,
            yAxisID: "y2",
            datalabels: {
              align: "end",
              anchor: "end",
            },
            meta: {
              targetValue: 98,
            },
          });
          oneLineChartData.value.datasets.push({
            type: "line",
            label: "良率目標值",
            backgroundColor: "#2ecc71",
            borderColor: "#2ecc71",
            borderWidth: 3,
            order: 1,
            data: arrTargetYieId.value,
            borderDash: [5, 5],
            yAxisID: "y2",
            datalabels: {
              align: "end",
              anchor: "end",
            },
            meta: {
              targetValue: 98,
            },
          });

          oneLineChartData.value.datasets.push({
            type: "line",
            label: "稼動率",
            backgroundColor: "#f28500",
            borderColor: "#f28500",
            borderWidth: 3,
            order: 1,
            data: arrAvailability.value,
            yAxisID: "y2",
            datalabels: {
              align: "end",
              anchor: "end",
            },
            meta: {
              targetValue: 85,
            },
          });
          oneLineChartData.value.datasets.push({
            type: "line",
            label: "稼動率目標值",
            backgroundColor: "#f28500",
            borderColor: "#f28500",
            borderWidth: 3,
            order: 1,
            data: arrTargetAvailability.value,
            borderDash: [5, 5],
            yAxisID: "y2",
            datalabels: {
              align: "end",
              anchor: "end",
            },
            meta: {
              targetValue: 85,
            },
          });

          oneLineChartData.value.datasets.push({
            type: "line",
            label: "生產效率",
            backgroundColor: "#9b59b6",
            borderColor: "#9b59b6",
            borderWidth: 3,
            order: 1,
            data: arrPerformance.value,
            yAxisID: "y2",
            datalabels: {
              align: "end",
              anchor: "end",
            },
            meta: {
              targetValue: 85,
            },
          });
          oneLineChartData.value.datasets.push({
            type: "line",
            label: "生產效率目標值",
            backgroundColor: "#9b59b6",
            borderColor: "#9b59b6",
            borderWidth: 3,
            order: 1,
            data: arrTargetPerformance.value,
            borderDash: [5, 5],
            yAxisID: "y2",
            datalabels: {
              align: "end",
              anchor: "end",
            },
            meta: {
              targetValue: 85,
            },
          });

          oneLineChartData.value.datasets.push({
            type: "line",
            label: "設備綜合效率",
            backgroundColor: "#95a5a6",
            borderColor: "#95a5a6",
            borderWidth: 3,
            order: 1,
            data: arrOEE.value,
            yAxisID: "y2",
            datalabels: {
              align: "end",
              anchor: "end",
            },
            meta: {
              targetValue: 85,
            },
          });
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
            meta: {
              targetValue: 85,
            },
          });
          //顯示雙Y軸
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
                  if (
                    context.dataset.meta === undefined ||
                    context.dataset.meta === null
                  ) {
                    return "white";
                  } else if (
                    parseInt(context.dataset.data[context.dataIndex]) >=
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
                // formatter: Math.round,移除小數點
                padding: 6,
              },
            },
            scales: {
              y1: {
                type: "linear",
                display: "true",
                position: "left",
                min: 0,

                grid: {
                  drawOnChartArea: false,
                },
                title: {
                  display: true,
                  text: "PCS",
                },
              },
              y2: {
                type: "linear",
                display: "true",
                position: "right",
                min: 0,
                max: 120,
                grid: {
                  drawOnChartArea: false,
                },
                title: {
                  display: true,
                  text: "百分比(%)",
                },
              },
            },
          };
          break;
        case "Availability":
          oneLineChartData.value.datasets.push({
            type: "line",
            label: "稼動率",
            backgroundColor: "#f28500",
            borderColor: "#f28500",
            borderWidth: 3,
            order: 1,
            data: arrAvailability.value,
            yAxisID: "y2",
            datalabels: {
              align: "end",
              anchor: "end",
            },
            meta: {
              targetValue: 85,
            },
          });
          oneLineChartData.value.datasets.push({
            type: "line",
            label: "稼動率目標值",
            backgroundColor: "#f28500",
            borderColor: "#f28500",
            borderWidth: 3,
            order: 1,
            data: arrTargetAvailability.value,
            borderDash: [5, 5],
            yAxisID: "y2",
            datalabels: {
              align: "end",
              anchor: "end",
            },
            meta: {
              targetValue: 85,
            },
          });
          break;
        case "YieId":
          oneLineChartData.value.datasets.push({
            type: "line",
            label: "良率",
            backgroundColor: "#2ecc71",
            borderColor: "#2ecc71",
            borderWidth: 3,
            order: 1,
            data: arrYieId.value,
            yAxisID: "y2",
            datalabels: {
              align: "end",
              anchor: "end",
            },
            meta: {
              targetValue: 98,
            },
          });
          oneLineChartData.value.datasets.push({
            type: "line",
            label: "良率目標值",
            backgroundColor: "#2ecc71",
            borderColor: "#2ecc71",
            borderWidth: 3,
            order: 1,
            data: arrTargetYieId.value,
            borderDash: [5, 5],
            yAxisID: "y2",
            datalabels: {
              align: "end",
              anchor: "end",
            },
            meta: {
              targetValue: 98,
            },
          });
          break;
        case "Performance":
          oneLineChartData.value.datasets.push({
            type: "line",
            label: "生產效率",
            backgroundColor: "#9b59b6",
            borderColor: "#9b59b6",
            borderWidth: 3,
            order: 1,
            data: arrPerformance.value,
            yAxisID: "y2",
            datalabels: {
              align: "end",
              anchor: "end",
            },
            meta: {
              targetValue: 85,
            },
          });
          oneLineChartData.value.datasets.push({
            type: "line",
            label: "生產效率目標值",
            backgroundColor: "#9b59b6",
            borderColor: "#9b59b6",
            borderWidth: 3,
            order: 1,
            data: arrTargetPerformance.value,
            borderDash: [5, 5],
            yAxisID: "y2",
            datalabels: {
              align: "end",
              anchor: "end",
            },
            meta: {
              targetValue: 85,
            },
          });
          break;
        case "OEE":
          oneLineChartData.value.datasets.push({
            type: "line",
            label: "設備綜合效率",
            backgroundColor: "#95a5a6",
            borderColor: "#95a5a6",
            borderWidth: 3,
            order: 1,
            data: arrOEE.value,
            yAxisID: "y2",
            datalabels: {
              align: "end",
              anchor: "end",
            },
            meta: {
              targetValue: 85,
            },
          });
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
            meta: {
              targetValue: 85,
            },
          });
          break;
      }
      if (type.value !== "All") {
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
                if (
                  parseInt(context.dataset.data[context.dataIndex]) >=
                  context.dataset.meta.targetValue
                ) {
                  return "white";
                }
                return "red";
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
              min: 0,
              max: 120,
              grid: {
                drawOnChartArea: false,
              },
              title: {
                display: true,
                text: "百分比(%)",
              },
            },
          },
        };
      }
      //重新渲染
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
      if (err.response.status === 500) {
        alert("連線異常");
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
  console.log(strtime.value);
  console.log(endtime.value);
  getData();
};
onMounted(() => {
  getItemData();
});
const changereport = () => {
  strtime.value = null;
  endtime.value = null;
};
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
    <h1>單線圖表</h1>
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
          <option v-for="itemData in arritem">
            {{ itemData }}
          </option>
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
          <option
            v-for="productData in arrProduct">
            {{ productData }}
          </option>
        </select></span
      >
      <span class="btn btn-secondary"
        >產線:<select
          v-model="line"
          class="btn btn-secondary"
          name=""
          id="linesearchselect"
        >
          <option selected v-for="lineData in arrLine">{{ lineData }}</option>
        </select></span
      >
      <span class="btn btn-secondary"
        >種類:<select
          v-model="type"
          class="btn btn-secondary"
          name=""
          id="typesearchselect"
        >
          <option value="All">全選</option>
          <option value="Availability">稼動率</option>
          <option value="YieId">良率</option>
          <option value="Performance">生產效率</option>
          <option value="OEE">設備綜合效率</option>
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
    <div>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">日期</th>
            <!-- <th scope="col" title="預設24小時">最大產能(小時)</th>
            <th scope="col" title="">品名</th>
            <th scope="col" title="組裝機標準產能">標準產能(PCS)</th>
            <th scope="col" title="組裝機">預計投入(小時)</th>
            <th scope="col" title="預計投入時間 - 無開機工時">
              計畫開機(小時)
            </th> -->
            <th scope="col" title="計畫開機工時 - 損失工時">實際投入(小時)</th>
            <th scope="col" title="實際產出數量 / 標準產能">實際產出(小時)</th>
            <th scope="col" title="全檢機">實際產出數量</th>
            <th scope="col" title="預計投入工時 / 最大產能工時">
              產能利用率(%)
            </th>
            <th scope="col" title="計畫開機工時/預計投入工時">時間稼動率(%)</th>
            <th scope="col">設備稼動率(%)</th>
            <th scope="col">良率(%)</th>
            <th scope="col">生產效率(%)</th>
            <th scope="col" title="稼動率*良率*生產效率">綜合稼動率(%)</th>
            <th scope="col" title="全檢機">無開機工時(小時)</th>
            <th scope="col" title="全檢機">停機10分鐘以上(小時)</th>
            <th scope="col" title="測試機+全檢機">總不良數</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in arrTableList">
            <td>{{ item.Date }}</td>
            <!-- <td>{{ item.MCT }}</td>
            <td>{{ item.Product_Name }}</td>
            <td>{{ item.SC }}</td>
            <td>{{ item.ETC }}</td>
            <td>{{ item.PT }}</td> -->
            <td>{{ item.ACT }}</td>
            <td>{{ item.ACTH }}</td>
            <td>{{ numberfilter(item.AO) }}</td>
            <td>{{ item.CAPU }}</td>
            <td>{{ item.ADR }}</td>
            <td :class="{ 'red-text': parseFloat(item.Availability) < 85.0 }">
              {{ item.Availability }}
            </td>
            <td :class="{ 'red-text': parseFloat(item.YieId) < 98.0 }">
              {{ item.YieId }}
            </td>
            <td :class="{ 'red-text': parseFloat(item.Performance) < 85.0 }">
              {{ item.Performance }}
            </td>
            <td :class="{ 'red-text': parseFloat(item.OEE) < 85.0 }">
              {{ item.OEE }}
            </td>
            <td>{{ item.NonTime }}</td>
            <td>{{ item.StopRunTime }}</td>
            <td>{{ item.AllNGS }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<style scoped>
.red-text {
  color: red;
}
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

  #oneLineChart {
    width: 75svw;
    height: 30svw;
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
