import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";
import { CreateElement, VNode } from "vue/types/umd";
import sky from "../packages";
Vue.config.productionTip = false;

Vue.prototype.$$store = store;

Vue.use(sky);

console.log(sky);

const app = new Vue({
    el: "#app",
    store,
    router,
    render: (h: CreateElement): VNode => h(App)
});

export default app;
