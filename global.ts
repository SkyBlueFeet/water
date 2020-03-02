import path from "path";

export const setPath = (...url: string[]): string => {
    return path.resolve(process.cwd(), ...(url ? url : []));
};

const config = {
    /**
     * 开发系统TS编译选项配置文件
     */
    tsconfig: setPath("tsconfig.webpack.json"),

    /**
     * Vue SSR客户端入口文件
     */
    clientEntry: setPath("src/entry-client.ts"),

    /**
     * Vue SSR服务端入口文件
     */
    serverEntry: setPath("src/entry-server.ts"),

    /**
     * Vue SSR渲染模板
     */
    template: setPath("src/index.html"),

    dev: {
        outputPath: setPath("dist"),
        publicPath: ""
    },
    prod: {
        outputPath: setPath("dist"),
        publicPath: "/dist/"
    },

    /**
     * 网站标题
     */
    title: "渴了么",
    /**
     * 网站图标文件，网页有图标时会被覆盖
     */
    favicon: setPath("public/images/logo-120.png"),

    /**
     *公共资源目录
     */
    public: setPath("public"),

    /**
     * Express视图目录
     */
    views: setPath("views"),

    /**
     * 登录token秘钥
     */
    privateKey: setPath("handler/rsa_private_key.pem"),

    /**
     * 登录token公钥
     */
    publicKey: setPath("handler/rsa_public_key.pem"),

    /**
     * blacklist
     */
    blacklist: [
        "/business/buyVip",
        "/business/booking",
        "/business/cart",
        "/business/order"
    ],

    whiteList: ["/"],

    returnsList: ["/", "/business/buyVip"],

    matchUrl: function(url: string): boolean {
        const urls = url.split("/");
        return urls.includes("user") && urls.includes("message");
    },
    superAdmin: ["root", "123456"]
};

export default config;
