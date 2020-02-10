import { Configuration } from "webpack";
import webpack from "webpack";
import { VueLoaderPlugin } from "vue-loader";

import CopyWebpackPlugin from "copy-webpack-plugin";

import * as utils from "../utils";
import config, { env } from "../global";
import rules, { MixinRule } from "../rules";
import pages from "../pages";

const WebpackBaseConfig: Configuration = {
    context: utils.resolve(),
    entry: pages(process.env.NODE_ENV as env).entries,
    output: {
        path: config.build.assetsRoot,
        filename: "[name].js",
        publicPath:
            process.env.NODE_ENV === "production"
                ? config.build.assetsPublicPath
                : config.dev.assetsPublicPath
    },
    resolve: {
        extensions: [...config.global.extensions],
        alias: {
            ...config.global.alias
        }
    },
    module: {
        rules: rules
    },
    plugins: [
        ...MixinRule.plugins,
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
        }),
        ...pages(process.env.NODE_ENV as env).html,

        // copy custom static assets
        new CopyWebpackPlugin([
            {
                from: utils.resolve("static"),
                to: config.build.assetsSubDirectory,
                ignore: [".*"]
            }
        ]),
        new VueLoaderPlugin(),
        new webpack.ProvidePlugin(config.global.variables)
    ],
    node: {
        // prevent webpack from injecting useless setImmediate polyfill because Vue
        // source contains it (although only uses it if it's native).
        setImmediate: false,
        // prevent webpack from injecting mocks to Node native modules
        // that does not make sense for the client
        dgram: "empty",
        fs: "empty",
        net: "empty",
        tls: "empty"
    }
};

export default WebpackBaseConfig;
