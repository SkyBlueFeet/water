process.env.NODE_ENV = "development";

import setRouter from "../router/ssr";
import setRender from "../frame/render";
import createError from "http-errors";
import app from "./app";

app.use("/app", setRouter(setRender(app)));

const port = process.env.PORT || 8080;

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

app.listen(port);
