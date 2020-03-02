import path from "path";
import { Configuration } from "webpack";
import VueLoaderPlugin from "vue-loader/lib/plugin";

import config from "../global";

const isProd = process.env.NODE_ENV === "production";

const $config = isProd ? config.prod : config.dev;

const webpackConfig: Configuration = {
    output: {
        path: $config.outputPath,
        publicPath: $config.publicPath,
        filename: "[name].js",
        chunkFilename: "[name].chunk.js"
    },

    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        alias: {
            "@": path.resolve(__dirname, "../src")
        }
    },

    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.(js|vue|jsx|tsx|ts)$/,
                loader: "eslint-loader",
                exclude: /node_modules/
            },
            {
                test: /\.vue$/,
                loader: "vue-loader"
            },
            {
                test: /\.jsx?$/,
                loader: "babel-loader",
                exclude: /node_modules/
            },
            {
                test: /\.tsx?$/,
                use: [
                    "babel-loader",
                    {
                        loader: "ts-loader",
                        options: {
                            appendTsxSuffixTo: [/\.vue$/],
                            configFile: config.tsconfig
                        }
                    }
                ]
            },

            {
                test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 1024,
                            name: "./static/img/[name].[hash:7].[ext]"
                        }
                    }
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 1024,
                            name: "./static/font/[name].[hash].[ext]"
                        }
                    }
                ]
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: "./static/media/[name].[hash:7].[ext]"
                }
            }
        ]
    },

    plugins: [new VueLoaderPlugin()]
};

export default webpackConfig;
