const path = require("path");

const setPath = (...url) => {
    return path.resolve(process.cwd(), ...(url ? url : []));
};

const config = {
    tsconfig: setPath("tsconfig.webpack.json"),
    clientEntry: setPath("src/entry-client.js"),
    serverEntry: setPath("src/entry-server.js"),
    template: setPath("src/index.html"),
    dev: {
        outputPath: setPath("dist"),
        publicPath: "",
        filename: "[name].js",
        chunkFilename: "[name].chunk.js",
        vars: {
            "process.env": {
                NODE_ENV: JSON.stringify("development")
            }
        }
    },
    prod: {
        outputPath: setPath("dist"),
        publicPath: "/dist/",
        filename: "[name].[chunkhash].js",
        chunkFilename: "[name].[chunkhash].chunk.js",
        vars: {
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        }
    }
};

module.exports = config;

// export default config;
