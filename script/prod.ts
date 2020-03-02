process.env.NODE_ENV = "production";

// import setRouter from "../router/ssr";
// import setRender from "../frame/render";
import follow from "./follow";
import app from "./app";

// app.use("/app", setRouter(setRender(app)));

follow(app);

const port = process.env.PORT || 3000;

app.listen(port);
