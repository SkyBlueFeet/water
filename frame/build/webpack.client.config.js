const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin");
const isProd = process.env.NODE_ENV === "production";
const baseConfig = isProd
    ? require("./webpack.base.prod.config")
    : require("./webpack.base.dev.config");

let config = require("../config");

let $config =
    process.env.NODE_ENV === "development"
        ? config.development
        : config.production;

module.exports = merge(baseConfig, {
    entry: {
        app: path.resolve(__dirname, "./../src/entry-client.js")
    },

    plugins: [
        new webpack.DefinePlugin({
            VUE_ENV: '"client"',
            ...$config.vars
        }),
        new VueSSRClientPlugin()
    ]
});
