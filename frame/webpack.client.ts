import webpack from "webpack";
import merge from "webpack-merge";
import VueSSRClientPlugin from "vue-server-renderer/client-plugin";
const isProd = process.env.NODE_ENV === "production";
import prod from "./webpack.base.prod";
import dev from "./webpack.base.dev";
const baseConfig = isProd ? prod : dev;

import global from "../global";

export default merge(baseConfig, {
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
