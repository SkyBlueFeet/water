import { Router } from "express";
import { createEjsError, handleQuery } from "../handler/error";
import { update, select, insert } from "../handler/create.sql";
import query from "../handler/query";
import { User, Product, Order, OrderStatus } from "../mysql/types";
import createUid = require("node-uid");
import { dateFormat } from "../handler/format";
const business = Router();

/**
 * @deprecated
 */
business.get("/buyVip", async function(req, res, next) {
    res.render("business/pricing", { data: {} }, createEjsError(res, next));
});
business.post("/buyVip", async function(req, res, next) {
    let status = "error";
    const $result = await handleQuery(next, async () => {
        const uid = req.body.uid;
        const getVipSql = select<User>("user", {
            uid
        });
        //得到原来的Vip月数
        const originResult = (await query<User>(getVipSql)).results[0];
        const oVip = originResult.uvip ? originResult.uvip : 0;
        const uvip = (oVip + parseInt(req.body.mouth)).toString();
        const setVipSql = update<User>("user", { uvip }, { uid });
        //增加Vip月数
        return [(await query<User>(setVipSql, "OPERATE")).results, uvip];
    });

    status = $result[0].affectedRows > 0 ? "success" : "error";
    res.render(
        "business/pricing",
        { data: { status, time: $result[1] } },
        createEjsError(res, next)
    );
});

/**
 * @deprecated
 */
business.get("/booking", (req, res, next) => {
    res.render("business/booking", { data: {} }, createEjsError(res, next));
});

/**
 * 产品列表
 */
business.get("/product", async (req, res, next) => {
    const sql = select("product");
    const productList = await handleQuery(next, query<Product>(sql));
    res.render(
        "business/product",
        { data: { list: JSON.stringify(productList.results) } },
        createEjsError(res, next)
    );
});

/**
 * 购物车
 */
business.get("/cart", async (req, res, next) => {
    res.render("business/cart", { data: {} }, createEjsError(res, next));
});

business.post("/cart", async (req, res) => {
    res.redirect("business/order");
});

/**
 * 订单信息
 */
business.get("/order", async (req, res, next) => {
    res.render("business/order", { data: {} }, createEjsError(res, next));
});

business.post("/order", async (req, res, next) => {
    const {
        uid,
        olocation,
        otel,
        otype,
        omessage,
        oremark,
        odelivery
    } = req.body;
    const now = new Date();
    const _delivery = now.getTime() + odelivery * 60 * 60 * 1000;

    const newOrder = insert<Order>("order", {
        oid: createUid(12),
        uid,
        olocation,
        otel,
        otype,
        omessage,
        odate: dateFormat(now),
        oremark,
        ostatus: OrderStatus.MISSED,
        odelivery: dateFormat(new Date(_delivery))
    });
    await handleQuery(next, query(newOrder, "OPERATE"));

    res.redirect(`/user/${req.body.uid}/order`);
});

export default business;
