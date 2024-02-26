import WebPushSubscriptionService from "../../../lib/WebPushSubscriptionService";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== "POST") {
    response.status(405).json({});
    return;
  }

  try {
    const subscription: PushSubscription | undefined = await JSON.parse(request.body);
    if(subscription === undefined) {
      response.status(400).json({});
      return;
    }

    const webPushSubscriptionService = new WebPushSubscriptionService();
    webPushSubscriptionService.saveSubscription(
      subscription
    );

    response.status(200).json({});
  } catch (error) {
    console.error(error);
  }
}