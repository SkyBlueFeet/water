import BabelPlugin from "rollup-plugin-babel";
import NodeResolve from "@rollup/plugin-node-resolve";
import CommonJS from "rollup-plugin-commonjs";
import VuePlugin from "rollup-plugin-vue";
import _ from "lodash";
import {
    RollupOptions,
    OutputOptions,
    ModuleFormat,
    OutputPlugin
} from "rollup";
import { name, version, author } from "../package.json";
import Typescript from "@rollup/plugin-typescript";
import path from "path";
import { terser } from "rollup-plugin-terser";

const entry = "lib/index.ts";
const outDir = "dist";
const useEslint = false;
const extensions = [".vue", "js", ".ts", ".tsx", ".jsx", ".json"];
const babelTransformFeild = [".js", ".vue", ".jsx", ".tsx"];
const banner =
    `${"/*!\n" + " * "}${name}.js v${version}\n` +
    ` * (c) 2018-${new Date().getFullYear()} ${author}\n` +
    ` * Released under the MIT License.\n` +
    ` */`;

const external = {
    vue: "vue"
};

const outputFormat: Array<MyOutputOptions> = ["cjs", "esm", "umd", "iife"];

type MyOutputOptions = ModuleFormat | Array<ModuleFormat | OutputOptions>;

function setOutput(formats: typeof outputFormat): OutputOptions[] {
    type record = {
        format: ModuleFormat;
        prod: boolean;
        additional: OutputOptions;
    };

    function formatValue(formats: MyOutputOptions): record {
        let _format: ModuleFormat;

        let _additional: OutputOptions = {};

        if (_.isString(formats)) {
            _format = formats;
        } else if (_.isArray(formats)) {
            _format = formats[0] as ModuleFormat;
            _additional = _.assign(_additional, formats[1] as OutputOptions);
        }

        return {
            format: _format,
            prod: process.env.NODE_ENV === "production",
            additional: _additional
        };
    }

    function setPreOption(msg: record, minify?: boolean): OutputOptions {
        return {
            format: msg.format,
            name,
            file: `${outDir}/${name}.${msg.format}${minify ? ".min" : ""}.js`,
            globals: external,
            banner
        };
    }

    return formats.reduce(function(
        prevItem: OutputOptions[],
        item: MyOutputOptions,
        index
    ): OutputOptions[] {
        if (index === 1) {
            const prevMsg = formatValue(prevItem);
            prevItem = [];

            prevItem.push(_.merge(setPreOption(prevMsg), prevMsg.additional));

            if (prevMsg.prod) {
                prevItem.push(
                    _.merge(setPreOption(prevMsg, true), prevMsg.additional)
                );
            }
        }

        const finalOption = [];

        const msg = formatValue(item);

        finalOption.push(_.merge(setPreOption(msg), msg.additional));

        if (msg.prod)
            finalOption.push(_.merge(setPreOption(msg, true), msg.additional));

        return prevItem.concat(finalOption);
    }) as OutputOptions[];
}

const rollupConfig: RollupOptions = {
    input: entry,
    output: setOutput(outputFormat),
    inlineDynamicImports: true,
    plugins: [
        Typescript({
            typescript: require("typescript"),
            exclude: "node_modules/**"
        }),
        // 载入CommonJS模块
        BabelPlugin({
            runtimeHelpers: true,
            extensions: babelTransformFeild,
            exclude: "node_modules/**"
        }),
        NodeResolve({
            extensions
        }),
        CommonJS(),
        VuePlugin(),
        terser({
            include: [/^.+\.min\.js$/],
            exclude: ["some*"]
        })
    ],
    external: ["vue"]
};

export default rollupConfig;
