process.env.NODE_ENV === "production";

import express, { Handler } from "express";
import path from "path";

import setRender from "../frame/render";
import setRouter from "../router/ssr";

const compression = require("compression");

const resolve = (file: string): string => path.resolve(process.cwd(), file);

const app = express();

const serve = (path: string, cache: unknown): Handler => {
    return express.static(resolve(path), {
        maxAge: cache ? 1000 * 60 * 60 * 24 * 30 : 0
    });
};

app.use(compression({ threshold: 0 }));
app.use("/dist", serve("./dist", true));
app.use("/public", serve("./static", true));

app.use("/app", setRouter(setRender()));

const port = process.env.PORT || 8080;

app.listen(port);
