import { Express } from "express";
import { serverError, pageNotFound } from "../handler/error";

export default function(app: Express): Express {
    //Page Not Found 404
    app.use(pageNotFound);

    // error handler
    app.use(serverError);
    return app;
}
