// 王大师的三枚铜钱 - Service Worker
const CACHE_NAME = 'sancai-tongqian-v1';
const urlsToCache = [
  '/wjc-app/',
  '/wjc-app/index.html',
  '/wjc-app/manifest.json'
  // 如果有独立的 CSS 或 JS 文件，也请添加进来
];

// 安装事件：缓存核心文件
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// 激活事件：清理旧版本缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 拦截请求：优先使用缓存，提升加载速度
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 命中缓存则返回缓存，否则发起网络请求
        return response || fetch(event.request);
      })
  );
});