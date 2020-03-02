import { Router } from "express";
import createUid = require("node-uid");
import md5 = require("md5");
import {
    update,
    select,
    deletes,
    insert,
    fuzzy,
    Feilds
} from "../handler/create.sql";

import {
    Identity,
    Order,
    OrderStatus,
    Product,
    OrderRecord
} from "../mysql/types";

import { handleQuery, createEjsError } from "../handler/error";
import query from "../handler/query";
import { User } from "../mysql/types";
import tokenAuth from "../handler/token.auth";
import { dateFormat, base64ToFile } from "../handler/format";
const admin = Router();

function strTrim(str: string, isGlobal: boolean): string {
    let result: string;
    result = str.replace(/(^\s+)|(\s+$)/g, "");
    if (isGlobal) {
        result = result.replace(/\s/g, "");
    }
    return result;
}

admin.get("*", async (req, res, next) => {
    const loginPage = [
        "/admin/login",
        "/admin/login/",
        "/admin/reset",
        "/admin/reset/"
    ];
    if (!req.body.uid && !loginPage.includes(req.originalUrl)) {
        res.redirect("/admin/login");
    } else {
        next();
    }
});

admin.get("/login", async function(req, res, next) {
    res.render(
        "admin/login",
        { data: { type: "login" } },
        createEjsError(res, next)
    );
});

admin.get("/reset", async function(req, res) {
    res.render("admin/login", { data: { type: "reset" } });
});

admin.post("/login", async function(req, res, next) {
    const { uaccount, upwd, uidentity } = req.body;
    let _login: string;
    // 判断超级管理员
    if (uaccount == "administrator") {
        _login = select<User>("user", {
            uaccount,
            upwd: md5(upwd)
        });
    } else {
        _login = select<User>("user", {
            uaccount,
            uidentity,
            upwd: md5(upwd)
        });
    }
    const $admin = await handleQuery(next, query<User>(_login));
    if ($admin.results.length > 0) {
        const $user = $admin.results[0];
        const jwt = new tokenAuth($user.uid);
        const token = jwt.generateToken();
        res.cookie("APP_TOKEN", token);
        res.redirect("/");
    } else {
        res.render(
            "admin/login",
            {
                data: {
                    type: "login",
                    pwdError: true
                }
            },
            createEjsError(res, next)
        );
    }
});

//后台重置密码
admin.post("/reset", async function(req, res, next) {
    const resetPwd = update<User>(
        "user",
        { upwd: md5(req.body.upwd) },
        { uaccount: req.body.uaccount, uidentity: req.body.uidentity }
    );
    const $operate = await handleQuery(next, query(resetPwd, "OPERATE"));
    const data = { type: "reset", failure: false, updatePwd: false };
    if ($operate.results.affectedRows > 0) {
        data.updatePwd = true;
    } else {
        data.failure = true;
    }
    res.render("admin/login", { data });
});

//工作人员页面
admin.get("/handler", async function(req, res, next) {
    let _getOrderSql: string;
    if (req.query.type === "MISSED") {
        _getOrderSql = select<Order>("order", {
            ostatus: OrderStatus[req.query.type]
        });
    } else {
        _getOrderSql = select<Order>("order", {
            ohandler: req.body.uid,
            ostatus: OrderStatus[req.query.type]
        });
    }
    const $orders = (await handleQuery(next, query(_getOrderSql))).results;

    const modify: string = req.query.result ? req.query.result : undefined;

    res.render(
        "admin/handler",
        { data: { table: $orders, type: req.query.type, modify } },
        createEjsError(res, next)
    );
});

//工作人员订单处理
admin.get("/order/:oid", async function(req, res, next) {
    const status = req.query.status;
    const oid = req.params.oid;
    const ostatus = status === "FINISHING" ? "MISSED" : "FINISHING";
    const updateStatus = update<Order>(
        "order",
        { ostatus: OrderStatus[status], ohandler: res.locals.detils.uid },
        { oid, ostatus: OrderStatus[ostatus] }
    );
    const $operate = await handleQuery(next, query(updateStatus, "OPERATE"));
    const result = $operate.results.affectedRows > 0 ? "success" : "failure";
    res.redirect(
        `http://localhost:8080/admin/handler?type=${ostatus}&&result=${result}`
    );
});

//人员管理页面请求
admin.all("/foo/:uidentity", async (req, res, next) => {
    const { uidentity } = req.params;
    const { operate, uid, searchValue, result } = req.query;
    if (Identity[uidentity]) {
        if (searchValue) {
            const searchSql = fuzzy<User>(
                "user",
                searchValue,
                [
                    "uaccount",
                    "uaddress",
                    "udate",
                    "uemail",
                    "uidentity",
                    "utel",
                    "uid"
                ],
                undefined,
                {
                    uidentity
                }
            );
            const $operate = await handleQuery<User>(
                next,
                query<User>(searchSql)
            );
            res.render(
                "admin/index",
                {
                    data: {
                        searchValue,
                        feild: ["USER", "MEMBER", "ADMIN"],
                        uidentity,
                        operate,
                        table: $operate.results
                    }
                },
                createEjsError(res, next)
            );
        } else if (!operate) {
            const allMember = select<User>("user", { uidentity });
            const $operate = await handleQuery<User>(
                next,
                query<User>(allMember)
            );
            res.render(
                "admin/index",
                {
                    data: {
                        success: result === "success",
                        failure: result === "failure",
                        isRoot: res.locals.isRoot,
                        feild: ["USER", "MEMBER", "ADMIN"],
                        uidentity,
                        operate,
                        table: $operate.results
                    }
                },
                createEjsError(res, next)
            );
        } else if (operate === "add") {
            const addMember = insert<User>("user", {
                uid: createUid(8),
                utel: req.body.utel,
                udate: dateFormat(new Date()),
                uname: req.body.uname,
                upwd: md5("123456"),
                uaccount: req.body.utel,
                uidentity: Identity[uidentity]
            });
            const $operate = await handleQuery(
                next,
                query(addMember, "OPERATE")
            );
            const url =
                $operate.results.affectedRows > 0
                    ? `/admin/foo/${uidentity}?result=success`
                    : `/admin/foo/${uidentity}?result=failure`;
            res.redirect(url);
        } else if (operate === "delete" && uid) {
            const deleteUser = deletes<User>("user", { uid });
            const $operate = await handleQuery(
                next,
                query(deleteUser, "OPERATE")
            );
            const url =
                $operate.results.affectedRows > 0
                    ? `/admin/foo/${uidentity}?result=success`
                    : `/admin/foo/${uidentity}?result=failure`;
            res.redirect(url);
        }
    } else {
        next();
    }
});

