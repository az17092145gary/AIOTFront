<script setup>
import { ref, inject, onMounted } from "vue";
const APIUrl = inject("APIUrl");
const axios = inject("axios");

const arrDataList = ref([]);
const arrFilterDataList = ref([]);
const searchText = ref(null);
const part_No = ref(null);
const product_Name = ref(null);
const pcs = ref(null);
const model = ref(null);
const remark = ref(null);
const nowtype = ref(null);
const checktype = ref(false);
const checkModeltype = ref(false);

const getData = () => {
  axios({
    method: "get",
    url: APIUrl + "getSCMData",
  })
    .then((res) => {
      arrDataList.value = res.data;
      arrFilterDataList.value = arrDataList.value;
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
const filterTableDate = () => {
  if (searchText.value == null || searchText.value == "") {
    arrFilterDataList.value = arrDataList.value;
  } else {
    arrFilterDataList.value = arrDataList.value.filter((item) => {
      return (
        item.Part_No.match(searchText.value) ||
        item.Product_Name.match(searchText.value)
      );
    });
  }
};
const createORUpdateuSCM = (
  type,
  Part_No,
  Product_Name,
  PCS,
  Model,
  ReMark
) => {
  nowtype.value = type;
  remark.value = null;
  switch (type) {
    case "update":
      checktype.value = true;
      checkModeltype.value = true;
      part_No.value = Part_No;
      product_Name.value = Product_Name;
      pcs.value = PCS;
      model.value = Model;
      remark.value = ReMark;
      break;
    case "createPCS":
      checktype.value = true;
      checkModeltype.value = false;
      part_No.value = Part_No;
      product_Name.value = Product_Name;
      pcs.value = PCS;
      model.value = Model;
      break;
    case "createProduct":
      checktype.value = false;
      checkModeltype.value = false;
      part_No.value = "";
      product_Name.value = "";
      pcs.value = "";
      model.value = "";
      break;
  }
};
const updateData = () => {
  if (part_No.value === "" || part_No.value === null) {
    alert("料件不可為空");
    return;
  }
  if (product_Name.value === "" || product_Name.value === null) {
    alert("品名不可為空");
    return;
  }
  if (pcs.value === "" || pcs.value === null) {
    alert("PCS不可為空");
    return;
  }
  if (model.value === "" || model.value === null) {
    alert("模式不可為空");
    return;
  }
  axios({
    method: "post",
    url: APIUrl + "createORUpdateSCM",
    data: {
      Part_No: part_No.value,
      Product_Name: product_Name.value,
      PCS: pcs.value,
      Model: model.value,
      Type: nowtype.value,
    },
  })
    .then(() => {
      getData();
      alert("執行完成");
    })
    .catch((err) => {
      if (err.code === "ERR_NETWORK") {
        alert("查詢異常");
        return;
      }
      if (err.response.status === 404) {
        alert("執行失敗請確認資料是否正確");
        return;
      }
    });
};

onMounted(() => {
  getData();
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
    <h1>標準產能管理</h1>
    <div class="input-group mb-3 searchTable">
      <span class="input-group-text">搜尋:</span>
      <input
        v-model.trim="searchText"
        type="text"
        class="form-control"
        @keyup.enter="filterTableDate"
      />
    </div>
    <div>
      <button
        class="btn btn-primary"
        @click="createORUpdateuSCM('createProduct')"
        data-bs-toggle="modal"
        data-bs-target="#staticBackdrop"
      >
        新增品名
      </button>
      <button v-if="false">刪除</button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>料號</th>
          <th>品名</th>
          <th>PCS</th>
          <th>模式</th>
          <th>修改日期</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in arrFilterDataList">
          <td>{{ item.Part_No }}</td>
          <td>{{ item.Product_Name }}</td>
          <td>{{ item.PCS }}</td>
          <td>{{ item.Model }}</td>
          <td>{{ item.ReMark }}</td>
          <td>
            <button
              class="btn btn-secondary"
              @click="
                createORUpdateuSCM(
                  'createPCS',
                  item.Part_No,
                  item.Product_Name,
                  item.PCS,
                  item.Model,
                  item.ReMark
                )
              "
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
            >
              新增
            </button>
          </td>
          <td>
            <button
              class="btn btn-secondary"
              @click="
                createORUpdateuSCM(
                  'update',
                  item.Part_No,
                  item.Product_Name,
                  item.PCS,
                  item.Model,
                  item.ReMark
                )
              "
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
            >
              修改
            </button>
          </td>
        </tr>
      </tbody>
    </table>
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
          <h5 class="modal-title" id="staticBackdropLabel">標準產能管理</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body" style="box-sizing: border-box">
          <div
            style="display: flex; flex-direction: column"
            class="inputdatadiv"
          >
            <div class="input-group mb-3">
              <span class="input-group-text">料件:</span>
              <input
                v-model.trim="part_No"
                type="text"
                class="form-control"
                :disabled="checktype"
              />
            </div>
            <div class="input-group mb-3">
              <span class="input-group-text">品名:</span>
              <input
                v-model.trim="product_Name"
                type="text"
                class="form-control"
                :disabled="checktype"
              />
            </div>
            <div class="input-group mb-3">
              <span class="input-group-text">PCS:</span>
              <input v-model.trim="pcs" type="text" class="form-control" />
            </div>
            <div class="input-group mb-3">
              <span class="input-group-text">模式:</span>
              <input
                v-model.trim="model"
                type="text"
                class="form-control"
                :disabled="checkModeltype"
              />
            </div>
            <!-- <div class="input-group mb-3">
              
              <span class="input-group-text">上次修改日期:</span>
              <input
                v-model.trim="remark"
                type="text"
                class="form-control"
                :disabled="true"
              />
            </div> -->
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            取消
          </button>
          <button
            type="button"
            class="btn btn-primary"
            data-bs-dismiss="modal"
            @click="updateData"
          >
            確認
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
span {
  font-weight: bold;
}

@media screen and (min-width: 1024px) {
  /* 大屏幕样式 */
  table {
    width: 80svw;
    overflow: hidden;
  }

  thead {
    overflow: hidden;
  }

  tbody {
    overflow: hidden;
  }

  .inputdatadiv {
    width: 23.8svw;
  }

  .searchTable {
    width: 80svw;
  }
}

@media screen and (max-width: 1023px) {
  /* 中等屏幕样式 */
  table {
    width: 80svw;
  }

  thead {
    overflow: hidden;
  }

  tbody {
    overflow: hidden;
  }

  .searchTable {
    width: 80svw;
  }

  .inputdatadiv {
    width: 50svw;
  }
}

@media screen and (max-width: 600px) {
  table {
    width: 80svw;
  }

  thead {
    overflow: hidden;
  }

  tbody {
    overflow: hidden;
  }

  .searchTable {
    width: 80svw;
  }

  .inputdatadiv {
    width: 80svw;
  }
}
</style>
