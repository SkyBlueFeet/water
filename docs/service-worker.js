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
    "revision": "aa739b18538707cb503ea780d3b18f6d"
  },
  {
    "url": "assets/css/0.styles.fe97649b.css",
    "revision": "bc4c365a04e7c167b7c0bfb15fcd0cd2"
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
    "url": "assets/js/7.fef7f5a7.js",
    "revision": "964320c19f459ee284d9cd5775faf1b5"
  },
  {
    "url": "assets/js/8.963e756d.js",
    "revision": "3dd2bc1900cdae0f4ec366b9d34a8582"
  },
  {
    "url": "assets/js/9.6bcad938.js",
    "revision": "f175859d48f7c8ceba83103bb67f0145"
  },
  {
    "url": "assets/js/app.4814e3ba.js",
    "revision": "f01d5f607e854e4ddd03462207e92b14"
  },
  {
    "url": "assets/js/vendors~flowchart.f822ccd8.js",
    "revision": "ed2531c039760704a264bd0ae3b16af2"
  },
  {
    "url": "index.html",
    "revision": "78c9305b473b7a947ac1899431970a0d"
  },
  {
    "url": "start.html",
    "revision": "00ff95d2625fd08fcb693d7b41673ef9"
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
