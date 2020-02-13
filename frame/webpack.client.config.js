const webpack = require("webpack");
const merge = require("webpack-merge");
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin");
const isProd = process.env.NODE_ENV === "production";
const baseConfig = isProd
    ? require("./webpack.base.prod.config")
    : require("./webpack.base.dev.config");

const global = require("./global");

module.exports = merge(baseConfig, {
    entry: {
        app: global.clientEntry
    },

    plugins: [
        new webpack.DefinePlugin({
            VUE_ENV: '"client"',
            "process.env": {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        }),
        new VueSSRClientPlugin()
    ]
});
