self.addEventListener('push', (event) => {
  const data = event.data.json();
  const { title, body, screen } = data;

  const options = {
    body,
    icon: '/icon.png',
    data: { screen },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const { screen } = event.notification.data || {};

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          client.focus();
          if (screen) client.postMessage({ screen });
          return;
        }
      }
      if (clients.openWindow && screen) {
        clients.openWindow(`/?screen=${screen}`);
      }
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.screen) {
    console.log('Message received in service worker:', event.data);
  }
});