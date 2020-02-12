const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

const config = require("./global");

const $config =
    process.env.NODE_ENV === "development" ? config.dev : config.prod;

module.exports = {
    output: {
        path: $config.outputPath,
        publicPath: $config.publicPath,
        filename: $config.filename,
        chunkFilename: $config.chunkFilename
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
                test: /\.tsx?$/,
                loader: "ts-loader",
                options: {
                    appendTsxSuffixTo: [/\.vue$/],
                    configFile: config.tsconfig
                }
            },
            {
                test: /\.jsx?$/,
                loader: "babel-loader",
                exclude: /node_modules/
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
