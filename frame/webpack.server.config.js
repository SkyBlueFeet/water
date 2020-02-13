const webpack = require("webpack");
const merge = require("webpack-merge");
const nodeExternals = require("webpack-node-externals");
const VueSSRServerPlugin = require("vue-server-renderer/server-plugin");
const isProd = process.env.NODE_ENV === "production";
const baseConfig = isProd
    ? require("./webpack.base.prod.config")
    : require("./webpack.base.dev.config");

const global = require("./global");

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
            "process.env": {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        }),
        new VueSSRServerPlugin()
    ]
});
