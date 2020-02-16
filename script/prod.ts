process.env.NODE_ENV === "production";

import fs from "fs";
import createError from "http-errors";
import setRender from "../frame/render";
import setRouter from "../router/ssr";
import follow from "./follow";

import app from "./app";
import global from "../global";

if (fs.existsSync(global.prod.outputPath)) {
    app.use("/app", setRouter(setRender()));
} else {
    console.log("dist文件夹不存在！");
    process.exit(0);
}
follow(app);
const port = process.env.PORT || 3000;

app.listen(port);
