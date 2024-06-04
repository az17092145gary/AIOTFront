<script setup>
import { ref, inject, computed, watch, onMounted } from 'vue';
import oneLineChart from '../components/BarChart.vue'

const APIUrl = inject('APIUrl');
const axios = inject('axios');
const componentKey = ref(0);
const forceRerender = () => {
    componentKey.value += 1;
};

var arrlist = ref([]);
const arritem = ref([]);
const item = ref(null);
const arrDate = ref([]);
const arrLine = ref([]);
const product = ref(null);
const reporttype = ref(null);
const type = ref(null);
const strtime = ref(null);
const endtime = ref(null);
const arrProduct = ref([]);
const arrCheckBox = ref([]);
const allCheckBox = ref(false);
//如果超過下列的顏色會出現問題
// const arrBorderColor = ref(['#3498db', '#2ecc71', '#e74c3c', '#9b59b6', '#95a5a6']);
const oneLineChartData = ref({ labels: [], datasets: [] });
const oneLinChartOptions = ref({
    responsive: true,
    maintainAspectRatio: false
});

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
        type.value = 'Availability';

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

        type.value = 'Availability';
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

        type.value = 'Availability';
        getProductData();
    }).catch((err) => {
        if (err.code === 'ERR_NETWORK') {
            alert("查詢產品異常，請重新整理。");
            return;
        }
    });
}
getItemData();
//後端取值
const getData = () => {
    axios({
        method: 'post',
        url: APIUrl + 'getMoreLinePerformanceData',
        data: {
            startDate: strtime.value,
            endDate: endtime.value,
            item: item.value,
            product: product.value,
            selectType: type.value,
            arrLine: arrCheckBox.value,
        }
    }).then(function (res) {
        arrlist.value = res.data;
        // 清空datasets，重製x軸
        arrDate.value = [];
        oneLineChartData.value.datasets = [];
        let arrX = [];
        let arrY = [];
        let count1 = 100;
        let count2 = 10;
        arrlist.value.forEach((item, index) => {
            arrX.push(item.Line);
            arrY.push(count1 - count2);
            count2 += 10;
        });
        oneLineChartData.value.datasets.push({
            type: 'bar',
            label: '排名',
            backgroundColor: '#33D1FF',
            borderColor: '#33D1FF',
            barThickness: 50,
            order: 1,
            data: arrY,
            yAxisID: 'y2',
            datalabels: {
                align: 'end',
                anchor: 'end'
            },
        });
        oneLineChartData.value.labels = arrX;
        oneLinChartOptions.value = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                datalabels: {
                    formatter: function (value, context) {
                        return (count1 - value) / 10;
                    },

                    backgroundColor: function (context) { return context.dataset.borderColor; },
                    borderRadius: 4,
                    color: 'white',
                    font: {
                        weight: 'bold'
                    },
                    // formatter: Math.round,移除小數點
                    padding: 6
                }
            },
            scales: {
                y2: {
                    type: 'linear',
                    display: false,
                    position: 'left',
                    min: 0,
                    max: 100,
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        };
        //重新渲染
        forceRerender();
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
    getData();
}
watch(allCheckBox, (newVal) => {
    arrCheckBox.value = newVal ? arrLine.value.slice() : [];
});
watch(arrCheckBox, () => {
    allCheckBox.value = arrCheckBox.value.length === arrLine.value.length;
});
</script>
<template>
    <div style="display: flex; flex-direction: column;justify-content: center; align-items: center;">
        <h1>多線三率排名圖表</h1>
        <div id="divsearchBar" style="display: flex;">
            <span class="btn btn-secondary">開始日期:<input v-model="strtime" class="btn btn-secondary" type="date"
                    id="strtime" /></span>
            <span class="btn btn-secondary">結束日期:<input v-model="endtime" class="btn btn-secondary" type="date"
                    id="endtime" /></span>
            <span class="btn btn-secondary">分類:<select v-model="item" class="btn btn-secondary" name=""
                    id="itemSearchSelect" @change="getProductData">
                    <option v-for=" itemData  in  arritem ">{{ itemData }}</option>
                </select></span>
            <span class="btn btn-secondary">產品:<select v-model="product" class="btn btn-secondary" name=""
                    id="productSearchSelect" @change="getLineData">
                    <option v-for="productData in arrProduct">{{ productData }}</option>
                </select></span>
            <span class="btn btn-secondary"><button type="button" class="btn btn-secondary" data-bs-toggle="modal"
                    data-bs-target="#staticBackdrop">
                    產線
                </button></span>
            <span class="btn btn-secondary">種類:<select v-model="type" class="btn btn-secondary" name=""
                    id="typesearchselect">
                    <option value="Availability">稼動率</option>
                    <option value="YieId">良率</option>
                    <option value="Performance">生產效率</option>
                    <option value="OEE">設備綜合效率</option>
                </select></span>
            <span class="btn btn-secondary"> <button class="btn btn-secondary" @click="btnsearch">搜尋</button></span>
        </div>
        <div>
            <oneLineChart id="oneLineChart" :key="componentKey" :data="oneLineChartData" :options="oneLinChartOptions" />
        </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropLabel">Modal title</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" style="box-sizing: border-box;">

                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" v-model="allCheckBox" id="AllCheck">
                        <label class="form-check-label" for="flexCheck">全選</label>
                    </div>
                    <div class="form-check form-switch" style="display: inline-block;" v-for="item in arrLine">
                        <input class="form-check-input" type="checkbox" :value="item" :id="'flexCheck' + item"
                            v-model="arrCheckBox">
                        <label class="form-check-label" :for="'flexCheck' + item"> {{ item }}線</label>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
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