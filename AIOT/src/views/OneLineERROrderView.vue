<script setup>
import { ref, inject, onMounted } from 'vue'
import avgErrChart from '../components/BarChart.vue'
import { LineElement } from 'chart.js';

const axios = inject('axios');
// 後端網址
const APIUrl = inject('APIUrl');
// 重製圖表
const arritem = ref([]);
const item = ref(null);
const product = ref(null);
const line = ref(null);
const startTime = ref(null);
const endTime = ref(null);
const deviceName = ref(null);
const arrLine = ref([]);
const arrProduct = ref([]);
const arrDeviceName = ref([]);
const type = ref(null);
const arrDataList = ref([]);
//後端取得現有的設備
const getDeviceData = () => {
    axios({
        method: 'get',
        url: APIUrl + "getDeviceName",
        params: { item: item.value, line: line.value, product: product.value },
    }).then((res) => {
        arrDeviceName.value = res.data;
        deviceName.value = 'All';
        type.value = 'ERR';
    }).catch((err) => {
        if (err.code === 'ERR_NETWORK') {
            alert("查詢設備異常，請重新整理");
        }

    });
};
//後端取得資料庫現有的線號
const getLineData = () => {
    axios({
        method: 'get',
        url: APIUrl + "getAllLine",
        params: {
            product: product.value
        }
    }).then(function (res) {
        arrLine.value = res.data;
        line.value = arrLine.value[0];
        type.value = 'ERR';
        getDeviceData();

    }).catch((err) => {
        if (err.code === 'ERR_NETWORK') {
            alert("查詢線號異常，請重新整理。");
            return;
        }
    });
}
//後端取得現有的Product
const getProductData = () => {
    axios({
        method: 'get',
        url: APIUrl + "getAllProduct",
        params: { item: item.value },
    }).then(function (res) {
        arrProduct.value = res.data;
        product.value = arrProduct.value[0];
        type.value = 'ERR';
        getLineData();
    }).catch((err) => {
        if (err.code === 'ERR_NETWORK') {
            alert("查詢產品異常，請重新整理。");
            return;
        }
    });
}
const getItemData = () => {
    axios({
        method: 'get',
        url: APIUrl + "getAllItem",
    }).then(function (res) {
        arritem.value = res.data;
        item.value = arritem.value[0];
        type.value = 'ERR';
        getProductData();
    }).catch((err) => {
        if (err.code === 'ERR_NETWORK') {
            alert("查詢產品異常，請重新整理。");
            return;
        }
    });
}
getItemData();

const getData = () => {
    axios({
        method: 'get',
        url: APIUrl + 'getOneLineERROrder',
        params: {
            startTime: startTime.value, endTime: endTime.value, item: item.value, product: product.value, line: line.value, type: type.value, device: deviceName.value
        }
    }).then((res) => {
        arrDataList.value = res.data;
    }).catch((err) => {
        if (err.code === 'ERR_NETWORK') {
            alert("查詢異常");
            return;
        }
        if (err.response.status === 404) {
            alert("查無資料");
            return;
        }
    });
}
const btnsearch = () => {
    getData();
}
</script>
<template>
    <div style="display: flex; flex-direction: column;justify-content: center; align-items: center;">
        <h1>異常碼明細表</h1>
        <div id="divsearchBar" style="display: flex;">
            <span class="btn btn-secondary">開始日期:<input v-model="startTime" class="btn btn-secondary" type="date"
                    id="startTime" /></span>
            <span class="btn btn-secondary">結束日期:<input v-model="endTime" class="btn btn-secondary" type="date"
                    id="endTime" /></span>
            <span class="btn btn-secondary">分類:<select v-model="item" class="btn btn-secondary" name=""
                    id="itemSearchSelect" @change="getProductData">
                    <option v-for=" itemData  in  arritem ">{{ itemData }}</option>
                </select></span>
            <span class="btn btn-secondary">產品:<select v-model="product" class="btn btn-secondary" name=""
                    id="productSearchSelect" @change="getLineData">
                    <option v-for="productData in arrProduct">{{ productData }}</option>
                </select></span>
            <span class="btn btn-secondary">產線:<select v-model="line" class="btn btn-secondary" name=""
                    id="linesearchselect" @change="getDeviceData">
                    <option selected v-for="lineData in arrLine">{{ lineData }}</option>
                </select></span>
            <span class="btn btn-secondary">設備:<select v-model="deviceName" class="btn btn-secondary" name=""
                    id="devicesearchselect">
                    <option value="All">全選</option>
                    <option v-for="devicenameData in arrDeviceName">{{ devicenameData }}</option>
                </select></span>
            <span class="btn btn-secondary">種類:<select v-model="type" class="btn btn-secondary" name=""
                    id="typesearchselect">
                    <option value="ERR">臨停</option>
                    <option value="PAT" hidden>缺料</option>
                    <option value="NGI">不良分類</option>
                </select></span>
            <span class="btn btn-secondary"> <button class="btn btn-secondary" @click="btnsearch">搜尋</button></span>
        </div>
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
                    <td>{{ item.Time }} </td>
                    <td>{{ item.Deposit }}</td>
                    <td>{{ item.ERRName }}</td>
                    <td>{{ item.Count }}</td>
                </tr>
            </tbody>
        </table>

    </div>
</template>
<style scoped>
table {
    width: 100svw;
}

thead {
    text-align: center;
}

tbody {
    text-align: center;
    /* 將表格中的值設置為右對齊 */
}
tbody td{
    white-space: pre-line;
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