import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { makeServer } from "./mirage/server";
import { createPinia } from "pinia";
import { useAuthStore } from './stores/auth'

makeServer();

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount("#app");

const auth = useAuthStore()
auth.loadMe()
