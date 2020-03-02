# Vue Webpack4 SSR server.bundle.js 报错 document is not defined

## Detailed description of the problem

-   运行环境：Vue 服务端渲染(SSR)
-   条件：使用异步组件
-   前提条件：使用了`mini-css-extract-plugin`、`extract-css-chunks-webpack-plugin`等用来抽取 CSS 代码的 webpack 插件
-   错误：报错`document is not defined`
-   位置： server bundle 等服务端打包后代码，

## Problem Causes

是由于运行上述插件后异步导入组件时服务端代码会执行 document.createElement 方法插入 link 标签，但是此时 document 对象为 undefined，因此会出现该错误。作为验证，当你检查打包后的服务端代码时会发现有大量多余的 document 对象方法，服务端代码则无法运行。

## Solution

### Indirect Method:

-   不使用异步组件
-   使用 Babel 插件 babel-plugin-dynamic-import-node 将 import() 方法转化成 require

### Direct Method:

-   使用 `vue-style-loader` 替代，但是无法抽取 CSS 代码

-   `null-loader` or `css-loader/locals` (for CSS modules)，未验证

-   重写 `mini-css-extract-plugin`的`getCssChunkObject`方法，已验证可完美解决

```js
class ServerMiniCssExtractPlugin extends MiniCssExtractPlugin {
    getCssChunkObject(mainChunk) {
        return {};
    }
}
```

## Reference

-   https://segmentfault.com/q/1010000016459292

-   https://github.com/vuejs/vue-router/issues/2380

-   https://github.com/webpack-contrib/mini-css-extract-plugin/issues/48#issuecomment-375288454

-   https://github.com/webpack-contrib/mini-css-extract-plugin/issues/90


## Unsolved

`extract-css-chunks-webpack-plugin`文档中提到该插件 SSR 友好，应当也会支持 SSR 的异步组件，但直接替换`mini-css-extract-plugin`并没有解决问题,不清楚是否需要进行特殊配置
