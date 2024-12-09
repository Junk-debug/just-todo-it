self.addEventListener('activate', async function () {
  console.log('activated');
});

self.addEventListener('push', function (event) {
  if (event.data) {
    const data = event.data.json();
    console.log('Push event!! ', data);
    const options = {
      body: data.body,
      icon: data.icon || '/favicon.svg',
      badge: '/badge.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '2',
      },
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

self.addEventListener('notificationclick', function (event) {
  console.log('Notification click received.');
  event.notification.close();
  event.waitUntil(
    clients.openWindow('https://next-todo-app-three-alpha.vercel.app'),
  );
});
