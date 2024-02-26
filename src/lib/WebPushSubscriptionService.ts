import webPush from "web-push";
import clientPromise from "./mongodb";

export default class WebPushSubscriptionService {
  public async notifyAllSubscriber() {
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

      const subscriptions = await this.getAllSubscriptions();

      const notificationPayload = JSON.stringify({
        title: "Strenge dich an",
        body: "Deine Freunde haben neue Aktivitäten hochgeladen.",
        icon: "/logo_192x192.png",
      });

      const sendNotificationsPromises = subscriptions.map((subscription) =>
        webPush
          .sendNotification(subscription, notificationPayload)
          .catch((error) => {
            console.error("Fehler beim Senden der Benachrichtigung:", error);
            this.deleteSubscriptionsByEndpoint(subscription.endpoint);
          })
      );

      await Promise.all(sendNotificationsPromises);
    } catch (error) {
      console.error(error);
    }
  }

  public async getAllSubscriptions(): Promise<webPush.PushSubscription[]> {
    const mongoDbClient = await clientPromise;

    return await mongoDbClient
      .db("schlusslicht")
      .collection<webPush.PushSubscription>("webpush-subscriptions")
      .find()
      .toArray();
  }

  public async saveSubscription(subscription: PushSubscription) {
    const mongoDbClient = await clientPromise;

    let existingSubscriptionByEndpoint = await mongoDbClient
      .db("schlusslicht")
      .collection<PushSubscription>("webpush-subscriptions")
      .findOne({ endpoint: subscription.endpoint });

    if (existingSubscriptionByEndpoint === null) {
      await mongoDbClient
        .db("schlusslicht")
        .collection<PushSubscription>("webpush-subscriptions")
        .insertOne(subscription);
    }
  }

  public async deleteSubscriptionsByEndpoint(endpoint: string) {
    const mongoDbClient = await clientPromise;

    let existingSubscriptionByEndpoint = await mongoDbClient
      .db("schlusslicht")
      .collection<PushSubscription>("webpush-subscriptions")
      .deleteMany({ endpoint: endpoint });
  }
}
