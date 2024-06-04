import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/oneLine",
      name: "oneLine",
      component: () => import("../views/OneLineView.vue"),
    },
    {
      path: "/avgErr",
      name: "avgErr",
      component: () => import("../views/AVGErrView.vue"),
    },
    {
      path: "/moreLine",
      name: "moreLine",
      component: () => import("../views/moreLineView.vue"),
    },
    {
      path: "/moreLineOrderPerformance",
      name: "moreLineOrderPerformance",
      component: () => import("../views/MoreLineOrderPerformanceView.vue"),
    },
    {
      path: "/oneLineERROrderView",
      name: "oneLineERROrderView",
      component: () => import("../views/OneLineERROrderView.vue"),
    },
    {
      path: "/moreLineOrderERR",
      name: "moreLineOrderERR",
      component: () => import("../views/MoreLineOrderERRView.vue"),
    },
    {
      path: "/stopTime",
      name: "stopTime",
      component: () => import("../views/StopTimeTableView.vue"),
    },
    {
      path: "/oneLineTable",
      name: "oneLineTable",
      component: () => import("../views/OneLineTableView.vue"),
    },
    {
      path: "/oneLineNonTimeTable",
      name: "oneLineNonTimeTable",
      component: () => import("../views/OneLineNonTimeTableView.vue"),
    },
    {
      path: "/oneErr",
      name: "oneErr",
      component: () => import("../views/OneErrView.vue"),
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/scm",
      name: "scm",
      component: () => import("../views/SCMView.vue"),
    },
    // {
    //   path: "/",
    //   name: "home",
    //   component: HomeView,
    // },
    {
      path: "/kanban",
      name: "kanban",
      component: () => import("../views/Kanban.vue"),
    },
  ],
});

export default router;
