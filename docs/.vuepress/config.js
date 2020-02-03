const path = require("path");

module.exports = {
    base: `/docs/`,
    port: 8686,
    babelrc: true,
    title: "Hello VuePress",
    description: "Just playing around",
    navbar: true,
    head: [["link", { rel: "icon", href: "/logo.png" }]],
    dest: path.resolve(__dirname, "../../", "dist/docs"),
    themeConfig: {
        repo: "skybluefeet/mysite",
        editLinks: true,
        docsDir: "docs",
        nav: [
            { text: "Home", link: "/" },
            { text: "Guide", link: "/guide/" },
            { text: "External", link: "https://google.com" }
        ],
        sidebar: ["/", "/start", "/list-item"],
        lastUpdated: "上次更新时间",
        smoothScroll: true
    },
    plugins: [
        ["@vuepress/back-to-top", true],
        [
            "@vuepress/pwa",
            {
                serviceWorker: true,
                updatePopup: true
            }
        ],
        ["@vuepress/medium-zoom", true],
        [
            "@vuepress/google-analytics",
            {
                ga: "UA-128189152-1"
            }
        ],
        [
            "container",
            {
                type: "vue",
                before: '<pre class="vue-container"><code>',
                after: "</code></pre>"
            }
        ],
        [
            "container",
            {
                type: "upgrade",
                before: info => `<UpgradePath title="${info}">`,
                after: "</UpgradePath>"
            }
        ],
        ["flowchart"]
    ]
};
