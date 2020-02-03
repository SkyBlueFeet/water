import BabelPlugin from "rollup-plugin-babel";
import NodeResolve from "@rollup/plugin-node-resolve";
import CommonJS from "@rollup/plugin-commonjs";
import VuePlugin from "rollup-plugin-vue";
import _ from "lodash";
import { DEFAULT_EXTENSIONS } from "@babel/core";
import scss from "rollup-plugin-scss";
import filesize from "rollup-plugin-filesize";
import { eslint } from "rollup-plugin-eslint";
import { RollupOptions, OutputOptions, ModuleFormat } from "rollup";
import path from "path";
import fs from "fs";

import Typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";

import {
    name as $name,
    version as $version,
    author as $author
} from "../package.json";

type umdFormat =
    | {
          format: ModuleFormat;
          additional: OutputOptions;
      }
    | ModuleFormat;

const $entry = "lib/index.ts";
const $outDir = "dist";
const $useEslint = true;
const $eslintFeild = ["js", "jsx", "tsx", "ts", "vue"];
const $extensions = [".vue", "js", ".ts", ".tsx", ".jsx", ".json"];
const $babelTransformFeild = [".ts", ".tsx", ".jsx", ".vue"].concat(
    DEFAULT_EXTENSIONS
);

const $preSetExternal = {
    vue: "vue",
    "vue-tsx-support": "vue-tsx-support",
    "vue-property-decorator": "vue-property-decorator"
};

const $outputFormat: Array<umdFormat> = ["cjs", "esm", "umd", "iife"];

/**
 * 个人输出设置整理合并，生成rollup标准的输出设置格式
 * @param formats 个人输出设置数组
 * @returns { OutputOptions }
 */
function setOutput(formats: Array<umdFormat>): OutputOptions[] {
    type record = {
        format: ModuleFormat;
        prod: boolean;
        additional: OutputOptions;
    };

    /**
     *
     * 将输出设置格式化成通用易推断格式
     *
     * @param formats 个人输出设置数组
     */
    function formatValue(formats: umdFormat): record {
        let _format: ModuleFormat;

        let _additional: OutputOptions = {};

        if (_.isString(formats)) _format = formats;
        else if (_.isPlainObject(formats)) {
            _format = formats.format;
            _additional = _.merge(_additional, formats.additional);
        }

        return {
            format: _format,
            prod: process.env.NODE_ENV === "production",
            additional: _additional
        };
    }

    /**
     * 添加预设配置
     * @param msg 规范后的配置
     * @param minify 是否进行压缩
     */
    function setPreOption(msg: record, minify?: boolean): OutputOptions {
        const fileName = `${$name}.${msg.format}${minify ? ".min" : ""}.js`;
        const file = `${$outDir}/${fileName}`;
        return {
            format: msg.format,
            name: $name,
            file,
            globals: $preSetExternal,
            banner:
                `${"/*!\n" + " * "}${fileName} v${$version}\n` +
                ` * (c) 2018-${new Date().getFullYear()} ${$author}\n` +
                ` * Released under the MIT License.\n` +
                ` */`
        };
    }

    type callback<T> = (
        prev: unknown,
        current: T,
        index: number,
        arr: T[]
    ) => unknown;

    /**
     * 自实现reduce
     * @param this
     * @param callbackfn
     */
    function reduce<T>(this: Array<T>, callbackfn: callback<T>): unknown {
        let result: unknown;
        for (let i = 1, len = this.length; i < len; i++) {
            if (i === 1) result = this[0];
            result = callbackfn(result, this[i], i, this);
        }
        return result;
    }

    return reduce.call(
        formats,
        (
            prevItem: OutputOptions[],
            item: umdFormat,
            index: number
        ): OutputOptions[] => {
            if (index === 1) {
                const prevMsg = formatValue((prevItem as unknown) as umdFormat);
                prevItem = [];

                prevItem.push(
                    _.merge(setPreOption(prevMsg), prevMsg.additional)
                );

                if (prevMsg.prod) {
                    prevItem.push(
                        _.merge(setPreOption(prevMsg, true), prevMsg.additional)
                    );
                }
            }

            const finalOption: OutputOptions[] = [];

            const msg = formatValue(item);

            finalOption.push(_.merge(setPreOption(msg), msg.additional));

            if (msg.prod)
                finalOption.push(
                    _.merge(setPreOption(msg, true), msg.additional)
                );

            return prevItem.concat(finalOption);
        }
    );
}

// interface Loader {
//     name: string;
//     test: RegExp;
//     process: (this: Context, input: Payload) => Promise<Payload> | Payload;
// }

