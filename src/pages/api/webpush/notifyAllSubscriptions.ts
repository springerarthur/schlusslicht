import webPush from "web-push";
import WebPushSubscriptionService from "../../../lib/WebPushSubscriptionService";

export default async function handler() {
  try {
    if (
      process.env.VAPID_PUBLIC_KEY === undefined ||
      process.env.VAPID_PRIVATE_KEY === undefined
    ) {
      return;
    }

    webPush.setVapidDetails(
      "https://schlusslicht.vercel.app",
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );

    const webPushSubscriptionService = new WebPushSubscriptionService();
    const subscriptions =
      await webPushSubscriptionService.getAllSubscriptions();

    const notificationPayload = JSON.stringify({
      title: "Titel der Benachrichtigung",
      body: "Inhalt der Benachrichtigung",
      icon: "/favicon_io/android-chrome-192x192.png",
    });

    const sendNotificationsPromises = subscriptions.map((subscription) =>
      webPush
        .sendNotification(subscription, notificationPayload)
        .catch((error) => {
          console.error("Fehler beim Senden der Benachrichtigung:", error);
          // Optional: Behandle fehlgeschlagene Subscription
        })
    );

    await Promise.all(sendNotificationsPromises);
  } catch (error) {}
}
