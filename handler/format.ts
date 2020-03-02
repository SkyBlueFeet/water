import fs from "fs"; // 引入fs模块
import createUid = require("node-uid");
import path from "path";
import { setPath } from "../global";

/**
 * @param { Date } date
 * @param fmt
 */
export const dateFormat = function(date: Date, fmt?: string): string {
    fmt = fmt ? fmt : "yyyy-MM-dd hh:mm:ss";
    function format(this: Date, fmt: string): string {
        const o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            S: this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                (this.getFullYear() + "").substr(4 - RegExp.$1.length)
            );
        }
        for (const k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(
                    RegExp.$1,
                    RegExp.$1.length == 1
                        ? o[k]
                        : ("00" + o[k]).substr(("" + o[k]).length)
                );
            }
        }
        return fmt;
    }
    return format.call(date, fmt);
};

/**
 * Base64ToFile
 */
export async function base64ToFile(
    base64Url: string,
    dir = "banner"
): Promise<string> {
    if (!base64Url) return "";
    const imageName = createUid(12) + Date.now() + ".png";
    const imgPath = setPath(`public/images/${dir}/${imageName}`);

    const base64 = base64Url.replace(/^data:image\/\w+;base64,/, ""); //去掉图片base64码前面部分data:image/png;base64
    const dataBuffer = Buffer.alloc(base64.length, base64, "base64"); //把base64码转成buffer对象，
    new Promise<string>((res, rej) => {
        fs.writeFile(imgPath, dataBuffer, function(err) {
            //用fs写入文件
            if (err) rej(err);
            else res(imgPath);
        });
    });
    return `/public/images/${dir}/${imageName}`;
}
