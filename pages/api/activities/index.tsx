import type { NextApiRequest, NextApiResponse } from "next";
import ActivityService from "../../../lib/ActivityService";
import GarminConnectSync from "../../../lib/GarminConnectSync";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const garminConnectSync = new GarminConnectSync();
  await garminConnectSync.importDataFromGarminConnect();

  const activityService = new ActivityService();
  const activities = await activityService.getActivities();

  //await new Promise((f) => setTimeout(f, 5000));

  response.status(200).json(JSON.parse(JSON.stringify(activities)));
}
