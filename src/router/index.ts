
import {
    createRouter,
    createWebHistory,
    type RouteRecordRaw,
  } from "vue-router";
  import { useAuthStore } from "../stores/auth";  
  import Login from "../components/login.vue";
  import Layout from "../components/layout.vue";
  import Dashboard from "../components/dashboard.vue";
  import MessageCenter from "../components/messageCenter.vue";
  
  const routes: RouteRecordRaw[] = [
    {
      path: "/login",
      name: "Login",
      component: Login,
    },
    {
      path: "/",
      component: Layout,
      children: [
        {
          path: "",
          redirect: { name: "Dashboard" },
        },
        {
          path: "dashboard",
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

      ],
    },

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
  router.beforeEach((to, _from, next) => {
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
  