import express, { Handler } from "express";
import ejs from "ejs";

// import cookieParser from "cookie-parser";
import sassMiddleware from "node-sass-middleware";
import index from "../router";
import global from "../global";

const isProd = process.env.NODE_ENV === "production";

const app = express();

app.set("view engine", "html");
app.engine("html", ejs.renderFile);

app.set("views", global.views);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

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

app.use("/", index);

app.use("/dist", serve(global.prod.outputPath, isProd));
app.use("/public", serve(global.public, isProd));

export default app;
