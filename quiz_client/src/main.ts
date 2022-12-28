import { createApp } from "vue";
import App from "./App.vue";
import router from "./services/router";

import store from './services/store'

import "./style.css"

// import { ws } from "./socket"

const app = createApp(App);

app.use(router).use(store);

app.mount("#app");
