// T.C.R.C Service Worker
const CACHE_NAME = "tcrc-v1";
const OFFLINE_URLS = ["/", "/checkout", "/ranking"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(OFFLINE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match(event.request).then((r) => r || caches.match("/"))
      )
    );
  }
});

// 푸시 알림 수신
self.addEventListener("push", (event) => {
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch {
    data = { title: "T.C.R.C", body: event.data.text() };
  }

  const options = {
    body: data.body,
    icon: "/api/icons/192",
    badge: "/api/icons/192",
    tag: "tcrc-attendance",
    renotify: true,
    data: { url: data.url || "/" },
    actions: [{ action: "open", title: "앱 열기" }],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "T.C.R.C", options)
  );
});

// 알림 클릭 처리
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === url && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) return clients.openWindow(url);
      })
  );
});
