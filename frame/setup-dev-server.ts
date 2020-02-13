import fs from "fs";
import path from "path";
import MFS from "memory-fs";
import webpack, { Configuration } from "webpack";
import chokidar from "chokidar";

import { BundleRenderer, BundleRendererOptions } from "vue-server-renderer";
import { Express } from "express";
import devWare from "webpack-dev-middleware";
import hotWare = require("webpack-hot-middleware");

import clientConfig = require("./webpack.client.config");
import serverConfig = require("./webpack.server.config");

const readFile = (fs: MFS, file: string): string => {
    try {
        return fs.readFileSync(
            path.join(clientConfig.output.path, file),
            "utf-8"
        );
    } catch (e) {
        console.log(e);
    }
};

const preSetConfig = (clientConfig: Configuration): Configuration => {
    clientConfig.entry["app"] = [
        "webpack-hot-middleware/client",
        clientConfig.entry["app"]
    ];
    clientConfig.output.filename = "[name].js";
    clientConfig.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    );
    return clientConfig;
};

const watcher = function(templatePath): Promise<string> {
    return new Promise(res => {
        chokidar.watch(templatePath).on("change", () => {
            res(fs.readFileSync(templatePath, "utf-8"));
        });
    });
};

const serverCompiler = function(
    serverConfig: Configuration
): Promise<object | string> {
    const serverCompiler = webpack(serverConfig);
    const mfs = new MFS();
    serverCompiler.outputFileSystem = mfs;
    return new Promise((res, rej) => {
        serverCompiler.watch({}, (err, stats) => {
            if (err) throw err;
            const statsJson = stats.toJson();
            if (statsJson.errors.length) rej(statsJson.errors);

            res(JSON.parse(readFile(mfs, "vue-ssr-server-bundle.json")));
        });
    });
};

export default function setupDevServer(
    app: Express,
    templatePath: string,
    callbackFn: (
        bubdle: object | string,
        bundleRenderOptions: BundleRendererOptions
    ) => BundleRenderer
): Promise<BundleRenderer> {
    let bundle: object | string;
    let template: string;
    let clientManifest: object;

    let ready: (value?: BundleRenderer | PromiseLike<BundleRenderer>) => void;

    const client = preSetConfig(clientConfig);

    const readyPromise: Promise<BundleRenderer> = new Promise(res => {
        ready = res;
    });

    function toUpdate(bundle: object | string, manifest: object): void {
        if (bundle && manifest) {
            ready(
                callbackFn(bundle, {
                    template,
                    clientManifest: manifest
                })
            );
        }
    }

    // read template from disk and watch
    template = fs.readFileSync(templatePath, "utf-8");
    watcher(templatePath)
        .then(res => {
            template = res;
            toUpdate(bundle, clientManifest);
        })
        .then(error => {
            console.log("\n" + error + "\n");
            process.exit(0);
        });

    // dev middleware
    const clientCompiler = webpack(client);
    const devMiddleware = devWare(clientCompiler, {
        publicPath: client.output.publicPath
    });
    app.use(devMiddleware);
    clientCompiler.hooks.done.tap("webpack-dev-middleware", stats => {
        const statsJson = stats.toJson();
        statsJson.errors.forEach(err => console.error(err));
        statsJson.warnings.forEach(err => console.warn(err));
        if (statsJson.errors.length) return;
        clientManifest = JSON.parse(
            readFile(devMiddleware.fileSystem, "vue-ssr-client-manifest.json")
        );
        toUpdate(bundle, clientManifest);
    });

    // hot middleware
    const hotMiddleware = hotWare(clientCompiler, {
        heartbeat: 5000,
        log: false,
        quiet: true
    });
    app.use(hotMiddleware);

    serverCompiler(serverConfig)
        .then(res => {
            bundle = res;
            toUpdate(bundle, clientManifest);
        })
        .catch(error => {
            console.log("\n" + error + "\n");
            process.exit(0);
        });

    return readyPromise;
}
