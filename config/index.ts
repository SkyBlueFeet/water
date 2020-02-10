import { Configuration } from "webpack";

import FriendlyErrorsPlugin from "friendly-errors-webpack-plugin";
import portfinder from "portfinder";
import merge from "webpack-merge";

import * as utils from "./utils";
import config from "./global";
import dev from "./assembly/webpack.dev.conf";
import prod from "./assembly/webpack.prod.conf";
import { env } from "./global";
import base from "./assembly/webpack.config";
// import PreloadWebpackPlugin = require("preload-webpack-plugin");
import Notifier from "node-notifier";

const PORT = process.env.PORT ? Number(process.env.PORT) : undefined;

export default function(env: env): Promise<Configuration> {
    let webpackConfig: Promise<Configuration>;
    if (env === "development") {
        const devWebpackConfig = merge(base, dev);

        const portfind: Function = (
            port: number | string
        ): FriendlyErrorsPlugin.Options => {
            return {
                compilationSuccessInfo: {
                    messages: [`正在运行`],
                    notes: [
                        `http://${devWebpackConfig.devServer?.host}:${port}`
                    ]
                },
                onErrors(
                    severity: FriendlyErrorsPlugin.Severity,
                    errors: string
                ): void {
                    if (severity !== "error" || config.dev.notifyOnErrors)
                        return;

                    Notifier.notify({
                        title: "Webpack",
                        message: `${severity}: ${errors}`,
                        icon: utils.resolve("logo.png")
                    });
                }
            };
        };

        webpackConfig = new Promise((resolve, reject) => {
            portfinder.basePort = PORT || config.dev.port;
            portfinder.getPort((err, port) => {
                if (err) {
                    reject(err);
                } else {
                    // publish the new Port, necessary for e2e tests
                    process.env.PORT = port.toString();
                    // add port to devServer config
                    devWebpackConfig.devServer.port = port;

                    // Add FriendlyErrorsPlugin
                    devWebpackConfig.plugins?.push(
                        new FriendlyErrorsPlugin(portfind(port))
                    );

                    resolve(devWebpackConfig);
                }
            });
        });
    } else {
        webpackConfig = new Promise(resolve => {
            resolve(merge(base, prod));
        });
    }
    return webpackConfig;
}
