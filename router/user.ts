import { Router } from "express";
import { createEjsError, handleQuery } from "../handler/error";
import * as CreateSql from "../handler/create.sql";
import query from "../handler/query";
import { User, Identity, Order, OrderStatus } from "../mysql/types";
import tokenAuth from "../handler/token.auth";
import createUid = require("node-uid");
import md5 = require("md5");
import { dateFormat, base64ToFile } from "../handler/format";

const user = Router();

function loginStatus(
    identity = "user",
    failure = false,
    updatePwd = false
): any {
    return {
        title: "登录",
        identity,
        data: {
            failure,
            type: "login",
            title: "用 户 登 录",
            updatePwd
        }
    };
}

user.get("/login", function(req, res, next) {
    res.render("user/login", loginStatus(), createEjsError(res, next));
});

user.post("/login", function(req, res, next) {
    const allUserSql = CreateSql.select<User>("user", {
        uaccount: req.body.inputID,
        upwd: md5(req.body.inputPwd),
        uidentity: req.query.type
    });

    handleQuery(next, query<User>(allUserSql), async ({ results }) => {
        if (results.length > 0) {
            // 将用户id传入并生成token
            const $user = results[0];
            const jwt = new tokenAuth($user.uid);
            const token = jwt.generateToken();
            res.cookie("APP_TOKEN", token);
            res.redirect("/");
        } else {
            res.render("user/login", loginStatus("user", true));
        }
        return;
    });
});

user.get("/reset", async function(req, res, next) {
    res.render(
        "user/login",
        {
            title: "重置密码",
            data: {
                type: "reset",
                title: "重置密码"
            }
        },
        createEjsError(res, next)
    );
});

user.post("/reset", async (req, res, next) => {
    const updatePwd = CreateSql.update<User>(
        "user",
        {
            upwd: md5(req.body.inputPwd)
        },
        {
            uaccount: req.body.inputID,
            uidentity: req.query.type
        }
    );
    const $operate = await handleQuery(next, query(updatePwd, "OPERATE"));
    const resResult = {
        title: "重置密码",
        data: {
            type: "reset",
            title: "重置密码",
            failure: false,
            updatePwd: false
        }
    };
    if ($operate.results.affectedRows > 0) {
        resResult.data.updatePwd = true;
        res.render("user/login", resResult, createEjsError(res, next));
    } else {
        resResult.data.failure = true;
        res.render("user/login", resResult, createEjsError(res, next));
    }
});

user.get("/register", function(req, res, next) {
    res.render(
        "user/login",
        {
            title: "注 册",
            data: {
                type: "register",
                title: "用 户 注 册"
            }
        },
        createEjsError(res, next)
    );
});
user.post("/register", (req, res, next) => {
    const $id = createUid(8);
    handleQuery(next, async () => {
        const getUidSql = CreateSql.select<User>("user", {
            uaccount: req.body.inputID
        });

        // 检查账号是否已存在
        const { results } = await query<User>(getUidSql);
        if (results.length === 0) {
            const createUser = CreateSql.insert<User>("user", {
                uid: $id,
                uidentity: Identity.USER,
                udate: dateFormat(new Date()),
                uaccount: req.body.inputID,
                upwd: md5(req.body.inputPwd),
                uname: $id,
                utel: req.body.inputID
            });

            //创建账号
            const { results } = await query<User>(createUser, "OPERATE");

            if (results.affectedRows > 0) {
                //获取新建用户ID
                const { results } = await query<User>(getUidSql);
                // 设置token
                const jwt = new tokenAuth(results[0].uid);
                const token = jwt.generateToken();
                res.cookie("APP_TOKEN", token);
                res.redirect("/");
            } else {
                const registerInfo = {
                    title: "注 册",
                    data: {
                        type: "register"
                    }
                };
                res.render(
                    "user/login",
                    registerInfo,
                    createEjsError(res, next)
                );
            }
        } else {
            res.render(
                "user/login",
                {
                    title: "注 册",
                    data: {
                        type: "register",
                        repeatError: true
                    }
                },
                createEjsError(res, next)
            );
        }
    });
});

user.get("/:id/message", (req, res, next) => {
    res.render(
        "user/message",
        { data: { type: "message" } },
        createEjsError(res, next)
    );
});

user.post("/update", async (req, res, next) => {
    const { uemail, upwd, uname, utel, uaddress, uavatar } = req.body;
    const image = await base64ToFile(uavatar, "avatar");
    const updateMsg = CreateSql.update<User>(
        "user",
        {
            uemail: uemail,
            upwd: upwd ? md5(upwd) : res.locals.detils.upwd,
            uname: uname,
            utel,
            uaddress,
            uavatar: image
        },
        {
            uid: res.locals.detils.uid
        }
    );
    const $operate = await handleQuery(next, query(updateMsg, "OPERATE"));
    const data: { status?: string } = {};
    $operate.results.affectedRows > 0
        ? (data.status = "failure")
        : (data.status = "success");
    res.redirect(`/user/${res.locals.detils.uid}/message`);
});

user.get("/:id/order", async function(req, res, next) {
    const getCurSql = CreateSql.select<Order>("order", {
        uid: res.locals.detils.uid,
        ostatus: OrderStatus.MISSED
    });
    await handleQuery(next, query(getCurSql), ({ results }) => {
        res.render(
            "user/order",
            { data: { type: "order", table: results } },
            createEjsError(res, next)
        );
    });
});

user.get("/logout", (req, res) => {
    res.clearCookie("APP_TOKEN");
    res.redirect("/");
});

export default user;
