import postcssrc = require("../.postcssrc.js");

const plugins = postcssrc.plugins;

const arrPlugins = [];

if (typeof plugins === "object") {
    Object.keys(plugins).forEach(key => {
        arrPlugins.push(require(key)(plugins[key]));
    });
}

export default {
    plugins: arrPlugins
};
