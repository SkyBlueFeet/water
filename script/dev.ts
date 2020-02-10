import WebpackDevServer from "webpack-dev-server";
import webpack, { Configuration } from "webpack";

process.env.NODE_ENV = "development";

import setConfig from "../config";

setConfig("development")
    .then((devConfig: Configuration) => {
        const Compile = webpack(devConfig);
        const app = new WebpackDevServer(Compile, devConfig.devServer);

        app.listen(devConfig.devServer.port, error => console.error(error));
    })
    .catch(reason => console.error(reason));
