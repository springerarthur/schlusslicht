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

  logToServer("pushManager.permissionState()");
  serviceWorker.pushManager
    .permissionState()
    .then((permission) => {
      logToServer(
        "pushManager.permissionState().then. permission = " + permission
      );
      if (permission === "granted") {
        logToServer("pushManager.permissionState().permission granted");
      } else if (permission === "prompt") {
        logToServer("pushManager.permissionState().permission promt");
        Notification.requestPermission().then((subscriptionState) => {
          if (subscriptionState === "granted") {
            logToServer("Push subscription permission granted by user");
          } else {
            logToServer("Push subscription permission denied by user");
          }
        });
      } else {
        logToServer("Push subscription permission denied or unavailable");
      }
    })
    .catch((error) => {
      logToServer("Error checking or requesting push permission: " + error);
    });

  logToServer("get subscription from push manager");
  serviceWorker.pushManager
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
