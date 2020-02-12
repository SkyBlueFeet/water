import { Router } from "express";

const index = Router();

index.get("/", function(req, res, next) {
    res.render("index", { title: "Express" });
});

export default index;
