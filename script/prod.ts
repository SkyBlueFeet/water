process.env.NODE_ENV === "production";

import fs from "fs";

import setRender from "../frame/render";
import setRouter from "../router/ssr";

import app from "./app";
import global from "../frame/global";

const compression = require("compression");

app.use(compression({ threshold: 0 }));
if (fs.existsSync(global.prod.outputPath)) {
    app.use("/app", setRouter(setRender()));
} else {
    console.log("dist文件夹不存在！");
    process.exit(0);
}

const port = process.env.PORT || 3000;

app.listen(port);
