
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
  import NewComponents from "../components/newComponents.vue"
  
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
        {
            path: "new_components",
            name: "NewComponents",
            component: NewComponents,
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
  

  router.beforeEach((to, _from, next) => {
    const auth = useAuthStore();
    const isLoggedIn = !!auth.user;
  
    if (to.meta.requiresAuth && !isLoggedIn) {
      next({ name: "Login" });
    } else if (to.name === "Login" && isLoggedIn) {
      next({ name: "Dashboard" });
    } else {
      next();
    }
  });
  
  export default router;
  