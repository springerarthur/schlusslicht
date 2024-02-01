import type { NextApiRequest, NextApiResponse } from "next";
import GarminConnectSync from "../../../lib/GarminConnectSync";
import ActivityService from "../../../lib/ActivityService";
import { Users } from "../../../datastore/Users";
import { calculateChallengeResults } from "../../../utilities/ResultsCalculator";
import ChallengeResultService from "../../../lib/ChallengeResultService";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const garminConnectSync = new GarminConnectSync();
  // await garminConnectSync.importDataFromGarminConnect();

  //await new Promise((f) => setTimeout(f, 5000));

  const startDate = new Date(2024, 1, 1);
  const endDate = new Date(2024, 8, 30);

  const activityService = new ActivityService();
  const activities = await activityService.findActivities({
    date: { startDate: startDate, endDate: endDate },
  });
  const challengeResults = await calculateChallengeResults(activities, Users);

  const challengeResultService = new ChallengeResultService();
  // challengeResultService.createChallengeResultSnapshot(challengeResults);

  response.status(200).json(JSON.parse(JSON.stringify(challengeResults)));
}
