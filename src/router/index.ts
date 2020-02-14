import Vue from "vue";
import Router from "vue-router";
// import HomeView from "../views/Home.view.vue";
// import DetailView from "../views/Detail.view.vue";
const HomeView = (): vueModule => import("../views/Home.view.vue");
const DetailView = (): vueModule => import("../views/Detail.view.vue");
Vue.use(Router);

type vueModule = Promise<typeof import("*.vue")>;

/**
 * @description
 * SSR时，如果使用异步组件，导致运行服务端代码时出现`document is not defined`，
 * https://segmentfault.com/q/1010000016459292中提到不使用异步插件时不会出现该问题，
 * 而如果想要使用异步组件，[https://github.com/vuejs/vue-router/issues/2380]中提到可以通过
 * babel插件babel-plugin-dynamic-import-node解决，而实际上也是可行的，不过该方法没有直接去解决问题，而是通过
 * 改变异步组件的渲染执行方式，该方法最终形成的vue-ssr-client-manifest也并不会包含异步组件资源列表
 * 该issues也提到该问题可能是由于mini-css-extract-plugin插件运行机制导致的，经我测试，在server端配置排除
 * mini-css-extract-plugin，使用vue-style-loader时一切正常，因此基本可以确定由mini-css-extract-plugin插件造成，
 * 通过同步和异步以及vue-style-loader插件打包比较，使用异步组件时配合mini-css-extract-plugin时，
 * 最终的server-bundle明显会使用更多document方法去创建link标签，而不使用异步组件时几乎没有
 * 有人提出使用extract-css-chunks-webpack-plugin插件去替代，官方文档也说该插件ssr友好，但是直接替换好像无效，
 * 仍旧会有大量document方法(待研究)。。。，结合[https://github.com/webpack-contrib/mini-css-extract-plugin/issues/48#issuecomment-375288454]
 * 的解释,到此就破案了,就是因为运行上述插件后异步导入组件时服务端代码会执行document.createElement方法插件link标签，但是此时document对象为undefined，
 * 因此会出现该错误，在[https://github.com/webpack-contrib/mini-css-extract-plugin/issues/90]中提到了最直接的解决方案，
 * 改写extract-css-chunks-webpack-plugin插件的getCssChunkObject方法
 * ```js
 *      class ServerMiniCssExtractPlugin extends MiniCssExtractPlugin {
 *          getCssChunkObject(mainChunk) {
 *              return {};
 *          }
 *      }
 * ```
 * 另外也有使用css-loader/local替代extract-css-chunks-webpack-plugin
 */

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
