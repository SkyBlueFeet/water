const webpack = require("webpack");
const merge = require("webpack-merge");
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin");
const isProd = process.env.NODE_ENV === "production";
const baseConfig = isProd
    ? require("./webpack.base.prod.config")
    : require("./webpack.base.dev.config");

const global = require("./global");

const $config =
    process.env.NODE_ENV === "development" ? global.dev : global.prod;

module.exports = merge(baseConfig, {
    entry: {
        app: global.clientEntry
    },

    plugins: [
        new webpack.DefinePlugin({
            VUE_ENV: '"client"',
            ...$config.vars
        }),
        new VueSSRClientPlugin()
    ]
});
