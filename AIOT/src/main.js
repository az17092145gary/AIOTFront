import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle";
//import $ from "jquery";
import Loading from "./components/Loading.vue";
import VueAxios from "vue-axios";
import axios from "axios";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { format } from "date-fns";
import VueCookies from "vue-cookies";

let APIUrl = "http://localhost:5261/AIOT/";
//let APIUrl = "http://192.168.0.83:80/AIOT/";

function formatDate(val) {
  return format(new Date(val), "yyyy-MM-dd HH:mm:ss");
}
function numberfilter(value) {
  value = value.toString();
  return value.replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
}

const app = createApp(App);
//app.use(VueAxios, axios);
app.component("Loading", Loading);
app.provide("axios", axios);
app.provide("formatDate", formatDate);
app.provide("numberfilter", numberfilter);
app.provide("VueCookies", VueCookies);
///app.provide("$", $);
app.provide("APIUrl", APIUrl);
// app.use(VueCookies);
app.use(router);
app.mount("#app");
