import { Router } from "express";
import { BundleRenderer } from "vue-server-renderer";

export default function(
    ready: Promise<BundleRenderer> | BundleRenderer
): Router {
    const router = Router();
    router.get(
        "*",
        async (req, res): Promise<void> => {
            const bundleRenderer = await ready;
            console.log(req.params[0]);
            res.setHeader("Content-Type", "text/html");

            const handleError = (err: any): void => {
                if (err.url) {
                    res.redirect(err.url);
                } else if (err.code === 404) {
                    res.status(404).send("404 | Page Not Found");
                } else {
                    res.status(500).send("500 | Internal Server Error");
                }
            };

            const context = {
                url: req.url,
                title: "Hello World"
            };

            bundleRenderer.renderToString(context, (err, html: string) => {
                if (err) return handleError(err);
                res.send(html);
            });
        }
    );
    return router;
}
