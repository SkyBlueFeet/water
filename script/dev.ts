process.env.NODE_ENV = "development";

import follow from "./follow";
import app from "./app";
follow(app);

const port = process.env.PORT || 8080;

app.listen(port);
