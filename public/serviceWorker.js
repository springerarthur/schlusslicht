// @ts-check

/// <reference no-default-lib="true"/>
/// <reference lib="esnext"/>
/// <reference lib="webworker"/>

const serviceWorker =
  /** @type {ServiceWorkerGlobalScope & typeof globalThis} */ (globalThis);

serviceWorker.addEventListener("push", (event) => {
  const message = event.data?.json();
  const { title, body, icon } = message;

  async function handlePushEvent() {
    const windowClients = await serviceWorker.clients.matchAll({
      type: "window",
    });

    if (windowClients.length > 0) {
      const appInForeground = windowClients.some((client) => client.focused);

      if (appInForeground) {
        console.log("App is in foreground. Don't show notification");
        return;
      }

      await serviceWorker.registration.showNotification(title, {
        body,
        icon,
      });
    }
  }

  event.waitUntil(handlePushEvent());
});

serviceWorker.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const urlToOpen = "https://schlusslicht.vercel.app/";

  async function openPage() {
    const windowClients = await serviceWorker.clients.matchAll({
      type: "window",
    });

    for (var i = 0; i < windowClients.length; i++) {
      var client = windowClients[i];
      if (client.focused && client.url === urlToOpen) {
        return client.focus();
      }
    }

    if (serviceWorker.clients.openWindow) {
      return serviceWorker.clients.openWindow(urlToOpen);
    }
  }

  event.waitUntil(openPage());
});
