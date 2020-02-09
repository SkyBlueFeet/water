import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

type Component = typeof import("*.vue");

export default new Router({
    routes: [
        {
            path: "/",
            name: "Hello",
            component: (): Promise<
                typeof import("@example/components/HelloWorld")
            > => import("@example/components/HelloWorld")
        },
        {
            path: "/test",
            name: "test",
            component: (): Promise<
                typeof import("@example/components/jsx.vue")
            > => import("@example/components/jsx.vue")
        }
    ]
});
