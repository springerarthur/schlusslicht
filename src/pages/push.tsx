import webPush from 'web-push';
import WebPushSubscriptionService from '../lib/WebPushSubscriptionService';

export async function getServerSideProps() {
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
      title: "Strenge dich an",
      body: "Deine Freunde haben neue Aktivitäten hochgeladen.",
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

    return { props: { title: 'OK' } }
  } catch (error) {
    console.error(error);
  }
}

export default function Push() {
  fetch("");

  return <div>Nachricht wurde versendet</div>;
}
