process.env.NODE_ENV === "production";

import fs from "fs";
import createError from "http-errors";
import setRender from "../frame/render";
import setRouter from "../router/ssr";

import app from "./app";
import global from "../global";

const compression = require("compression");

app.use(compression({ threshold: 0 }));

if (fs.existsSync(global.prod.outputPath)) {
    app.use("/app", setRouter(setRender()));
} else {
    console.log("dist文件夹不存在！");
    process.exit(0);
}

app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

const port = process.env.PORT || 3000;

app.listen(port);
