import WebPushSubscriptionService from "../../../lib/WebPushSubscriptionService";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  console.log("subscribe start");
  if (request.method !== "POST") {
    response.status(405).json({});
    return;
  }

  console.log("subscribe POST");
  try {
    const subscription: PushSubscription | undefined = await JSON.parse(request.body);
    if(subscription === undefined) {
      response.status(400).json({});
      return;
    }
    console.log("subscription: " + JSON.stringify(subscription));

    const webPushSubscriptionService = new WebPushSubscriptionService();
    webPushSubscriptionService.saveSubscription(
      subscription
    );
    console.log("subscription saved");

    response.status(200).json({});
  } catch (error) {
    console.error(error);
  }
}
