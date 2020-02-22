import createError from "http-errors";
import { Response, NextFunction, Request } from "express";
import { QueryResult } from "./query";
import _ from "lodash";

// 404
export function pageNotFound(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    res.render("404");
}

// 500
export function serverError(
    err: Error,
    req: Request,
    res: Response
    // next: NextFunction
): void {
    // set locals, only providing error in development
    if (process.env.NODE_ENV === "development") {
        res.locals.message = err.message;
        res.locals.error = req.app.get("env") === "development" ? err : {};

        // console.log(err);

        // render the error page
        res.status(err["status"] || 500);
        res.render("error");
    }else{
        res.render("500");
    }
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

type queryCallbackFn<T> = (result?: QueryResult<T>) => Promise<any> | any;
// 数据库查询错误处理
export async function handleQuery<T>(
    next: NextFunction,
    queryResult: Promise<QueryResult<T>>
): Promise<QueryResult<T>>;
export async function handleQuery<T>(
    next: NextFunction,
    queryResult: Promise<QueryResult<T[]>>
): Promise<QueryResult<T[]>>;
export async function handleQuery<T>(
    next: NextFunction,
    callbackFn: queryCallbackFn<T>
): Promise<any>;
export async function handleQuery<T>(
    next: NextFunction,
    queryResult: Promise<QueryResult<T>>,
    callbackFn: queryCallbackFn<T>
): Promise<any>;
export async function handleQuery<T>(
    next: NextFunction,
    arg2: Promise<QueryResult<T>> | queryCallbackFn<T>,
    callbackFn?: queryCallbackFn<T>
): Promise<any> {
    try {
        if (typeof arg2 == "object" && _.isFunction(callbackFn)) {
            return callbackFn(await arg2);
        } else if (typeof arg2 === "object" && !_.isFunction(callbackFn)) {
            const queryResult = await arg2;
            return queryResult;
        } else if (_.isFunction(arg2)) {
            return await arg2();
        }
    } catch (error) {
        console.log(123);
        if (error) {
            next(error);
        }
    }
}
