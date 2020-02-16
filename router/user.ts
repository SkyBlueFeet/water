import { Router } from "express";
import { createEjsError, handleQuery } from "../handler/error";
import * as CreateSql from "../handler/create.sql";
import { simpleQuery } from "../handler/query";
import { user } from "../mysql/types";
import tokenAuth from "../handler/token.auth";
const user = Router();

function loginStatus(identity = "user", failure = false): any {
    return {
        title: "登录",
        identity,
        data: {
            failure
        }
    };
}

user.get("/login", function(req, res, next) {
    res.render("login", loginStatus(), createEjsError(res, next));
});

user.post("/login", function(req, res, next) {
    const allUserSql = CreateSql.select<user>("user", {
        uaccount: req.body.inputID,
        upwd: req.body.inputPwd
    });

    handleQuery(simpleQuery<user>(allUserSql), next, ({ results }) => {
        if (results.length > 0) {
            // 将用户id传入并生成token
            const jwt = new tokenAuth(results[0].uid);
            const token = jwt.generateToken();
            console.log(token);
            res.redirect("/");
        } else {
            res.render("login", loginStatus("user", true));
        }
    });
});

export default user;
