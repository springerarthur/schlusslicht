import { IActivity } from "garmin-connect/dist/garmin/types";
import { User } from "../lib/User";
import { SportType } from "../lib/GarminConstants";
import { ITeamResults } from "./ITeamResults";
import { Distances } from "./Distances";
import { Distance } from "./Distance";

export default class TeamResultsCalculator {
  public getTeamResults(
    activities: IActivity[],
    team1: User[],
    team2: User[]
  ): ITeamResults {
    return {
      team1Distances: this.calculateDistancesForTeam(activities, team1),
      team1TotalTime: this.calculateTotalTimeForTeam(activities, team1),

      team2Distances: this.calculateDistancesForTeam(activities, team2),
      team2TotalTime: this.calculateTotalTimeForTeam(activities, team2),
    };
  }

  private calculateDistancesForTeam(
    activities: IActivity[],
    team: User[]
  ): Distances {
    const teamActivities = this.getActivitiesForTeam(activities, team);

    const swimDistance = this.sumTotalDistanceForSportType(
      teamActivities,
      SportType.SWIMMING
    );
    const bikeDistance = this.sumTotalDistanceForSportType(
      teamActivities,
      SportType.BIKE
    );
    const runDistance = this.sumTotalDistanceForSportType(
      teamActivities,
      SportType.RUNNING
    );

    return {
      swimDistance: new Distance(swimDistance),
      bikeDistance: new Distance(bikeDistance),
      runDistance: new Distance(runDistance),
    };
  }

  calculateTotalTimeForTeam(activities: IActivity[], team: User[]): number {
    const teamActivities = this.getActivitiesForTeam(activities, team);

    return teamActivities
      .map((activity) => activity.duration)
      .reduce((sum, duration) => sum + duration, 0);
  }

  private getActivitiesForTeam(
    activities: IActivity[],
    team: User[]
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
