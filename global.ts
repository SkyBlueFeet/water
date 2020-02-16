import path from "path";

const setPath = (...url: string[]): string => {
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
     * 网站图标文件，网页有图标时会被覆盖
     */
    favicon: setPath("public/images/logo.png"),

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
    publicKey: setPath("handler/rsa_private_key.pem"),

    /**
     * blacklist
     */
    blacklist: [""],
    nuxt: {
        config: {
            dev: true,
            mode: "universal",
            env: {},
            router: {
                base: "/"
            },

            /*
             ** Headers of the page
             */
            head: {
                title: process.env.npm_package_name || "",
                meta: [
                    { charset: "utf-8" },
                    {
                        name: "viewport",
                        content: "width=device-width, initial-scale=1"
                    },
                    {
                        hid: "description",
                        name: "description",
                        content: process.env.npm_package_description || ""
                    }
                ],
                link: [
                    { rel: "icon", type: "image/x-icon", href: "/favicon.ico" }
                ]
            },
            /*
             ** Customize the progress-bar color
             */
            loading: { color: "#fff" },
            /*
             ** Global CSS
             */
            css: ["element-ui/lib/theme-chalk/index.css"],
            /*
             ** Plugins to load before mounting the App
             */
            plugins: ["./plugins/element-ui"],
            /*
             ** Nuxt.js dev-modules
             */
            buildModules: [],
            /*
             ** Nuxt.js modules
             */
            modules: [],
            /*
             ** Build configuration
             */
            build: {
                transpile: [/^element-ui/]
                /*
                 ** You can extend webpack config here
                 */
                // extend(config, ctx) {}
            },
            rootDir: "./nuxt"
        }
    }
};

export default config;
