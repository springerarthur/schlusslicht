import type { NextApiRequest, NextApiResponse } from "next";
import ActivityService, {
  FindActivitiesOptions,
} from "../../../lib/ActivityService";
import { SportType } from "../../../lib/GarminConstants";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const activityService = new ActivityService();

  const { page, userId, sportType, startDate, endDate } = request.query;

  let sportTypeEnum: SportType | undefined = undefined;
  if (sportType) {
    const sportTypeNumber = Number(sportType);
    if (Object.values(SportType).includes(sportTypeNumber)) {
      return sportTypeNumber as SportType;
    }
  }

  let dateFilter =
    startDate !== undefined && endDate !== undefined
      ? {
          startDate: new Date(startDate as string),
          endDate: new Date(endDate as string),
        }
      : undefined;

  const activities = await activityService.findActivities({
    page: convertParameterToNumber(page),
    userId: userId as string | undefined,
    sportType: sportTypeEnum,
    date: dateFilter,
  });

  response.status(200).json(JSON.parse(JSON.stringify(activities)));
}

function convertParameterToNumber(
  value: string | string[] | undefined
): number | undefined {
  if (value === undefined) {
    return undefined;
  } else if (typeof value === "string") {
    // If it's a string, try to parse it as a number
    const parsedValue = parseFloat(value);
    // Check if the parsing was successful
    if (!isNaN(parsedValue)) {
      return parsedValue;
    } else {
      // Handle the case where the string couldn't be parsed as a number
      console.error("Failed to parse string as number:", value);
      return undefined;
    }
  } else if (Array.isArray(value)) {
    // Handle the case where it's an array (if needed)
    console.error(
      "Array type is not supported for conversion to number:",
      value
    );
    return undefined;
  } else {
    // Handle any other unexpected types
    console.error("Unsupported type for conversion to number:", typeof value);
    return undefined;
  }
}
