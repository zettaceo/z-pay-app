/**
 *  //|  .------------. //  .------------. //  .------------. //  .------------. //'
 *  //| |  ________   | //  |   ______   | //  |     __     | //  |   ___  __  | //'
 *  //| | |  ____  |  | //  |  |  __  |  | //  |    /  \    | //  |  |   \/  | | //'
 *  //| | | |__/ /  | | //  |  | |__| |  | //  |   / /\ \   | //  |  |       | | //'
 *  //| | |  __  \  | | //  |  |  ____/  | //  |  / ____ \  | //  |  |  |\/|  | | //'
 *  //| | | |  \  \ | | //  |  | |       | //  | / /    \ \ | //  |  |  |  |  | | //'
 *  //| | |_|   \__|| | //  |  |_|       | //  ||_/      \_|| //  |  |__|  |__| | //'
 *  //| |            | //  |             | //  |             | //  |              | //'
 *  //| '------------' //  '-------------' //  '-------------' //  '--------------' //'
 *  //'----------------'  '-----------------'  '-----------------'  '----------------'
 *
 *  Z-PAY Service Worker · PWA Offline Shell
 *  Cache: Static (Cache-First) · API (Network-Only) · Financial data never cached
 *
 *  SPDX-License-Identifier: UNLICENSED
 *  © 2026 ZETTA WORLD · All rights reserved
 */

const CACHE_NAME = 'zpay-v2.5.0';
const SHELL = ['/', '/index.html', '/style.css', '/app.js', '/i18n.js', '/zpay-logo.png', '/zion_zpay.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Network first for API calls (always fresh for financial data)
  if (e.request.url.includes('/api/')) return;
  // Cache first for static assets
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => {
    if (res.status === 200 && e.request.url.startsWith(self.location.origin)) {
      const clone = res.clone();
      caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
    }
    return res;
  }).catch(() => caches.match('/index.html'))));
});
