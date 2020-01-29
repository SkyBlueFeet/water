---
title:Template
---

# webpack4-typescript-template

## Description

基于 Vue-cli@2 脚手架升级改造的全 typescript 实现

## 技术栈

JS、TS、TSX、Vue 全家桶

## 开发支持

Eslint、Babel、PostCss、Prettier

## 关键第三方依赖版本

```json
"typescript": "^3.7.4",
"ts-node": "^8.5.4",
"vue": "^2.6.11",
"webpack": "^4.41.2",
"@babel/core": "^7.7.5",
"eslint": "^6.7.2",
"prettier": "^1.19.1",
```

## 额外支持

1. 支持 markdown、json5 解析；
2. 使用 babel 解析 ejs 文件以支持在 lodash 模板中使用 ES6 语法；
3. 打包文件解析；

## 特色

在 vue-cli@2 基础上升级为 webpack4 的基础上，webpack 配置文件全部使用 ts 重构，模块化、参数化配置结构，为构建多页面应用留下配置空间。完全支持 js、jsx、ts、tsx 作为开发语言。

## 目前的缺陷

Vue 文件中无法同时检查 ts 和 js。

内部配置文件没有 jsdoc。

## 开发方向

1. 支持 Vue、React、Angular
2. 支持 ts、tsx、js、jsx
3. 支持 ejs、vue 多页面
4. 支持库文档书写和编译

## 命令

```json
"start": "npm run dev",
"app:dev": "ts-node --project tsconfig.node.json ./script/dev",
"docs:dev": "vuepress dev docs",
"build": "ts-node --project tsconfig.node.json script/build.ts && vuepress build docs",
"lint": "eslint --ext .js,.vue,.ts,.tsx src",
"analyzer": "npm run build --report",
"format": "prettier --write \"*/**/*.ts\" \"*/**/*.vue\" \"*/**/*.tsx\" \"*/**/*.js\" \"*/**/*.jsx\""
```

## 安装

```js
$ npm install
$ npm run dev
$ npm run build
```

## build for production and view the bundle analyzer report

```js
npm run analyzer
```

`推荐使用VS Code开发本应用`

## 开发日志

2020-01-27 完成 Vue SPA 开发环境

参考链接

[使用不同语言配置 webpack](https://webpack.docschina.org/configuration/configuration-languages)；

[Vue + TypeScript 新项目起手式](https://juejin.im/post/59f29d28518825549f7260b6)；

[vue + typescript 进阶篇](https://segmentfault.com/a/1190000011878086)；

[使用 webpack 搭建基于 TypeScript 的 node 开发环境](https://www.jianshu.com/p/6aab86403dc1)；

[【webpack4】用不同语言语法编写 webpack 配置文件](https://segmentfault.com/a/1190000018738802)；

[如果我的项目混用 js 和 ts，如何正确设置配置 Eslint？](https://github.com/AlloyTeam/eslint-config-alloy/issues/67)；
