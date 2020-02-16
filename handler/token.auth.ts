import fs from "fs";
import jwt from "jsonwebtoken";
import global from "../global";
import { NextFunction, Response, Request } from "express";
import createError from "http-errors";
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
        let res: any;
        try {
            const result =
                jwt.verify(token, cert, { algorithms: ["RS256"] }) || {};
            const exp = 0 || result["exp"];
            const current = Math.floor(Date.now() / 1000);
            if (current <= exp) {
                res = result["data"] || {};
            }
        } catch (e) {
            res = "err";
        }
        return res;
    }

    static middleWare(req: Request, res: Response, next: NextFunction): void {
        if (global.blacklist.includes(req.url)) {
            const token = req.headers.taken;
            const jwt = new Jwt(token);
            const result = jwt.verifyToken();
            if (result == "err") next(createError(403));
            else next();
        } else {
            next();
        }
    }
}
