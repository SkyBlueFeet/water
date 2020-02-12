process.env.NODE_ENV = "development";

import express, { Handler } from "express";
import path from "path";
import ssr from "../router/ssr";
import render from "../frame/render";

const resolve = (file: string): string => path.resolve(process.cwd(), file);
const app = express();

const serve = (path: string): Handler => {
    return express.static(resolve(path), { maxAge: 0 });
};

app.use("/dist", serve("./dist"));
app.use("/public", serve("./static"));

app.use("/app", ssr(render(app)));

const port = process.env.PORT || 8080;

app.listen(port);
