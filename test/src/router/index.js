import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

// 白名单
const whiteList = ["login"];
const routes = [
  {
    path: "/",
    name: "index",
    children: [],
  },
  {
    path: "/login",
    name: "login",
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

router.beforeEach((to, from, next) => {
  // 获取token
  const token = Vue.ss.get("AUTHORIZATION");
  if (token) {
    if (to.name === "login") {
      next("/");
    } else {
      next();
    }
  } else {
    if (whiteList.includes(to.name)) {
      next();
    } else {
      next({ path: "/login" });
    }
  }
});

export default router;
