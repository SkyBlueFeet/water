import webpack from "webpack";
import path from "path";
import merge from "webpack-merge";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import baseConfig from "./webpack.base";
import OptimizeCssAssetsPlugin from "optimize-css-assets-webpack-plugin";
import UglifyJsPlugin from "uglifyjs-webpack-plugin";

// class ServerMiniCssExtractPlugin extends MiniCssExtractPlugin {
//     getCssChunkObject(mainChunk: any): object {
//         return {};
//     }
// }

export default merge(baseConfig, {
    mode: "production",

    devtool: false,

    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true
            }),
            new OptimizeCssAssetsPlugin({
                assetNameRegExp: /\.css$/g,
                cssProcessorOptions: {
                    safe: true,
                    autoprefixer: { disable: true },
                    mergeLonghand: false,
                    discardComments: {
                        removeAll: true
                    }
                },
                canPrint: true
            })
        ],

        splitChunks: {
            cacheGroups: {
                default: false,
                vendors: false,
                vendor: {
                    name: "vendors-chunk",
                    chunks: "all",
                    test: /[\\/]node_modules[\\/]/,
                    priority: 20
                }
                // common: {
                //     name: "common-chunk",
                //     chunks: "all",
                //     minChunks: 2,
                //     test: path.resolve(__dirname, "./../src/components"),
                //     priority: 10,
                //     enforce: true,
                //     reuseExistingChunk: true
                // }
            }
        }
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
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
                        loader: MiniCssExtractPlugin.loader
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
                        loader: MiniCssExtractPlugin.loader
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
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: "[contenthash].css"
        }),
        new webpack.HashedModuleIdsPlugin({
            hashFunction: "sha256",
            hashDigest: "hex",
            hashDigestLength: 20
        }),
        new webpack.NamedChunksPlugin(chunk => {
            if (chunk.name) {
                return chunk.name;
            }
            return Array.from(chunk.modulesIterable, (m: any) => m.id).join(
                "_"
            );
        })
    ]
});
