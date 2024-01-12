import type { NextApiRequest, NextApiResponse } from 'next';
import GarminConnectSync from '../../../lib/GarminConnectSync';
import ActivityService from '../../../lib/ActivityService';
import { IActivity } from 'garmin-connect/dist/garmin/types';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const garminConnectSync = new GarminConnectSync();
  await garminConnectSync.importDataFromGarminConnect();

  const activityService = new ActivityService();

  const { userId } = request.query;
  let activities: IActivity[];
  if (userId !== undefined) {
    activities = await activityService.getActivitiesForUser(userId.toString());
  } else {
    activities = await activityService.getActivities();
  }

  // await new Promise((f) => setTimeout(f, 5000));

  response.status(200).json(JSON.parse(JSON.stringify(activities)));
}
