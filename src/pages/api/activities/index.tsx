import type { NextApiRequest, NextApiResponse } from "next";
import ActivityService from "../../../lib/ActivityService";
import { SportType } from "../../../lib/GarminConstants";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const activityService = new ActivityService();

  const { userId, sportType } = request.query;

  let sportTypeEnum: SportType | undefined = undefined;
  if (sportType) {
    const sportTypeNumber = Number(sportType);
    if (Object.values(SportType).includes(sportTypeNumber)) {
      return sportTypeNumber as SportType;
    }
  }

  const activities = await activityService.findActivities({
    page: 0,
    userId: userId as string | undefined,
    sportType: sportTypeEnum,
  });

  response.status(200).json(JSON.parse(JSON.stringify(activities)));
}
