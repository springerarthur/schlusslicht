import { IActivity } from "garmin-connect/dist/garmin/types";
import IUser from "../lib/IUser";
import { SportTypeIds } from "../lib/GarminConstants";
import { ITeamResults } from "./ITeamResults";
import { Distances } from "./IDistances";

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
      team1Distances.swimDistance,
      team2Distances.swimDistance
    );
    const bikePercentage = this.calculatePercentage(
      team1Distances.bikeDistance,
      team2Distances.bikeDistance
    );
    const runPercentage = this.calculatePercentage(
      team1Distances.runDistance,
      team2Distances.runDistance
    );

    return {
      team1Distances: team1Distances,
      team1Score: team1Score,
      team1Wins: team1Score > team2Score,

      team2Distances: team2Distances,
      team2Score: team2Score,
      team2Wins: team1Score > team2Score,

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
    let sumDistance = 0;
    teamActivities
      .filter((activity) => activity.sportTypeId == sportTypeId)
      .forEach(function (activity) {
        sumDistance += activity.distance / 1000;
      });

    return sumDistance;
  }

  private calculatePercentage(team1Distance: number, team2Distance: number) {
    const totalDistance = team1Distance + team2Distance;
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
