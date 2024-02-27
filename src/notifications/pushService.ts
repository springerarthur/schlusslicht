import logToServer from "../utilities/logger";
import { getReadyServiceWorker } from "../utilities/serviceWorker";

export async function getCurrentPushSubscription(): Promise<PushSubscription | null> {
  const serviceWorker = await getReadyServiceWorker();
  return serviceWorker.pushManager.getSubscription();
}

export async function registerPushNotifications() {
  if (!("PushManager" in window)) {
    throw Error("Push notifications are not supported by this browser");
  }

  const existingSubscription = await getCurrentPushSubscription();
  if (existingSubscription) {
    throw Error("Existing push subscription found");
  }

  const serviceWorker = await getReadyServiceWorker();
  logToServer("get subscription from push manager");
  logToServer("serviceWorker.active: " + serviceWorker.active);
  logToServer("serviceWorker.installing: " + serviceWorker.installing);
  logToServer("serviceWorker.scope: " + serviceWorker.scope);

  const subscription = await serviceWorker.pushManager
    .subscribe({
      userVisibleOnly: true,
      // applicationServerKey: process.env.VAPID_PUBLIC_KEY,
      applicationServerKey:
        "BIcI67JnMKoBToBUDnlLITDlRQO3V2-alrfUFk5-cb2yhRlx5DJd2CnbOihkhf9atGAZRz0wFKdhrpji4WQpRy8",
    })
    .then((subscription) => {
      logToServer("successfully got subscription from push manager");
      sendPushSubscriptionToServer(subscription);
    })
    .catch((error) => {
      logToServer("error on get subscription: " + error);
    })
    .finally(() => {
      logToServer("finally got subscription from push manager");
    });
}

export async function unregisterPushNotifications() {
  const existingSubscription = await getCurrentPushSubscription();
  if (!existingSubscription) {
    throw Error("No existing push subscription found");
  }

  await deletePushSubscriptionFromServer(existingSubscription);

  await existingSubscription.unsubscribe();
}

export async function sendPushSubscriptionToServer(
  subscription: PushSubscription
) {
  const response = await fetch("/api/webpush/subscribe", {
    method: "POST",
    body: JSON.stringify(subscription),
  });

  if (!response.ok) {
    throw Error("Failed to send push subscription to server");
  }
}

export async function deletePushSubscriptionFromServer(
  subscription: PushSubscription
) {
  const response = await fetch("/api/webpush/unsubscribe", {
    method: "DELETE",
    body: JSON.stringify(subscription),
  });

  if (!response.ok) {
    throw Error("Failed to delete push subscription from server");
  }
}
