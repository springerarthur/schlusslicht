import { IActivity } from "garmin-connect/dist/garmin/types";
import IUser from "../lib/IUser";
import { SportTypeIds } from "../lib/GarminConstants";
import { ITeamResults } from "./ITeamResults";
import { Distances } from "./Distances";
import { Distance } from "./Distance";

export default class TeamResultsCalculator {
  public getTeamResults(
    activities: IActivity[],
    team1: IUser[],
    team2: IUser[]
  ): ITeamResults {
    return {
      team1Distances: this.calculateDistancesForTeam(activities, team1),
      team2Distances: this.calculateDistancesForTeam(activities, team2),
    };
  }

  private calculateDistancesForTeam(
    activities: IActivity[],
    team: IUser[]
  ): Distances {
    const teamActivities = this.getActivitiesForTeam(activities, team);

    const swimDistance = this.sumTotalDistanceForSportType(
      teamActivities,
      SportTypeIds.swimming
    );
    const bikeDistance = this.sumTotalDistanceForSportType(
      teamActivities,
      SportTypeIds.bike
    );
    const runDistance = this.sumTotalDistanceForSportType(
      teamActivities,
      SportTypeIds.running
    );

    return {
      swimDistance: new Distance(swimDistance),
      bikeDistance: new Distance(bikeDistance),
      runDistance: new Distance(runDistance)
    };
  }

  private getActivitiesForTeam(
    activities: IActivity[],
    team: IUser[]
  ): IActivity[] {
    return activities.filter((activity) =>
      team.some((user) => user.garminUserId === activity.ownerDisplayName)
    );
  }

  private sumTotalDistanceForSportType(
    teamActivities: IActivity[],
    sportTypeId: number
  ): number {
    return teamActivities
      .filter((activity) => activity.sportTypeId === sportTypeId)
      .map((activity) => activity.distance / 1000)
      .reduce((sum, distance) => sum + distance, 0);
  }
}
