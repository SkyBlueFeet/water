process.env.NODE_ENV = "development";

import setRouter from "../router/ssr";
import setRender from "../frame/render";

import app from "./app";

app.use("/app", setRouter(setRender(app)));

const port = process.env.PORT || 8080;

app.listen(port);
