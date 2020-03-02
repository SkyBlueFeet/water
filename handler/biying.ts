import axios from "axios";

export default async function(): Promise<any> {
    const images = await axios("https://cn.bing.com/HPImageArchive.aspx", {
        method: "GET",
        params: {
            format: "js",
            idx: 0,
            n: 1,
            mkt: "zh-CN"
        }
    });
    return images;
}
