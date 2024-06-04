<script setup>
import { ref, inject, onMounted } from "vue";
import Loading from "@/components/Loading.vue";

const axios = inject("axios");
const formatDate = inject("formatDate");
// 後端網址
const APIUrl = inject("APIUrl");
const arrDataList = ref([]);
const arrERRCodeDataList = ref([]);
const arritem = ref([]);
const item = ref(null);
const product = ref(null);
const line = ref(null);
const deviceName = ref(null);
const arrLine = ref([]);
const arrProduct = ref([]);
const arrDeviceName = ref([]);
const trunoffLoading = ref(false);
const stopTime = ref("");
const type = ref(null);
const AllTime = ref(0.0);
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
      type.value = "Up";
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
      line.value = arrLine.value[0];
      type.value = "Up";
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
      product.value = arrProduct.value[0];

      type.value = "Up";
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
      type.value = "Up";
      getProductData();
    })
    .catch((err) => {
      if (err.code === "ERR_NETWORK") {
        alert("查詢產品異常，請重新整理。");
        return;
      }
    });
};
getItemData();
const getData = () => {
  axios({
    method: "get",
    url: APIUrl + "getStopTimeTable",
    params: {
      startTime: strtime.value,
      endTime: endtime.value,
      item: item.value,
      product: product.value,
      line: line.value,
      type: type.value,
      device: deviceName.value,
    },
  })
    .then((res) => {
      arrDataList.value = res.data;
      AllTime.value = 0;
      arrDataList.value.forEach((item) => {
        AllTime.value += item.SumTime;
      });
    })
    .catch((err) => {
      arrDataList.value = [];
      AllTime.value = 0.0;
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
const getERRCode = (strtime, endtime, itemdevice) => {
  trunoffLoading.value = true;
  arrERRCodeDataList.value = [];
  stopTime.value = formatDate(strtime);
  if (strtime === "" && strtime === null) {
    alert("時間抓取異常，請稍後在操作");
  }
  if (endtime === "" && endtime === null) {
    alert("時間抓取異常，請稍後在操作");
  }
  if (itemdevice === "" && itemdevice === null) {
    alert("設備抓取異常，請稍後在操作");
  }
  axios({
    method: "get",
    url: APIUrl + "getStopTimeTableERRCode",
    params: { strtime: strtime, endtime: endtime, device: itemdevice },
  })
    .then((res) => {
      arrERRCodeDataList.value = res.data;
      trunoffLoading.value = false;
    })
    .catch((err) => {
      trunoffLoading.value = false;
      arrERRCodeDataList.value = [];
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
  getData();
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
    <h1>機台停機時間明細表</h1>
    <div id="divsearchBar" style="display: flex">
      <span class="btn btn-secondary"
        >開始日期:<input
          v-model="strtime"
          class="btn btn-secondary"
          type="date"
          id="strtime"
      /></span>
      <span class="btn btn-secondary"
        >結束日期:<input
          v-model="endtime"
          class="btn btn-secondary"
          type="date"
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
          <option value="Up">10分鐘以上</option>
          <option value="Down">10分鐘以下</option>
        </select></span
      >
      <span class="btn btn-secondary">
        <button class="btn btn-secondary" @click="btnsearch">搜尋</button></span
      >
    </div>
    <div>
      <p class="btn btn-success" style="width: 26svw; height: 4svh">
        <span>總停機時間:</span>{{ AllTime.toFixed(2) }}<span>分</span>
      </p>
    </div>
    <div>
      <table id="fristTable" class="table">
        <thead>
          <tr>
            <th scope="col">設備名稱</th>
            <th scope="col">日期</th>
            <th scope="col">開始時間</th>
            <th scope="col">結束時間</th>
            <th scope="col">花費時間(分鐘)</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in arrDataList">
            <td>{{ item.DeviceName }}</td>
            <td>{{ item.Date }}</td>
            <td>{{ formatDate(item.StartTime) }}</td>
            <td>{{ formatDate(item.EndTime) }}</td>
            <td>{{ item.SumTime.toFixed(2) }}</td>
            <td>
              <button
                @click="
                  getERRCode(item.StartTime, item.EndTime, item.DeviceName)
                "
                type="button"
                class="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop"
              >
                異常碼
              </button>
            </td>
          </tr>
        </tbody>
      </table>
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
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">
            停機時間:{{ stopTime }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body" style="box-sizing: border-box">
          <div class="modalTable">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">設備名稱</th>
                  <th scope="col">時間</th>
                  <th scope="col">錯誤訊息</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ERRCodeitem in arrERRCodeDataList">
                  <td>{{ ERRCodeitem.DeviceName }}</td>
                  <td>{{ formatDate(ERRCodeitem.Time) }}</td>
                  <td>{{ ERRCodeitem.Description }}</td>
                </tr>
              </tbody>
            </table>
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
  <Loading v-if="trunoffLoading" />
</template>
<style scoped>
thead {
  text-align: center;
}

tbody {
  text-align: center;
  white-space: nowrap;
}

table {
  width: 100svw;
}

.modal-body {
  overflow: auto;
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
}

@media screen and (max-width: 1023px) {
  /* 中等屏幕样式 */
  span {
    margin: 0.15svw;
  }

  option {
    text-align: center;
  }
}

@media screen and (max-width: 600px) {
  span {
    margin: 0.125svw;
  }

  option {
    text-align: center;
  }

  #divsearchBar {
    flex-direction: column;
  }
}
</style>
