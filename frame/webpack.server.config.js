const webpack = require("webpack");
const merge = require("webpack-merge");
const nodeExternals = require("webpack-node-externals");
const VueSSRServerPlugin = require("vue-server-renderer/server-plugin");
const isProd = process.env.NODE_ENV === "production";
const baseConfig = isProd
    ? require("./webpack.base.prod.config")
    : require("./webpack.base.dev.config");

const global = require("./global");

const $config =
    process.env.NODE_ENV === "development" ? global.dev : global.prod;

module.exports = merge(baseConfig, {
    target: "node",

    devtool: "#source-map",

    entry: global.serverEntry,

    output: {
        filename: "server-bundle.js",
        libraryTarget: "commonjs2"
    },

    externals: nodeExternals({
        whitelist: /\.css$/
    }),

    plugins: [
        new webpack.DefinePlugin({
            VUE_ENV: '"server"',
            ...$config.vars
        }),
        new VueSSRServerPlugin()
    ]
});
