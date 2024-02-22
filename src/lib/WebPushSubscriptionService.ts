import webPush from "web-push";
import clientPromise from "./mongodb";

export default class WebPushSubscriptionService {
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


    let existingSubscriptionByEndpoint = (await mongoDbClient
      .db("schlusslicht")
      .collection<PushSubscription>("webpush-subscriptions")
      .findOne({ "endpoint": subscription.endpoint }))

      if(existingSubscriptionByEndpoint === null) {
        await mongoDbClient
          .db("schlusslicht")
          .collection<PushSubscription>("webpush-subscriptions")
          .insertOne(subscription);
      }
  }
}
