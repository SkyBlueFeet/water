import Vue, { VNode } from "vue";
import App from "./App.vue";
import { createStore } from "./store";
import { createRouter } from "./router";
import { sync } from "vuex-router-sync";
import titleMixin from "./mixins/titleMixin";
import { CombinedVueInstance, CreateElement } from "vue/types/vue";

Vue.mixin(titleMixin);

export function createApp(): {
    app: CombinedVueInstance<Vue, object, object, object, Record<never, any>>;
    router: any;
    store: any;
} {
    const store = createStore();
    const router = createRouter();

    sync(store, router);

    const app = new Vue({
        router,
        store,
        render: (h: CreateElement): VNode => h(App)
    });

    return { app, router, store };
}
