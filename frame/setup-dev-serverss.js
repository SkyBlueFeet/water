const fs = require("fs");
const path = require("path");
const MFS = require("memory-fs");
const webpack = require("webpack");
const chokidar = require("chokidar");
const clientConfig = require("./webpack.client.config");
const serverConfig = require("./webpack.server.config");
const devWare = require("webpack-dev-middleware");
const hotWare = require("webpack-hot-middleware");

const readFile = (fs, file) => {
    try {
        return fs.readFileSync(
            path.join(clientConfig.output.path, file),
            "utf-8"
        );
    } catch (e) {
        console.log(e);
    }
};

const preSetConfig = clientConfig => {
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

const watcher = templatePath => {
    return new Promise((res, rej) => {
        chokidar.watch(templatePath).on("change", () => {
            res(fs.readFileSync(templatePath, "utf-8"));
        });
    });
};

const serverCompiler = function(serverConfig) {
    const serverCompile = webpack(serverConfig);
    const mfs = new MFS();
    serverCompile.outputFileSystem = mfs;
    return new Promise((res, rej) => {
        serverCompile.watch({}, (err, stats) => {
            if (err) throw err;
            const statsJson = stats.toJson();
            if (statsJson.errors.length) rej(statsJson.errors);

            res(JSON.parse(readFile(mfs, "vue-ssr-server-bundle.json")));
        });
    });
};

module.exports = function setupDevServer(app, templatePath, callbackFn) {
    let bundle;
    let template;
    let clientManifest;

    let ready;
    const readyPromise = new Promise(res => {
        ready = res;
    });

    function toUpdata(bundle, manifest) {
        if (bundle && manifest) {
            ready(
                callbackFn(bundle, {
                    template,
                    clientManifest: manifest
                })
            );
        }
    }

    const client = preSetConfig(clientConfig);

    // dev middleware
    const clientCompile = webpack(client);
    const devMiddleWare = devWare(clientCompile, {
        publicPath: client.output.publicPath
    });

    app.use(devMiddleWare);

    // hot middleware
    const hotMiddleWare = hotWare(clientCompile, {
        heartbeat: 5000,
        log: false,
        quiet: true
    });
    app.use(hotMiddleWare);

    // read template from disk and watch
    template = fs.readFileSync(templatePath, "utf-8");

    watcher(templatePath).then(res => {
        template = res;

        toUpdata(bundle, clientManifest, callbackFn);
    });

    clientCompile.hooks.done.tap("webpack-dev-middleware", stats => {
        const statsJson = stats.toJson();
        statsJson.errors.forEach(err => console.error(err));
        statsJson.warnings.forEach(err => console.warn(err));
        if (statsJson.errors.length) return;
        clientManifest = JSON.parse(
            readFile(devMiddleWare.fileSystem, "vue-ssr-client-manifest.json")
        );

        toUpdata(bundle, clientManifest);
    });

    serverCompiler(serverConfig).then(res => {
        bundle = res;
        toUpdata(bundle, clientManifest);
    });

    return readyPromise;
};
