// Service worker eki (vite-plugin-pwa importScripts). Bildirimi gösterir, dokununca uygulamayı açar.
// Gönderen: supabase/functions/send-reminders; yük { title, body, path } (core/logic/reminders.ts).

self.addEventListener('push', (event) => {
  const msg = event.data ? event.data.json() : {};
  const scope = self.registration.scope;
  event.waitUntil(
    self.registration.showNotification(msg.title || 'Spor Günlüğü', {
      body: msg.body,
      icon: scope + 'icons/icon-192.png',
      badge: scope + 'icons/icon-192.png',
      tag: msg.kind || 'reminder',
      data: { url: scope + (msg.path || '') },
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data.url;
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((open) => {
      const win = open.find((c) => c.url.startsWith(self.registration.scope));
      if (win) return win.focus().then((w) => w.navigate(url));
      return self.clients.openWindow(url);
    }),
  );
});
