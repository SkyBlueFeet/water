import createError from "http-errors";
import { Response, NextFunction, Request } from "express";

import { QueryResult } from "./query";

// 404
export function pageNotFound(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    next(createError(404));
}

// 500
export function serverError(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // console.log(err);

    // render the error page
    res.status(err["status"] || 500);
    res.render("error");
}

// 500
export function createEjsError(
    res: Response,
    next?: NextFunction
): (err: Error, html: string) => void {
    return (err: Error, html: string): void => {
        if (err) {
            next(err);
        } else {
            res.send(html);
        }
    };
}

// 数据库查询错误处理
export async function handleQuery<T>(
    queryResult: Promise<QueryResult<T>>,
    next: NextFunction,
    callbackFn: (result: QueryResult<T>) => void
): Promise<void> {
    try {
        callbackFn(await queryResult);
    } catch (error) {
        if (error) {
            next(error);
        }
    }
}
