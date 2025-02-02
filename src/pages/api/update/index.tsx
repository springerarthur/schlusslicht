import type { NextApiRequest, NextApiResponse } from "next";
import GarminConnectSync from "../../../lib/GarminConnectSync";
import ActivityService from "../../../lib/ActivityService";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const garminConnectSync = new GarminConnectSync();
  await garminConnectSync.importDataFromGarminConnect();

  const activityService = new ActivityService();

  const { userId, startDate } = request.query;
  let activities = await activityService.findActivities({
    userId: userId as string | undefined,
    date: {
      startDate: new Date(startDate as string),
      endDate: new Date()
    }
  });

  // await new Promise((f) => setTimeout(f, 5000));

  response.status(200).json(JSON.parse(JSON.stringify(activities)));
}
