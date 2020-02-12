import path from "path";

const setPath = (...url: string[]): string => {
    return path.resolve(process.cwd(), ...(url ? url : []));
};

const config = {
    tsconfig: setPath("tsconfig.webpack.json"),
    public: setPath("public"),
    views: setPath("views"),
    clientEntry: setPath("src/entry-client.js"),
    serverEntry: setPath("src/entry-server.js"),
    template: setPath("src/index.html"),
    dev: {
        outputPath: setPath("dist")
    },
    prod: {
        outputPath: setPath("dist")
    }
};

export default config;
