/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "b259d7eb8295c0018d15b13210a85bec"
  },
  {
    "url": "assets/css/0.styles.fc4dd9e9.css",
    "revision": "6202aa1b35f78b9e3c6d8c426659bfae"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/3.15f2416a.js",
    "revision": "77607349016f289c7dac2f875d444c02"
  },
  {
    "url": "assets/js/4.1fd67f97.js",
    "revision": "3ad9524631b4beb6f4197e064eaec3f3"
  },
  {
    "url": "assets/js/5.c53a0cae.js",
    "revision": "3161e712aaf383ad1d23089cd2f49952"
  },
  {
    "url": "assets/js/6.3c9db216.js",
    "revision": "c3eeff888bcd1e5fc27129baccde3c1e"
  },
  {
    "url": "assets/js/7.8d814202.js",
    "revision": "3f5aa9a81055204571ed1fff15564cfe"
  },
  {
    "url": "assets/js/8.1cf649f8.js",
    "revision": "2df081e1d04dbfde652214edad00a88b"
  },
  {
    "url": "assets/js/9.6bcad938.js",
    "revision": "f175859d48f7c8ceba83103bb67f0145"
  },
  {
    "url": "assets/js/app.631c0692.js",
    "revision": "c3ae928b58e67afedc0e8cd5719bb320"
  },
  {
    "url": "assets/js/vendors~flowchart.f822ccd8.js",
    "revision": "ed2531c039760704a264bd0ae3b16af2"
  },
  {
    "url": "index.html",
    "revision": "47572825371ff7fec07bca0818f1c0e4"
  },
  {
    "url": "start.html",
    "revision": "373d2aa93a88ba2f08e00c3212ae4122"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
