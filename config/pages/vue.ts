import { Entry } from "webpack";
import { resolve } from "../utils";
import { Options as PageOptions } from "html-webpack-plugin";
import { MixingPagesOption } from ".";
import { env } from "../global";

export default function(env: env): MixingPagesOption {
    const vueEntry: Entry = {
        app: resolve("example/main.ts")
    };

    const vuePages: PageOptions[] = [
        {
            filename: "index.html",
            template: resolve("example/index.html")
        }
    ];

    return {
        entries: vueEntry,
        htmlOptions: vuePages
    };
}