// interface Context {
//     /** Loader options */
//     options: any;
//     /** Sourcemap */
//     sourceMap: any;
//     /** Resource path */
//     id: string;
//     /** Files to watch */
//     dependencies: Set<string>;
//     /** Emit a waring */
//     warn: any;
//     /** https://rollupjs.org/guide/en#plugin-context */
//     plugin: any;
// }

// interface Payload {
//     /** File content */
//     code: string;
//     /** Sourcemap */
//     map?: string | any;
// }

/**
 * 检测文件或文件夹是否存在
 * @param  {String} dir 要写入文件的文件夹
 * @param  {String} filename 写入文件的文件名
 * @param  {String} data 写入文件的数据
 */
function writeFileSync(dir: string, filename: string, data: string): string {
    const FilePath = path.resolve(dir, filename);
    try {
        fs.mkdirSync(dir, {
            recursive: true //是否递归,默认false
        });
        fs.writeFileSync(FilePath, data, { flag: "w+" });
        return FilePath;
    } catch (error) {
        console.error(error);
        return "";
    }
}

// function scss(this: Context, payload: Payload): Payload {
//     writeFileSync(path.resolve($path, "../", "dist"), this.id, payload.code);
//     return payload;
// }

const rollupConfig: RollupOptions = {
    input: $entry,
    output: setOutput($outputFormat),
    inlineDynamicImports: true,
    plugins: [
        $useEslint &&
            eslint({
                fix: true,
                include: $eslintFeild.map(ext => new RegExp(`/\\.${ext}$/`))
            }),
        Typescript(),
        // 载入CommonJS模块

        NodeResolve({
            extensions: $extensions
        }),
        CommonJS(),
        VuePlugin({
            normalizer: "~vue-runtime-helpers/dist/normalize-component.js",
            css: false
        }),
        terser({
            include: [/^.+\.min\.js$/],
            exclude: ["some*"]
        }),
        BabelPlugin({
            runtimeHelpers: true,
            extensions: $babelTransformFeild
        }),
        filesize(),
        scss({
            //Choose *one* of these possible "output:..." options
            // Default behaviour is to write all styles to the bundle destination where .js is replaced by .css
            // output: true,

            // Filename to write all styles to
            // output: "bundle.css",

            // Callback that will be called ongenerate with two arguments:
            // - styles: the contents of all style tags combined: 'body { color: green }'
            // - styleNodes: an array of style objects: { filename: 'body { ... }' }
            output: function(
                styles: string,
                styleNodes: Record<string, string>
            ) {
                type StyleNode = {
                    nodeName: string;
                    fileName: string;
                    style: string;
                    extension: string;
                };
                function formatStyleNode(
                    styleNode: Record<string, string>,
                    getName: (path: string) => string
                ): StyleNode[] {
                    return _.keys(styleNode).map(item => {
                        const name = getName(item).split(".");
                        return {
                            fileName: name[0],
                            extension: name[1],
                            nodeName: item,
                            style: styleNodes[item]
                        };
                    });
                }

                function getName(path: string): string {
                    const matchVue = _(path)
                        .split("/")
                        .pop()
                        .split("?")
                        .shift();
                    const matchCss = _(path)
                        .split("/")
                        .pop();
                    return matchVue.endsWith(".vue")
                        ? matchVue.replace(".vue", ".css")
                        : matchCss;
                }

                formatStyleNode(styleNodes, getName).forEach(styleNode => {
                    let code: string;
                    if (
                        styleNode.extension === "scss" ||
                        styleNode.extension === "sass"
                    ) {
                        code = require("node-sass")
                            .renderSync(
                                Object.assign(
                                    {
                                        data: styleNode.style,
                                        includePaths: ["node_modules/"]
                                    },
                                    {}
                                )
                            )
                            .css.toString();
                    } else if (styleNode.extension === "css") {
                        code = styleNode.style;
                    } else {
                        throw new Error("没有配置该类型");
                    }
                    writeFileSync(
                        path.resolve(__dirname, "../", $outDir, "style"),
                        `${styleNode.fileName}.css`,
                        code
                    );
                });
                writeFileSync(
                    path.resolve(__dirname, "../", $outDir, "style"),
                    "index.css",
                    styles
                );
            },

            // Disable any style output or callbacks, import as string
            // output: false,

            // Determine if node process should be terminated on error (default: false)
            failOnError: true

            // Prefix global scss. Useful for variables and mixins.
            // prefix: `@import "./fonts.scss";`
        })

        // sassPlugin({
        //     output: "bundle.css"
        // })
    ],
    external: Object.keys($preSetExternal)
};

export default rollupConfig;
