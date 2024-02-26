import WebPushSubscriptionService from "../../../lib/WebPushSubscriptionService";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const webPushSubscriptionService = new WebPushSubscriptionService();
    webPushSubscriptionService.notifyAllSubscriber();

    response.status(200).json({});
  } catch (error) {
    console.error(error);
  }
}
