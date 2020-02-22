import path from "path";

const pa = path.relative(
    path.resolve("../"),
    path.resolve("../public/images/banner/5g9b9225u9c01582308251047.png")
);

console.log(pa);

function select(id: string, name: string, path: string): string {
    let sql = "select * from table ";
    let condition = "";
    if (id) {
        condition += "id='" + id + "' and ";
    }
    if (name) {
        condition += "name='" + name + "' and ";
    }
    if (path) {
        condition += "path='" + path + "' and ";
    }
    if (condition != "") {
        sql += "where " + condition;
    }
    return sql;
}

// select("qwer", "text", "/public/uii.jpg");

console.log(select("qwer", "text", "/public/uii.jpg"));
