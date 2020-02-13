import Vue from "vue";
import Router from "vue-router";
import HomeView from "../views/Home.view.vue";
import DetailView from "../views/Detail.view.vue";

Vue.use(Router);

type vueModule = Promise<typeof import("*.vue")>;

//无法使用异步router
//https://segmentfault.com/q/1010000016459292

// const HomeView = (): vueModule => import("../views/Home.view.vue");
// const DetailView = (): vueModule => import("../views/Detail.view.vue");

export function createRouter(): Router {
    return new Router({
        mode: "history",
        base: "/app",
        routes: [
            // { path: "/", redirect: "/app" },
            { path: "/", component: HomeView },
            { path: "/detail", component: DetailView }
        ]
    });
}
