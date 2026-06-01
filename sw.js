/* ══════════════════════════════════════════════════════════
   여행 가이드 — Service Worker
   목표: 오프라인에서도 앱 셸 + trip.json 이 열린다.
   전략:
     - 앱 셸(html/manifest/icon): 설치 시 precache, 요청 시 cache-first
     - data/trip.json: network-first → 실패 시 cache (오프라인 폴백)
     - 폰트 CDN(jsdelivr/google): runtime cache-first (한 번 보면 오프라인 OK)
     - 날씨/지도/유튜브 API: 캐시하지 않음(네트워크), 오프라인이면 자연 실패
   ══════════════════════════════════════════════════════════ */
const VERSION = 'v1';
const SHELL_CACHE = 'trip-guide-shell-' + VERSION;
const DATA_CACHE = 'trip-guide-data-' + VERSION;
const RUNTIME_CACHE = 'trip-guide-runtime-' + VERSION;

const SHELL_ASSETS = ['./', './index.html', './manifest.json', './icon.svg'];

// 캐시하지 않을(항상 네트워크) 외부 호스트
const NETWORK_ONLY = ['open-meteo.com', 'youtube.com', 'youtu.be', 'ytimg.com', 'google.com/maps', 'maps.google'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then((c) => c.addAll(SHELL_ASSETS).catch(() => {}))   // 일부 실패해도 설치 진행
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((k) => ![SHELL_CACHE, DATA_CACHE, RUNTIME_CACHE].includes(k)).map((k) => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

function isNetworkOnly(url) {
  return NETWORK_ONLY.some((h) => url.includes(h));
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = req.url;
  if (isNetworkOnly(url)) return;   // 기본 처리(네트워크). 오프라인이면 브라우저가 자연 실패.

  const sameOrigin = url.startsWith(self.location.origin);

  // 1) trip.json — network-first, 폴백 cache
  if (sameOrigin && url.includes('/data/trip.json')) {
    event.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(DATA_CACHE).then((c) => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }

  // 2) 내비게이션(주소창/새로고침) — 앱 셸 우선
  if (req.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html').then((cached) => cached || fetch(req).catch(() => caches.match('./')))
    );
    return;
  }

  // 3) 동일 출처 정적 — cache-first, 없으면 네트워크 후 캐시
  if (sameOrigin) {
    event.respondWith(
      caches.match(req).then((cached) => cached || fetch(req).then((res) => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(SHELL_CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => cached))
    );
    return;
  }

  // 4) 외부 CDN(폰트 등) — cache-first 런타임 캐시
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).then((res) => {
      if (res && (res.status === 200 || res.type === 'opaque')) {
        const copy = res.clone();
        caches.open(RUNTIME_CACHE).then((c) => c.put(req, copy));
      }
      return res;
    }).catch(() => cached))
  );
});
