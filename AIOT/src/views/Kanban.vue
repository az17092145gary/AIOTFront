<script setup>
import {
  inject,
  ref,
  onMounted,
  getCurrentInstance,
  watch,
  onUnmounted,
} from "vue";
import { useRouter } from "vue-router";
//稼動率圖表
import AvailabilityChartView from "../components/BarChart.vue";
//良率圖表
import YieIdChartView from "../components/BarChart.vue";
//生產效率圖表
import PerformanceChartView from "../components/BarChart.vue";
//平均臨停圖表
import AVGStopCountChartView from "../components/BarChart.vue";

const axios = inject("axios");
const APIUrl = inject("APIUrl");
const route = getCurrentInstance();
const router = useRouter();
const productList = ref([]);
const itemName = ref(null);
const itemList = ref([]);
const productName = ref(null);
const arrList = ref([]);
const arrAvailabilityList = ref([]);
const arrYieIdList = ref([]);
const arrPerformanceList = ref([]);
const arrAVGStopCountList = ref([]);
const btntimeCountdown = ref("Stop");

const arrTargetAvailabilityList = ref([]);
const arrTargetYieIdList = ref([]);
const arrTargetPerformanceList = ref([]);
const arrTargetAVGStopCountList = ref([]);

const tempArrList = ref([]);
const tempBarArrList = ref([]);
const tempYAvailabilityList = ref([]);
const tempYYieIdList = ref([]);
const tempYPerformanceList = ref([]);
const tempYAVGStopCountList = ref([]);

//設定15秒，自動從後端撈取資料
const seconds = ref(15);
const timer = ref(null);

//網頁重新渲染
const componentKey = ref(0);
const forceRerender = () => {
  componentKey.value += 1;
};

