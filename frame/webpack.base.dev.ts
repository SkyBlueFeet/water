import merge from "webpack-merge";
import baseConfig from "./webpack.base";
// import ExtractCssChunks = require("extract-css-chunks-webpack-plugin");
import FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");

export default merge(baseConfig, {
    mode: "development",

    devtool: "#cheap-module-source-map",

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "vue-style-loader"
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "postcss-loader"
                    }
                ]
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: "vue-style-loader"
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "postcss-loader"
                    },
                    {
                        loader: "less-loader"
                    }
                ]
            },
            {
                test: /\.(sa|sc)ss$/,
                use: [
                    {
                        loader: "vue-style-loader"
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "postcss-loader"
                    },
                    {
                        loader: "sass-loader"
                    }
                ]
            }
        ]
    }
    // plugins: [
    //     new FriendlyErrorsWebpackPlugin({
    //         compilationSuccessInfo: {
    //             messages: [`正在运行`],
    //             notes: [`http://localhost:8080`]
    //         }
    //     })
    // ]
});
