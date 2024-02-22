// @ts-check

/// <reference no-default-lib="true"/>
/// <reference lib="esnext"/>
/// <reference lib="webworker"/>

const serviceWorker =
  /** @type {ServiceWorkerGlobalScope & typeof globalThis} */ (globalThis);

serviceWorker.addEventListener("push", (event) => {
  const message = event.data?.json();
  const { title, body, icon } = message;

  console.log("Push received. Data: " + message);

  async function handlePushEvent() {
    const windowClients = await serviceWorker.clients.matchAll({
      type: "window",
    });

    if (windowClients.length > 0) {
      const appInForeground = windowClients.some((client) => client.focused);

      if (appInForeground) {
        console.log("App is in foreground. Don't show notification");
      }

      await serviceWorker.registration.showNotification(title, {
        body,
        icon,
      });
    }
  }

  event.waitUntil(handlePushEvent());

  // const data = event.data.json();
  // self.registration.showNotification(data, {
  //   body: data,
  //   icon: "favicon-32x32.png",
  // });
});
