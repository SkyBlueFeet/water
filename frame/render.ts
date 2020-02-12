import { Express } from "express";
import fs from "fs";
import {
    createBundleRenderer,
    BundleRenderer,
    BundleRendererOptions
} from "vue-server-renderer";
import LRU from "lru-cache";
import path from "path";
const setupServer = require("../frame/build/setup-dev-server");

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

const bundle = require("../dist/vue-ssr-server-bundle.json");
const clientManifest = require("../dist/vue-ssr-client-manifest.json");

const templatePath = path.resolve(__dirname, "./src/index.template.html");

const template = fs.readFileSync(templatePath, "utf-8");

function render(): BundleRenderer;
function render(app?: Express): Promise<BundleRenderer>;
function render(app?: Express): Promise<BundleRenderer> | BundleRenderer {
    let renderer: Promise<BundleRenderer> | BundleRenderer;
    if (app === undefined) {
        renderer = createRenderer(bundle, {
            template,
            clientManifest
        });
    } else {
        renderer = setupServer(
            app,
            templatePath,
            (bundle: string | object, options: BundleRendererOptions) => {
                return createRenderer(bundle, options);
            }
        );
    }

    return renderer;
}

export default render;
