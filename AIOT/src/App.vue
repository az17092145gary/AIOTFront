<script setup>
import { RouterLink, RouterView } from "vue-router";
import { ref, inject } from "vue";
const arritem = ref([]);
const item = ref(null);
const APIUrl = inject("APIUrl");
const axios = inject("axios");
const getItemData = () => {
  axios({
    method: "get",
    url: APIUrl + "getAllItem",
  })
    .then(function (res) {
      arritem.value = res.data;
      item.value = arritem.value[0].itemName;
    })
    .catch((err) => {
      if (err.code === "ERR_NETWORK") {
        alert("查詢產品異常，請重新整理。");
        return;
      }
    });
};
getItemData();
</script>

<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">圜達實業股份有限公司</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item dropdown d-grid gap-2">
              <button
                type="button"
                class="btn btn-outline-light dropdown-toggle"
                id="navbarReportSystem"
                data-bs-toggle="dropdown"
                data-bs-auto-close="true"
                aria-expanded="false"
              >
                報表系統
              </button>
              <ul
                class="dropdown-menu dropdown-menu-dark"
                aria-labelledby="navbarReportSystem"
              >
                <li class="d-grid gap-2">
                  <!-- <RouterLink class="btn btn-outline-light" to="/oneLine"
                    >單線圖表</RouterLink
                  > -->
                  <a
                    class="btn btn-outline-light"
                    href="/oneLine"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    單線圖表
                  </a>
                </li>
                <li class="d-grid gap-2">
                  <!-- <RouterLink class="btn btn-outline-light" to="/avgErr"
                    >機台平均臨停統計圖
                  </RouterLink> -->
                  <a
                    class="btn btn-outline-light"
                    href="/avgErr"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    機台平均臨停統計圖
                  </a>
                </li>
                <!-- <li class="d-grid gap-2">
                  <a
                    class="btn btn-outline-light"
                    href="/oneErr"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    機台臨停次數統計圖
                  </a>
                </li> -->
                <li class="d-grid gap-2">
                  <!-- <RouterLink
                    class="btn btn-outline-light"
                    to="/oneLineERROrderView"
                  >
                    異常碼明細表
                  </RouterLink> -->
                  <a
                    class="btn btn-outline-light"
                    href="/oneLineERROrderView"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    異常碼明細表
                  </a>
                </li>
                <li class="d-grid gap-2">
                  <!-- <RouterLink class="btn btn-outline-light" to="/stopTime"
                    >機台停機時間明細表
                  </RouterLink> -->
                  <a
                    class="btn btn-outline-light"
                    href="/stopTime"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    機台停機時間明細表
                  </a>
                </li>
                <li class="d-grid gap-2">
                  <!-- <RouterLink class="btn btn-outline-light" to="/oneLineTable"
                    >單線三率明細表
                  </RouterLink> -->
                  <a
                    class="btn btn-outline-light"
                    href="/oneLineTable"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    單線三率明細表
                  </a>
                </li>
                <li class="d-grid gap-2">
                  <!-- <RouterLink
                    class="btn btn-outline-light"
                    to="/oneLineNonTimeTable"
                    >單線缺料、機故明細表
                  </RouterLink> -->
                  <a
                    class="btn btn-outline-light"
                    href="/oneLineNonTimeTable"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    單線缺料、機故明細表
                  </a>
                </li>
                <li class="d-grid gap-2">
                  <!-- <RouterLink class="btn btn-outline-light" to="/moreLine"
                    >多線比較圖表
                  </RouterLink> -->
                  <a
                    class="btn btn-outline-light"
                    href="/moreLine"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    多線比較圖表
                  </a>
                </li>
                <li class="d-grid gap-2">
                  <!-- <RouterLink
                    class="btn btn-outline-light"
                    to="/moreLineOrderPerformance"
                  >
                    多線三率排名圖表
                  </RouterLink> -->
                  <a
                    class="btn btn-outline-light"
                    href="/moreLineOrderPerformance"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    多線三率排名圖表
                  </a>
                </li>
                <li class="d-grid gap-2">
                  <!-- <RouterLink
                    class="btn btn-outline-light"
                    to="/moreLineOrderERR"
                    >多線臨停排名圖表
                  </RouterLink> -->
                  <a
                    class="btn btn-outline-light"
                    href="/moreLineOrderERR"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    多線臨停排名圖表
                  </a>
                </li>
              </ul>
            </li>
            <li class="nav-item dropdown d-grid gap-2">
              <button
                type="button"
                class="btn btn-outline-light dropdown-toggle"
                id="2ssss"
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
                aria-expanded="false"
              >
                看板系統
              </button>
              <ul
                class="dropdown-menu dropdown-menu-dark"
                aria-labelledby="navbarReportSystem"
              >
                <li class="d-grid gap-2" v-for="itemdata in arritem">
                  <RouterLink
                    class="btn btn-outline-light"
                    :to="{
                      name: 'kanban',
                      query: { targetItem: itemdata, ItemList: arritem },
                    }"
                    >{{ itemdata }}
                  </RouterLink>
                </li>
              </ul>
            </li>
            <!-- <li class="nav-item d-grid gap-2">
              <button
                type="button"
                class="btn btn-outline-light dropdown-toggle"
                id="2ssss"
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
                aria-expanded="false"
              >
                即時監看系統
              </button>
            </li> -->
            <li class="nav-item d-grid gap-2">
              <button
                type="button"
                class="btn btn-outline-light dropdown-toggle"
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
                aria-expanded="false"
              >
                機台保養系統
              </button>
            </li>
            <li class="nav-item d-grid gap-2">
              <!-- <RouterLink class="btn btn-outline-light" to="/scm">
                標準產能管理</RouterLink
              > -->
              <a
                class="btn btn-outline-light"
                href="/scm"
                target="_blank"
                rel="noopener noreferrer"
              >
                標準產能管理
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>

  <body>
    <RouterView />
  </body>
</template>

<style scoped>
li {
  margin: 0.2svw;
  white-space: nowrap;
}

img {
  height: 4svh;
  width: 4.2svw;
}
</style>
