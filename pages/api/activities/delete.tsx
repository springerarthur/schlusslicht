import { NextApiRequest, NextApiResponse } from "next";
import ActivityService from "../../../lib/ActivityService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    res.status(405).json({});
  }

  const { id } = req.body;

  const activityService = new ActivityService();
  const updatedActivities = await activityService.deleteActivity(id);

  res.status(200).json(JSON.parse(JSON.stringify(updatedActivities)));
}
