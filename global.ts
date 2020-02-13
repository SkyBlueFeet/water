import path from "path";

const setPath = (...url: string[]): string => {
    return path.resolve(process.cwd(), ...(url ? url : []));
};

const config = {
    tsconfig: setPath("tsconfig.webpack.json"),
    public: setPath("public"),
    views: setPath("views"),
    clientEntry: setPath("src/entry-client.ts"),
    serverEntry: setPath("src/entry-server.ts"),
    template: setPath("src/index.html"),
    dev: {
        outputPath: setPath("dist"),
        publicPath: ""
    },
    prod: {
        outputPath: setPath("dist"),
        publicPath: "/dist/"
    }
};

export default config;
