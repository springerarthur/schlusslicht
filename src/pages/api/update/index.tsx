import type { NextApiRequest, NextApiResponse } from "next";
import GarminConnectSync from "../../../lib/GarminConnectSync";
import ActivityService from "../../../lib/ActivityService";
import { IActivity } from "garmin-connect/dist/garmin/types";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const garminConnectSync = new GarminConnectSync();
  await garminConnectSync.importDataFromGarminConnect();

  const activityService = new ActivityService();

  const { userId } = request.query;
  let activities = await activityService.findActivities(
    -1,
    userId as string | undefined
  );

  // await new Promise((f) => setTimeout(f, 5000));

  response.status(200).json(JSON.parse(JSON.stringify(activities)));
}
