import fs from "fs";
import jwt from "jsonwebtoken";
import global from "../global";
import { NextFunction, Response, Request } from "express";
import getUser from "./user.operate";
// import createError from "http-errors";
//生成token的方法

export default class Jwt {
    data: any;
    constructor(data: any) {
        this.data = data;
    }

    //生成token
    generateToken(): string {
        const data = this.data;
        const created = Math.floor(Date.now() / 1000);
        const cert = fs.readFileSync(global.privateKey); //私钥 可以自己生成
        const token = jwt.sign(
            {
                data,
                exp: created + 60 * 30
            },
            cert,
            { algorithm: "RS256" }
        );
        return token;
    }

    // 校验token
    verifyToken(): any {
        const token = this.data;
        const cert = fs.readFileSync(global.publicKey); //公钥 可以自己生成
        let uid: any;
        try {
            const result =
                jwt.verify(token, cert, { algorithms: ["RS256"] }) || {};
            const exp = 0 || result["exp"];
            const current = Math.floor(Date.now() / 1000);
            if (current <= exp) {
                uid = result["data"] || {};
            }
        } catch (e) {
            return;
        }
        return uid;
    }

    static async middleWare(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        res.locals.name = "";
        const token = req.cookies.APP_TOKEN;
        const jwt = new Jwt(token);
        const uid = jwt.verifyToken();
        res.locals.IS_LOGIN = !!uid;
        req.body.uid = uid;
        res.locals.detils = {};
        res.locals.isRoot = uid === "root";
        if ((global.returnsList.includes(req.url) && uid) || uid) {
            const $user = await getUser(uid, next);
            res.locals.detils = {
                ...$user,
                name: $user.uname || $user.uid
            };
            next();
        } else if (
            (global.blacklist.includes(req.url) && !uid) ||
            global.matchUrl(req.url)
        ) {
            res.redirect("/user/login");
        } else {
            next();
        }
    }
}
