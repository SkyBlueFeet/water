import webpack from "webpack";
import merge from "webpack-merge";
import nodeExternals from "webpack-node-externals";
import VueSSRServerPlugin from "vue-server-renderer/server-plugin";
const isProd = process.env.NODE_ENV === "production";
import prod from "./webpack.base.prod";
import dev from "./webpack.base.dev";

const baseConfig = isProd ? prod : dev;

import global from "../global";

export default merge(baseConfig, {
    target: "node",

    devtool: "#source-map",

    entry: global.serverEntry,

    output: {
        filename: "server-bundle.js",
        libraryTarget: "commonjs2"
    },

    externals: nodeExternals({
        whitelist: /\.(css|ts|tsx|scss)$/
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
