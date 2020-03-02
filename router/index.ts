import { Router } from "express";

const index = Router();

index.get("/", async function(req, res, next) {
    res.render("index");
});

export default index;
