import type { NextApiRequest, NextApiResponse } from "next";
import ActivityService from "../../../lib/ActivityService";
import { SportType } from "../../../lib/GarminConstants";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const activityService = new ActivityService();

  const { userId, sportType, startDate, endDate } = request.query;

  let sportTypeEnum: SportType | undefined = undefined;
  if (sportType) {
    const sportTypeNumber = Number(sportType);
    if (Object.values(SportType).includes(sportTypeNumber)) {
      return sportTypeNumber as SportType;
    }
  }

  console.log("api-activities=" + startDate);
  console.log("api-activities as string=" + startDate as string);
  console.log("api-activities as date=" + new Date(startDate as string));

  const activities = await activityService.findActivities({
    page: 0,
    userId: userId as string | undefined,
    sportType: sportTypeEnum,
    date: {
      startDate: new Date(startDate as string),
      endDate: new Date(endDate as string),
    },
  });

  response.status(200).json(JSON.parse(JSON.stringify(activities)));
}
