import _ from "lodash";
// import { user } from "../types";

type Feilds<T> = {
    [key in keyof T]?: string;
};

type ConnStr = "AND" | "OR" | "," | "NOT";

function setName(name: string): string {
    return "water.`" + name + "`";
}

function mapping<T>(condition: Feilds<T>, conn: ConnStr = "AND"): string {
    return _.keys(condition)
        .map(k => `${k}="${condition[k]}"`)
        .join(` ${conn} `);
}

export function insert<T>(name: string, table: Feilds<T>): string {
    const interpolation = _(table)
        .values()
        .map(v => `"${v}"`)
        .join(",");
    const fields = _(table)
        .keys()
        .join(",");
    return `INSERT INTO ${setName(name)} (${fields}) VALUES(${interpolation})`;
    //INSERT INTO water.`user` (uid, uidentity, utel, upwd, uemail, uname, uaccount, udate) VALUES('', '', '', '', '', '', '', '')
}

export function select(name: string): string;
export function select<T>(name: string, condition?: Feilds<T>): string;
export function select<T>(
    name: string,
    condition?: Feilds<T>,
    fields?: Array<keyof T>
): string;
export function select<T>(
    name: string,
    condition: Feilds<T> = {},
    fields: Array<keyof T> = [],
    conn: ConnStr = "AND"
): string {
    //SELECT uid, uidentity, utel, upwd, uemail, uname, uaccount, udate FROM water.`user` WHERE uaccount = ? and upwd=?;
    const range = fields.join(",");
    const position = mapping(condition, conn);
    return `SELECT ${range || "*"} FROM ${setName(name)} ${
        position ? " WHERE " + position : ""
    }`;
}

export function update<T>(
    name: string,
    newValue: Feilds<T>,
    condition: Feilds<T>,
    conn: ConnStr = "AND"
): string {
    const values = mapping(newValue, ",");
    const position: string = mapping(condition, conn);
    return `UPDATE ${setName(name)} SET ${values} ${
        position ? ` WHERE ` + position : ""
    }`;
    //UPDATE water.`user` SET uid='', uidentity='', utel='', upwd='', uemail='', uname='', uaccount='', udate=''
}

export function deletes<T>(
    name: string,
    condition: Feilds<T>,
    conn: ConnStr = "AND"
): string {
    // DELETE FROM water.`user` WHERE uid='' AND uidentity='' AND utel='' AND upwd='' AND uemail='' AND uname='' AND uaccount='' AND udate='';
    const position = mapping(condition, conn);
    return `DELETE FROM ${setName(name)} ${
        position ? `WHERE ${position} ` : ""
    }`;
}

// const testVal: Feilds<user> = {
//     uid: "uid",
//     uaccount: "uaccount",
//     udate: "udate",
//     uemail: "uemail",
//     uidentity: "uidentity",
//     upwd: "upwd"
// };

// const newVal: Feilds<user> = {
//     uid: "uid2",
//     uaccount: "uaccount2",
//     udate: "update2",
//     uemail: "uemail2",
//     uidentity: "uidentity2",
//     upwd: "upwd2"
// };

// console.log(insert("user", testVal));
// console.log(update("user", testVal, newVal, "OR"));
// console.log(select("user", testVal, ["uaccount", "uidentity", "uid"]));
// console.log(deletes("user", testVal, "OR"));
