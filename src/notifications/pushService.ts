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
  const subscription = await serviceWorker.pushManager.subscribe({
    userVisibleOnly: true,
    // applicationServerKey: process.env.VAPID_PUBLIC_KEY,
    applicationServerKey:
      "BIcI67JnMKoBToBUDnlLITDlRQO3V2-alrfUFk5-cb2yhRlx5DJd2CnbOihkhf9atGAZRz0wFKdhrpji4WQpRy8",
  });
  await sendPushSubscriptionToServer(subscription);
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
  console.log("Sending push subscription to server", subscription);

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
  console.log("Deleting push subscription from server", subscription);

  const response = await fetch("/api/webpush/unsubscribe", {
    method: "DELETE",
    body: JSON.stringify(subscription),
  });

  if (!response.ok) {
    throw Error("Failed to delete push subscription from server");
  }
}
