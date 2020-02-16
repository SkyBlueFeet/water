import consola from "consola";
const { Nuxt, Builder } = require("nuxt");
import app from "./app";
import follow from "./follow";

// Import and Set Nuxt.js options
import config from "../nuxt.config";
config.dev = true;

async function start(): Promise<void> {
    // Init Nuxt.js
    const nuxt = new Nuxt(config);

    const { host, port } = nuxt.options.server;

    await nuxt.ready();
    nuxt.renderRoute("/nuxt");
    // Build only in dev mode
    if (config.dev) {
        const builder = new Builder(nuxt);
        await builder.build();
    }

    // Give nuxt middleware to express
    app.use(nuxt.render);
    follow(app);

    // Listen the server
    app.listen(port, host);
    consola.ready({
        message: `Server listening on http://${host}:${port}`,
        badge: true
    });
}
start();