admin.get("/foo/order/detail", async function(req, res, next) {
    const { uid } = req.query;
    if (uid) {
        const searchSql = select<User>("user", { uid });
        const $operate = await handleQuery<User>(next, query<User>(searchSql));
        if ($operate.results.length > 0) {
            res.redirect(
                `/admin/foo/${$operate.results[0].uidentity}?searchValue=${uid}`
            );
        }
    } else {
        next();
    }
});

//产品管理请求
admin.all("/foo/product", async (req, res, next) => {
    const { operate, pid, searchValue, result } = req.query;
    const {
        price,
        title,
        description,
        stock,
        specification,
        remark,
        banner
    } = req.body;
    const image = await base64ToFile(banner);
    if (!operate && !pid && !searchValue) {
        const allProd = select<Product>("product");
        const $operate = await handleQuery<Product>(
            next,
            query<Product>(allProd)
        );
        res.render(
            "admin/index",
            {
                data: {
                    success: result === "success",
                    failure: result === "failure",
                    feild: ["USER", "MEMBER", "ADMIN"],
                    uidentity: "product",
                    operate,
                    pid,
                    table: $operate.results
                }
            },
            createEjsError(res, next)
        );
    } else if (searchValue) {
        const searchSql = fuzzy<Product>("product", searchValue, [
            "description",
            "price",
            "remark",
            "specification",
            "stock",
            "title",
            "pid"
        ]);
        const $operate = await handleQuery<Product>(
            next,
            query<Product>(searchSql)
        );
        res.render(
            "admin/index",
            {
                data: {
                    searchValue,
                    feild: ["USER", "MEMBER", "ADMIN"],
                    uidentity: "product",
                    operate,
                    pid,
                    table: $operate.results
                }
            },
            createEjsError(res, next)
        );
    } else if (operate && pid) {
        let sql: string;
        const newValue: Feilds<Product> = {
            price,
            title,
            description: strTrim(req.body.description, true),
            stock,
            specification,
            remark: strTrim(req.body.remark, true)
        };
        if (image) {
            newValue.banner = image;
        }
        if (operate == "edit") {
            sql = update<Product>("product", newValue, { pid });
        } else if (operate == "delete") {
            sql = deletes<Product>("product", { pid });
        }
        const $result = (await handleQuery(next, query(sql, "OPERATE")))
            .results;
        const url =
            $result.affectedRows > 0
                ? "/admin/foo/product?result=success"
                : "/admin/foo/product?result=failure";
        res.redirect(url);
    } else if (operate == "add") {
        const sql = insert<Product>("product", {
            pid: createUid(12),
            price: req.body.price,
            title: req.body.title,
            description: strTrim(req.body.description, true),
            stock: req.body.stock,
            specification: req.body.specification,
            remark: strTrim(req.body.remark, true),
            banner: image
        });
        const $result = await handleQuery(next, query(sql, "OPERATE"));
        const url =
            $result.results.affectedRows > 0
                ? "/admin/foo/product?result=success"
                : "/admin/foo/product?result=failure";
        res.redirect(url);
    } else {
        next();
    }
});

//产品管理请求
admin.get("/foo/order", async (req, res, next) => {
    const { searchValue, type } = req.query;
    if (!searchValue && !type) {
        const allMember = select<OrderRecord>("orderrecord");
        const $operate = await handleQuery<OrderRecord>(
            next,
            query<OrderRecord>(allMember)
        );
        res.render(
            "admin/index",
            {
                data: {
                    feild: ["USER", "MEMBER", "ADMIN"],
                    uidentity: "order",
                    search: searchValue,
                    type,
                    table: $operate.results
                }
            },
            createEjsError(res, next)
        );
    } else if (searchValue) {
        const allMember = fuzzy<OrderRecord>("orderrecord", searchValue, [
            "membername",
            "membertel",
            "odate",
            "olocation",
            "oremark",
            "ostatus",
            "username",
            "usertel"
        ]);
        const $operate = await handleQuery<OrderRecord>(
            next,
            query<OrderRecord>(allMember)
        );
        res.render(
            "admin/index",
            {
                data: {
                    searchValue,
                    feild: ["USER", "MEMBER", "ADMIN"],
                    uidentity: "order",
                    search: searchValue,
                    type,
                    table: $operate.results
                }
            },
            createEjsError(res, next)
        );
    }
});

export default admin;
