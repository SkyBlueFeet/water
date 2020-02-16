import { Router } from "express";

const index = Router();

index.get("/", function(req, res, next) {
    res.render("index", { title: "渴了么！" });
});

export default index;
