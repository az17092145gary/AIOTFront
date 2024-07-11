<script setup>
import { ref, inject, onMounted } from "vue";

const axios = inject("axios");
// 後端網址
const APIUrl = inject("APIUrl");
const VueCookies = inject("VueCookies");
const numberfilter = inject("numberfilter");
const arritem = ref([]);

const arrDataList = ref([]);
const strtime = ref(VueCookies.get("strtime"));
const endtime = ref(VueCookies.get("endtime"));
const item = ref(VueCookies.get("item"));
const product = ref(VueCookies.get("product"));
const line = ref(VueCookies.get("line"));
const arrProduct = ref([]);
const arrLine = ref([]);
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
    url: APIUrl + "getOneLineData",
    params: {
      startTime: strtime.value,
      endTime: endtime.value,
      item: item.value,
      product: product.value,
      line: line.value,
      reporttype: "date",
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
const saveReMark = (value, date) => {
  axios({
    method: "post",
    url: APIUrl + "saveReMark",
    data: {
      item: item.value,
      product: product.value,
      line: line.value,
      date: date,
      value: value,
    },
  })
    .then((res) => {
      alert("ReMark已儲存");
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
    <h1>單線三率明細表</h1>
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
        >
          <option selected v-for="lineData in arrLine">{{ lineData }}</option>
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
            <th scope="col">日期</th>
            <th scope="col" title="預設24小時">最大產能(小時)</th>
            <th scope="col" title="">品名</th>
            <th scope="col" title="組裝機標準產能">標準產能(PCS)</th>
            <th scope="col" title="組裝機">預計投入(小時)</th>
            <th scope="col" title="預計投入時間 - 無開機工時">
              計畫開機(小時)
            </th>
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
            <th scope="col">備註</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in arrDataList">
            <td>{{ item.Date }}</td>
            <td>{{ item.MCT }}</td>
            <td>{{ item.Product_Name }}</td>
            <td>{{ item.SC }}</td>
            <td>{{ item.ETC }}</td>
            <td>{{ item.PT }}</td>
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
            <td>
              <textarea v-model="item.ReMark" placeholder="請輸入...">{{
                item.ReMark
              }}</textarea>
            </td>
            <td>
              <button
                class="btn btn-primary"
                @click="saveReMark(item.ReMark, item.Date)"
              >
                儲存
              </button>
            </td>
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
