import { Express } from "express";
import fs from "fs";
import {
    createBundleRenderer,
    BundleRenderer,
    BundleRendererOptions
} from "vue-server-renderer";
import LRU from "lru-cache";
import global from "../global";
import setupServer from "./setup-dev-server";

function createRenderer(
    bundle: string | object,
    options: BundleRendererOptions
): BundleRenderer {
    try {
        return createBundleRenderer(
            bundle,
            Object.assign(options, {
                cache: new LRU({
                    max: 1000,
                    maxAge: 1000 * 60 * 15
                }),
                runInNewContext: false
            })
        );
    } catch (error) {
        console.log(error);
    }
}

const template = fs.readFileSync(global.template, "utf-8");

function render(): BundleRenderer;
function render(app?: Express): Promise<BundleRenderer>;
function render(app?: Express): Promise<BundleRenderer> | BundleRenderer {
    let renderer: Promise<BundleRenderer> | BundleRenderer;
    if (app === undefined) {
        const bundle = require(`${global.prod.outputPath}/vue-ssr-server-bundle.json`);
        const clientManifest = require(`${global.prod.outputPath}/vue-ssr-client-manifest.json`);

        renderer = createRenderer(bundle, {
            template,
            clientManifest
        });
    } else {
        renderer = setupServer(
            app,
            global.template,
            (bundle: string | object, options: BundleRendererOptions) =>
                createRenderer(bundle, options)
        );
    }

    return renderer;
}

export default render;
