import { IActivity } from "garmin-connect/dist/garmin/types";
import IUser from "../lib/IUser";
import { SportTypeIds } from "../lib/GarminConstants";
import { IDistances, ITeamScore } from "./ITeamScore";

export default class TeamScoreCalculator {
    private team1: IUser[];
    private team2: IUser[];

    constructor(team1: IUser[], team2: IUser[]) {
        this.team1 = team1;
        this.team2 = team2;
    }

    public getTeamScore(activities: IActivity[]): ITeamScore {
        const team1Distances = this.calculateDistancesForTeam(activities, this.team1);
        const team2Distances = this.calculateDistancesForTeam(activities, this.team2);

        const swimPercentage = this.calculatePercentage(team1Distances.swimDistance, team2Distances.swimDistance);
        const bikePercentage = this.calculatePercentage(team1Distances.bikeDistance, team2Distances.bikeDistance);
        const runPercentage = this.calculatePercentage(team1Distances.runDistance, team2Distances.runDistance);

        return {
            team1Score: this.calculateScoreForTeam(team1Distances, team2Distances),
            team2Score: this.calculateScoreForTeam(team2Distances, team1Distances),

            team1Distances: team1Distances,
            team2Distances: team2Distances,

            swimPercentage: swimPercentage,
            bikePercentage: bikePercentage,
            runPercentage: runPercentage
        };
    }

    private calculateDistancesForTeam(activities: IActivity[], team: IUser[]): IDistances {
        const teamActivities = this.getActivitiesForTeam(activities, team);

        const swimTotalDistance = this.sumTotalDistanceForSportType(teamActivities, SportTypeIds.swimming);
        const bikeTotalDistance = this.sumTotalDistanceForSportType(teamActivities, SportTypeIds.bike);
        const runTotalDistance = this.sumTotalDistanceForSportType(teamActivities, SportTypeIds.running);

        return {
            swimDistance: swimTotalDistance,
            bikeDistance: bikeTotalDistance,
            runDistance: runTotalDistance,
        };
    }

    private getActivitiesForTeam(activities: IActivity[], team: IUser[]): IActivity[] {
        return activities.filter(activity => team.some(user => user.garminUserId === activity.ownerDisplayName));
    }

    private sumTotalDistanceForSportType(teamActivities: IActivity[], sportTypeId: number): number {
        let sumDistance = 0;
        teamActivities.filter(activity => activity.sportTypeId == sportTypeId).forEach(function (activity) {
            sumDistance += (activity.distance / 1000);
        });

        return sumDistance;
    }

    private calculatePercentage(team1Distance: number, team2Distance: number) {
        const totalDistance = team1Distance + team2Distance;
        return team1Distance / totalDistance * 100;
    }

    private calculateScoreForTeam(distances: IDistances, otherTeamDistances: IDistances): number {
        let score = 0;

        if (distances.swimDistance > otherTeamDistances.swimDistance) { score++; }
        if (distances.bikeDistance > otherTeamDistances.bikeDistance) { score++; }
        if (distances.runDistance > otherTeamDistances.runDistance) { score++; }

        return score;
    }
}
