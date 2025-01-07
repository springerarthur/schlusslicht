import type { NextApiRequest, NextApiResponse } from "next";
import ChallengeProgressService from "../../lib/ChallengeProgressService";
import { Team1, Team2 } from "../../datastore/Teams";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const progressService = new ChallengeProgressService();
    const teamProgress = await progressService.getAllTeamsProgress({
      "Winning Lions": Team1,
      "Moody Students": Team2,
    });

    return res.status(200).json(teamProgress);
  } catch (err: any) {
    console.error("[API] teamprogress error:", err);
    return res.status(500).json({ error: err.message });
  }
}
