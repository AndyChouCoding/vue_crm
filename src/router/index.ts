// src/router/index.ts
import {
    createRouter,
    createWebHistory,
    type RouteRecordRaw,
  } from "vue-router";
  import { useAuthStore } from "../stores/auth";       // Pinia 的 Auth Store
  import Login from "../components/login.vue";
  import Layout from "../components/layout.vue";
  import Dashboard from "../components/dashboard.vue";
  import MessageCenter from "../components/messageCenter.vue";
  
  const routes: RouteRecordRaw[] = [
    // 登录页 —— 不走 Layout
    {
      path: "/login",
      name: "Login",
      component: Login,
    },
  
    // 下面这些页面都走 Layout
    {
      path: "/",
      component: Layout,
      children: [
        // 根路径直接展示 Dashboard
        {
          path: "",
          redirect: { name: "Dashboard" },
        },
        {
          path: "dashboard",       // 注意：子路由不能以 '/' 开头
          name: "Dashboard",
          component: Dashboard,
          meta: { requiresAuth: true },
        },
        {
          path: "message_center",
          name: "MessageCenter",
          component: MessageCenter,
          meta: { requiresAuth: true },
        },
        // 如果还有其它需要 Layout 包裹的页面，也写在这里
      ],
    },
  
    // 兜底重定向：匹配不到路由时，去登录（或去 Dashboard）
    {
      path: "/:catchAll(.*)",
      redirect: "/login",
    },
  ];
  
  const router = createRouter({
    history: createWebHistory(),
    routes,
  });
  
  // 全局守卫：根据 meta.requiresAuth 拦截未登录访问
  router.beforeEach((to, from, next) => {
    const auth = useAuthStore();
    const isLoggedIn = !!auth.user;
  
    if (to.meta.requiresAuth && !isLoggedIn) {
      // 访问受保护页面，且未登录 → 重定向到 Login
      next({ name: "Login" });
    } else if (to.name === "Login" && isLoggedIn) {
      // 已登录还想进 Login → 重定向到 Dashboard
      next({ name: "Dashboard" });
    } else {
      next();
    }
  });
  
  export default router;
  