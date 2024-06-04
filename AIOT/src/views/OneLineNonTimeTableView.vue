<script setup>
import { ref, inject } from "vue";

const axios = inject("axios");
// 後端網址
const APIUrl = inject("APIUrl");
const arritem = ref([]);
const item = ref(null);
const arrDataList = ref([]);
const product = ref(null);
const line = ref(null);
const strtime = ref(null);
const endtime = ref(null);
const arrProduct = ref([]);
const arrLine = ref([]);
const arrDeviceName = ref([]);
const deviceName = ref(null);
//後端取得資料庫現有的線號
const getDeviceData = () => {
  axios({
    method: "get",
    url: APIUrl + "getDeviceName",
    params: { item: item.value, line: line.value, product: product.value },
  })
    .then((res) => {
      arrDeviceName.value = res.data;
      deviceName.value = "All";
    })
    .catch((err) => {
      if (err.code === "ERR_NETWORK") {
        alert("查詢設備異常，請重新整理");
      }
    });
};
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
    url: APIUrl + "getOneLineNonTimeData",
    params: {
      startTime: strtime.value,
      endTime: endtime.value,
      item: item.value,
      product: product.value,
      line: line.value,
      device: deviceName.value,
    },
  })
    .then((res) => {
      arrDataList.value = res.data;
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
  getData();
};
const numberfilter = (value) => {
  return value.replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
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
    <h1>單線缺料、機故明細表</h1>
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
      <span class="btn btn-secondary">
        <button class="btn btn-secondary" @click="btnsearch">搜尋</button></span
      >
    </div>
    <div>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">設備名稱</th>
            <th scope="col">項目名稱</th>
            <th scope="col">日期</th>
            <th scope="col">開始時間</th>
            <th scope="col">結束時間</th>
            <th scope="col">花費時間(分鐘)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in arrDataList">
            <td>{{ item.DeviceName }}</td>
            <td>{{ item.Description }}</td>
            <td>{{ item.Date }}</td>
            <td>{{ item.StartTime }}</td>
            <td>{{ item.EndTime }}</td>
            <td>{{ item.SumTime }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
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
