import express, { Handler } from "express";
import ejs from "ejs";

// import cookieParser from "cookie-parser";
import sassMiddleware from "node-sass-middleware";
import bodyParser from "body-parser";
import index from "../router";
import global from "../global";
import favicon = require("serve-favicon");
import user from "../router/user";
import cookieParser from "cookie-parser";
import compression = require("compression");
import tokenAuth from "../handler/token.auth";

const isProd = process.env.NODE_ENV === "production";

const app = express();

// 视图引擎
app.set("view engine", "html");
app.engine("html", ejs.renderFile);

app.set("views", global.views);

app.locals.isProd = isProd;

// 工具类
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(favicon(global.favicon));
app.use(compression({ threshold: 0 }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
    sassMiddleware({
        src: process.cwd(),
        dest: process.cwd(),
        indentedSyntax: false, // true = .sass and false = .scss
        sourceMap: !isProd,
        debug: !isProd,
        outputStyle: isProd ? "compressed" : "expanded"
    })
);

// app.use(express.static(global.public));

const serve = (path: string, cache: boolean): Handler => {
    return express.static(path, {
        maxAge: cache ? 1000 * 60 * 60 * 24 * 30 : 0
    });
};

// 静态资源目录
app.use("/dist", serve(global.prod.outputPath, isProd));
app.use("/public", serve(global.public, isProd));

//Token
app.use("/", tokenAuth.middleWare);

// Router
app.use("/", index);
app.use("/user", user);

export default app;
