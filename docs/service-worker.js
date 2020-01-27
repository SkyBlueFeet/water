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
    "revision": "9ecfcd8bcb21fda39189d466917b85e5"
  },
  {
    "url": "assets/css/0.styles.f7c9c548.css",
    "revision": "5ccdb1d6bbb5fbca680ba6d38a4cc0b5"
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
    "url": "assets/js/app.cfccea91.js",
    "revision": "deb36b3e99a84ccfe173d82dedccb57e"
  },
  {
    "url": "assets/js/vendors~flowchart.f822ccd8.js",
    "revision": "ed2531c039760704a264bd0ae3b16af2"
  },
  {
    "url": "index.html",
    "revision": "5f6e7588d6520713d41d176e174f78c9"
  },
  {
    "url": "start.html",
    "revision": "8ab413f0ae7e3b80cb42d5e2a11e6b46"
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