const AvailabilityViewData = ref({ labels: [], datasets: [] });
const AvailabilityOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    datalabels: {
      display: false,
      font: {
        size: 20,
      },
      color: "black",
    },
    title: {
      display: true,
      text: "稼動率",
      font: {
        size: 30,
      },
      color: "black",
    },
    legend: {
      display: false,
      // labels: {
      //   font: {
      //     size: 15, // 设置图例标签的字体大小为14像素
      //   },
      // },
    },
    point: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
        color: "black",
      },
      ticks: {
        color: "black",
        font: {
          size: 15,
          fontcolor: "black",
          weight: "bold",
        },
      },
    },
    y: {
      grid: {
        display: false,
        color: "black",
      },
      ticks: {
        color: "black",
        font: {
          size: 15,
          fontcolor: "black",
        },
      },
    },
  },
});
const YieIdViewData = ref({ labels: [], datasets: [] });
const YieIdViewOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    datalabels: {
      display: false,
      font: {
        size: 20,
      },
      color: "black",
    },
    title: {
      display: true,
      text: "良率",
      font: {
        size: 30,
      },
      color: "black",
    },
    legend: {
      display: false,
      // labels: {
      //   font: {
      //     size: 15, // 设置图例标签的字体大小为14像素
      //   },
      // },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
        color: "black",
      },
      ticks: {
        color: "black",
        font: {
          size: 15,
          fontcolor: "black",
          weight: "bold",
        },
      },
    },
    y: {
      grid: {
        display: false,
        color: "black",
      },
      ticks: {
        color: "black",
        font: {
          size: 15,
          fontcolor: "black",
        },
      },
    },
  },
});
const PerformanceViewData = ref({ labels: [], datasets: [] });
const PerformanceViewOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    datalabels: {
      display: false,
      font: {
        size: 20,
      },
      color: "black",
    },
    title: {
      display: true,
      text: "生產效率",
      font: {
        size: 30,
      },
      color: "black",
    },
    legend: {
      display: false,
      // labels: {
      //   font: {
      //     size: 15, // 设置图例标签的字体大小为14像素
      //   },
      // },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
        color: "black",
      },
      ticks: {
        color: "black",
        font: {
          size: 15,
          fontcolor: "black",
          weight: "bold",
        },
      },
    },
    y: {
      grid: {
        display: false,
        color: "black",
      },
      ticks: {
        color: "black",
        font: {
          size: 15,
          fontcolor: "black",
        },
      },
    },
  },
});
const AVGStopCountViewData = ref({ labels: [], datasets: [] });
const AVGStopCountViewOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    datalabels: {
      display: false,
      font: {
        size: 20,
      },
      color: "black",
    },
    title: {
      display: true,
      text: "平均臨停",
      font: {
        size: 30,
      },
      color: "black",
    },
    legend: {
      display: false,
      // labels: {
      //   font: {
      //     size: 15, // 设置图例标签的字体大小为14像素
      //   },
      // },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
        color: "black",
      },
      ticks: {
        color: "black",
        font: {
          size: 15,
          fontcolor: "black",
          weight: "bold",
        },
      },
    },
    y: {
      grid: {
        display: false,
        color: "black",
      },
      ticks: {
        color: "black",
        font: {
          size: 15,
          fontcolor: "black",
        },
      },
    },
  },
});
const getKanBanProduct = (value) => {
  axios({
    method: "get",
    url: APIUrl + "getKanBanProduct",
    params: { item: value },
  })
    .then((res) => {
      productList.value = res.data;
      //預設第一個參數給Product
      if (productName.value === null) {
        productName.value = productList.value[0];
      }

      getKanBanData(itemName.value);
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
const getKanBanData = (value) => {
  // console.log(new Date());
  axios({
    method: "get",
    url: APIUrl + "getKanBanData",
    params: { item: value },
  })
    .then((res) => {
      arrList.value = res.data;
      tempArrList.value = res.data;
      productClick(productName.value);
    })
    .catch((err) => {
      if (err.code === "ERR_NETWORK") {
        alert("查詢異常");
        return;
      }
      // if (err.response.status === 404) {
      //   alert("查無資料");
      //   tempArrList.value = null;
      //   arrList.value = null;
      //   return;
      // }
    });
};
//更新路由
const updateRouteWithReplace = (value) => {
  router.replace({
    query: {
      targetItem: value,
      ItemList: itemList.value,
    },
  });
};
const itemClick = (value) => {
  itemName.value = value;
  productName.value = null;
  updateRouteWithReplace(value);
  getKanBanProduct(itemName.value);
};
const productClick = (value) => {
  productName.value = value;
  tempArrList.value = arrList.value;
  tempArrList.value = tempArrList.value.filter(
    (item) => item.ProductName === productName.value
  );
  //重製圖表數據
  arrAvailabilityList.value = [];
  arrYieIdList.value = [];
  arrPerformanceList.value = [];
  arrAVGStopCountList.value = [];
  arrTargetAvailabilityList.value = [];
  arrTargetYieIdList.value = [];
  arrTargetPerformanceList.value = [];
  arrTargetAVGStopCountList.value = [];
  tempYAVGStopCountList.value = [];
  tempYYieIdList.value = [];
  tempYAvailabilityList.value = [];
  tempYPerformanceList.value = [];
  AvailabilityViewData.value.labels = [];
  AvailabilityViewData.value.datasets = [];
  YieIdViewData.value.labels = [];
  YieIdViewData.value.datasets = [];
  PerformanceViewData.value.labels = [];
  PerformanceViewData.value.datasets = [];
  AVGStopCountViewData.value.labels = [];
  AVGStopCountViewData.value.datasets = [];
  tempBarArrList.value = tempArrList.value.filter(
    (item) => item.State !== "完成" && item.State !== null
  );
  //排序稼動率
  // tempBarArrList.value.sort((a, b) => {
  //   return a.Availability - b.Availability;
  // });
  tempBarArrList.value.forEach((item) => {
    arrAvailabilityList.value.push(item.Availability);
    arrTargetAvailabilityList.value.push(85);
    tempYAvailabilityList.value.push(item.LineName);
  });
  //排序良率
  // tempBarArrList.value.sort((a, b) => {
  //   return a.YieId - b.YieId;
  // });
  tempBarArrList.value.forEach((item) => {
    arrYieIdList.value.push(item.YieId);
    arrTargetYieIdList.value.push(98);
    tempYYieIdList.value.push(item.LineName);
  });
  //排序生產效率
  // tempBarArrList.value.sort((a, b) => {
  //   return a.Performance - b.Performance;
  // });

  tempBarArrList.value.forEach((item) => {
    // 生產效率超過100界定為99
    arrPerformanceList.value.push(
      item.Performance > 100 ? 99 : item.Performance
    );
    arrTargetPerformanceList.value.push(85);
    tempYPerformanceList.value.push(item.LineName);
  });
  //排序平均臨停
  // tempBarArrList.value.sort((a, b) => {
  //   return b.AVGStopCount - a.AVGStopCount;
  // });

  tempBarArrList.value.forEach((item) => {
    arrAVGStopCountList.value.push(item.AVGStopCount);
    arrTargetAVGStopCountList.value.push(0.5);
    tempYAVGStopCountList.value.push(item.LineName);
  });
  //圖表匯入資料
  AvailabilityViewData.value.labels = tempYAvailabilityList.value;
  AvailabilityViewData.value.datasets.push({
    type: "bar",
    label: "稼動率",
    backgroundColor: arrAvailabilityList.value.map((value) =>
      parseFloat(value) > 85.0 ? "#008000" : "#FF0000"
    ),
    barThickness: 15,
    order: 2,
    yAxisID: "y",
    xAxisID: "x",
    data: arrAvailabilityList.value,
  });
  AvailabilityViewData.value.datasets.push({
    type: "line",
    label: "目標值",
    backgroundColor: "#0000FF",
    borderColor: "#0000FF",
    pointRadius: 0,
    borderWidth: 1,
    order: 1,
    data: arrTargetAvailabilityList.value,
  });
  YieIdViewData.value.labels = tempYYieIdList.value;
  YieIdViewData.value.datasets.push({
    type: "bar",
    label: "良率",
    backgroundColor: arrYieIdList.value.map((value) =>
      parseFloat(value) > 98.0 ? "#008000" : "#FF0000"
    ),
    barThickness: 15,
    order: 2,
    yAxisID: "y",
    xAxisID: "x",
    data: arrYieIdList.value,
  });
  YieIdViewData.value.datasets.push({
    type: "line",
    label: "目標值",
    backgroundColor: "#0000FF",
    borderColor: "#0000FF",
    pointRadius: 0,
    borderWidth: 1,
    order: 1,
    data: arrTargetYieIdList.value,
  });
  PerformanceViewData.value.labels = tempYPerformanceList.value;
  PerformanceViewData.value.datasets.push({
    type: "bar",
    label: "生產效率",
    backgroundColor: arrPerformanceList.value.map((value) => {
      return parseFloat(value) > 85.0 ? "#008000" : "#FF0000";
    }),
    barThickness: 15,
    order: 2,
    yAxisID: "y",
    xAxisID: "x",
    data: arrPerformanceList.value,
  });
  PerformanceViewData.value.datasets.push({
    type: "line",
    label: "目標值",
    backgroundColor: "#0000FF",
    borderColor: "#0000FF",
    pointRadius: 0,
    borderWidth: 1,
    order: 1,
    data: arrTargetPerformanceList.value,
  });
  AVGStopCountViewData.value.labels = tempYAVGStopCountList.value;
  AVGStopCountViewData.value.datasets.push({
    type: "bar",
    label: "平均臨停",
    backgroundColor: arrAVGStopCountList.value.map((value) => {
      // console.log(parseFloat(value));
      return parseFloat(value) < 0.5 ? "#008000" : "#FF0000";
    }),
    barThickness: 15,
    order: 2,
    yAxisID: "y",
    xAxisID: "x",
    data: arrAVGStopCountList.value,
  });
  AVGStopCountViewData.value.datasets.push({
    type: "line",
    label: "目標值",
    backgroundColor: "#0000FF",
    borderColor: "#0000FF",
    pointRadius: 0,
    borderWidth: 1,
    order: 1,
    data: arrTargetAVGStopCountList.value,
  });
  forceRerender();
};
const StartAndStopTimer = () => {
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
    btntimeCountdown.value = "Start";
  } else {
    timer.value = setInterval(() => {
      if (seconds.value === 0) {
        seconds.value = 15;
        getKanBanData(itemName.value);
      } else {
        seconds.value--;
      }
    }, 1000);
    btntimeCountdown.value = "Stop";
  }
};
onMounted(() => {
  itemName.value = route.proxy.$router.currentRoute.value.query.targetItem;
  itemList.value = route.proxy.$router.currentRoute.value.query.ItemList;
  getKanBanProduct(itemName.value);
  //重新刷新資料
  timer.value = setInterval(() => {
    if (seconds.value === 0) {
      seconds.value = 15;
      getKanBanData(itemName.value);
    } else {
      seconds.value--;
    }
  }, 1000);
});
onUnmounted(() => {
  if (timer.value) clearInterval(timer.value);
});

//監控傳遞的參數如果有變的話，更新ItemName
watch(
  () => route.proxy.$router.currentRoute.value.query.item,
  (newValue) => {
    itemName.value = newValue;
  }
);
</script>
<template>
  <div
    class="container-fluid position-relative d-flex p-0"
    style="background: black"
  >
    <!-- Sidebar Start -->
    <div class="sidebar pe-4 pb-3">
      <nav class="navbar bg-secondary navbar-dark">
        <button
          v-for="data in itemList"
          class="itembutton w-100"
          :class="{ itemActive: data === itemName }"
          @click="itemClick(data)"
        >
          {{ data }}
        </button>

        <div class="navbar-nav" style="display: flex; flex-direction: row">
          <button
            v-for="data in productList"
            class="productbutton"
            :class="{ productActive: data === productName }"
            @click="productClick(data)"
          >
            {{ data }}
          </button>
        </div>
      </nav>
    </div>
    <!-- Sidebar End -->

    <!-- Content Start -->
    <div class="content">
      <!-- Sales Chart Start -->
      <div class="container-fluid pt-4 px-4">
        <div class="row g-4">
          <div class="col-sm-12 col-xl-3">
            <div class="bg-secondary text-center rounded p-4">
              <div style="height: 250px">
                <PerformanceChartView
                  :key="componentKey"
                  :data="PerformanceViewData"
                  :options="PerformanceViewOptions"
                  style="background-color: White"
                />
              </div>
            </div>
          </div>
          <div class="col-sm-12 col-xl-3">
            <div class="bg-secondary text-center rounded p-4">
              <div style="height: 250px">
                <AvailabilityChartView
                  :key="componentKey"
                  :data="AvailabilityViewData"
                  :options="AvailabilityOptions"
                  style="background-color: White"
                />
              </div>
            </div>
          </div>
          <div class="col-sm-12 col-xl-3">
            <div class="bg-secondary text-center rounded p-4">
              <div style="height: 250px">
                <YieIdChartView
                  :key="componentKey"
                  :data="YieIdViewData"
                  :options="YieIdViewOptions"
                  style="background-color: White"
                />
              </div>
            </div>
          </div>
          <div class="col-sm-12 col-xl-3">
            <div class="bg-secondary text-center rounded p-4">
              <div style="height: 250px">
                <AVGStopCountChartView
                  :key="componentKey"
                  :data="AVGStopCountViewData"
                  :options="AVGStopCountViewOptions"
                  style="background-color: White"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Sales Chart End -->

      <!-- Recent Sales Start -->
      <div class="container-fluid pt-4 px-4">
        <div class="timeCountdown">
          <button class="btn btn-primary" @click="StartAndStopTimer">
            {{ btntimeCountdown }}
          </button>
          <h6>更新倒數 : {{ seconds }}</h6>
        </div>
        <div class="bg-secondary text-center rounded p-4">
          <div class="table-responsive">
            <table
              class="table text-start align-middle table-bordered table-hover mb-0"
            >
              <thead>
                <tr class="text-white">
                  <th scope="col">產線</th>
                  <th scope="col">狀態</th>
                  <th scope="col">狀態時間(分鐘)</th>
                  <th scope="col">工單編號</th>
                  <th scope="col" hidden>產品</th>
                  <th scope="col">產品名稱</th>
                  <th scope="col">標準產能</th>
                  <th scope="col">預計工時</th>
                  <th scope="col">計畫工時</th>
                  <th scope="col">實際工時</th>
                  <th scope="col">實際產出量</th>
                  <th scope="col">生產效率(85%)</th>
                  <th scope="col">設備稼動率(85%)</th>
                  <th scope="col">良率(98%)</th>
                  <th scope="col">平均臨停次數(次/小時)</th>
                  <th scope="col">總不良數</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="data in tempArrList" :key="data.id">
                  <td>{{ data.LineName }}</td>
                  <td>{{ data.State }}</td>
                  <td
                    :class="{ 'red-text': parseFloat(data.ModelSumTime) > 5.0 }"
                  >
                    {{ data.ModelSumTime == 0 ? null : data.ModelSumTime }}
                  </td>
                  <td>{{ data.WorkCode }}</td>
                  <td hidden>{{ data.ProductName }}</td>
                  <td>{{ data.Product_Name }}</td>
                  <td>{{ data.SC }}</td>
                  <td>{{ data.ETC }}</td>
                  <td>{{ data.PT }}</td>
                  <td>{{ data.ACT }}</td>
                  <td>{{ data.AO }}</td>
                  <td
                    :class="{ 'red-text': parseFloat(data.Performance) < 85.0 }"
                  >
                    {{ data.Performance > 100 ? 99 : data.Performance }}
                  </td>
                  <td
                    :class="{
                      'red-text': parseFloat(data.Availability) < 85.0,
                    }"
                  >
                    {{ data.Availability }}
                  </td>
                  <td :class="{ 'red-text': parseFloat(data.YieId) < 98.0 }">
                    {{ parseFloat(data.YieId) === 0 ? "" : data.YieId }}
                  </td>
                  <td
                    :class="{ 'red-text': parseFloat(data.AVGStopCount) > 0.5 }"
                  >
                    {{ data.AVGStopCount }}
                  </td>
                  <td>{{ data.AllNGS }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <!-- Recent Sales End -->
    </div>
    <!-- Content End -->
  </div>
</template>

<style scoped>
@import "../css/KanBanstyle.css";
</style>
