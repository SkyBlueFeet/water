// /public/stylesheets/index.css
import path from "path";
console.log(
    /\r\public\/(?<path>.*?\.css)/.test("/public/stylesheets/index.css")
);

console.log(path.join("/public/stylesheets/index.css"));

console.log("/user/3pkrvb3w/message/".split("/"));
