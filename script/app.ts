import express, { Handler } from "express";
import path from "path";

const isProd = process.env.NODE_ENV === "production";

const resolve = (file: string): string => path.resolve(process.cwd(), file);
const app = express();

const serve = (path: string, cache: boolean): Handler => {
    return express.static(resolve(path), {
        maxAge: cache ? 1000 * 60 * 60 * 24 * 30 : 0
    });
};

app.use("/dist", serve("./dist", isProd));
app.use("/public", serve("./static", isProd));

export default app;
