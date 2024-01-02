import { IActivity } from "garmin-connect/dist/garmin/types";
import IUser from "../lib/IUser";
import { SportTypeIds } from "../lib/GarminConstants";
import { ITeamResults } from "./ITeamResults";
import { Distances } from "./Distances";

export default class TeamResultsCalculator {
  public getTeamResults(
    activities: IActivity[],
    team1: IUser[],
    team2: IUser[]
  ): ITeamResults {
    const team1Distances = this.calculateDistancesForTeam(activities, team1);
    const team2Distances = this.calculateDistancesForTeam(activities, team2);

    const team1Score = this.calculateScoreForTeam(
      team1Distances,
      team2Distances
    );
    const team2Score = this.calculateScoreForTeam(
      team2Distances,
      team1Distances
    );

    const swimPercentage = this.calculatePercentage(
      team1Distances.swimDistance.distance,
      team2Distances.swimDistance.distance
    );
    const bikePercentage = this.calculatePercentage(
      team1Distances.bikeDistance.distance,
      team2Distances.bikeDistance.distance
    );
    const runPercentage = this.calculatePercentage(
      team1Distances.runDistance.distance,
      team2Distances.runDistance.distance
    );

    return {
      team1Distances: team1Distances,
      team1Score: team1Score,
      team1Wins: team1Score > team2Score,

      team2Distances: team2Distances,
      team2Score: team2Score,
      team2Wins: team2Score > team1Score,

      swimPercentage: swimPercentage,
      bikePercentage: bikePercentage,
      runPercentage: runPercentage,
    };
  }

  private calculateDistancesForTeam(
    activities: IActivity[],
    team: IUser[]
  ): Distances {
    const teamActivities = this.getActivitiesForTeam(activities, team);

    const swimTotalDistance = this.sumTotalDistanceForSportType(
      teamActivities,
      SportTypeIds.swimming
    );
    const bikeTotalDistance = this.sumTotalDistanceForSportType(
      teamActivities,
      SportTypeIds.bike
    );
    const runTotalDistance = this.sumTotalDistanceForSportType(
      teamActivities,
      SportTypeIds.running
    );

    return new Distances(
      swimTotalDistance,
      bikeTotalDistance,
      runTotalDistance
    );
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

  private calculatePercentage(team1Distance: number, team2Distance: number) : number {
    const totalDistance = team1Distance + team2Distance;
    if (totalDistance == 0) {
      return 0;
    }

    return (team1Distance / totalDistance) * 100;
  }

  private calculateScoreForTeam(
    distances: Distances,
    otherTeamDistances: Distances
  ): number {
    let score = 0;

    if (distances.swimDistance > otherTeamDistances.swimDistance) {
      score++;
    }
    if (distances.bikeDistance > otherTeamDistances.bikeDistance) {
      score++;
    }
    if (distances.runDistance > otherTeamDistances.runDistance) {
      score++;
    }

    return score;
  }
}
