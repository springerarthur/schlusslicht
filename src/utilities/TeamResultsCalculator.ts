import { IActivity } from "garmin-connect/dist/garmin/types";
import { User } from "../lib/User";
import { SportType } from "../lib/GarminConstants";
import { TeamResults } from "../types/TeamResults";
import { Distances } from "../types/Distances";

export function getTeamResults(
  activities: IActivity[],
  team1: User[],
  team2: User[]
): TeamResults {
  return {
    team1Distances: calculateDistancesForTeam(activities, team1),
    team1TotalTime: calculateTotalTimeForTeam(activities, team1),

    team2Distances: calculateDistancesForTeam(activities, team2),
    team2TotalTime: calculateTotalTimeForTeam(activities, team2),
  };
}

export function calculateTotalTimeForTeam(
  activities: IActivity[],
  team: User[]
): number {
  const teamActivities = getActivitiesForTeam(activities, team);

  return teamActivities
    .map((activity) => activity.movingDuration ?? activity.duration)
    .reduce((sum, duration) => sum + duration, 0);
}

function calculateDistancesForTeam(
  activities: IActivity[],
  team: User[]
): Distances {
  const teamActivities = getActivitiesForTeam(activities, team);

  const swimDistance = sumTotalDistanceForSportType(
    teamActivities,
    SportType.SWIMMING
  );
  const bikeDistance = sumTotalDistanceForSportType(
    teamActivities,
    SportType.BIKE
  );
  const runDistance = sumTotalDistanceForSportType(
    teamActivities,
    SportType.RUNNING
  );

  return {
    swimDistance: swimDistance,
    bikeDistance: bikeDistance,
    runDistance: runDistance,
  };
}

function getActivitiesForTeam(
  activities: IActivity[],
  team: User[]
): IActivity[] {
  return activities.filter((activity) =>
    team.some((user) => user.garminUserId === activity.ownerDisplayName)
  );
}

function sumTotalDistanceForSportType(
  teamActivities: IActivity[],
  sportTypeId: number
): number {
  return teamActivities
    .filter((activity) => activity.sportTypeId === sportTypeId)
    .map((activity) => activity.distance)
    .reduce((sum, distance) => sum + distance, 0);
}
