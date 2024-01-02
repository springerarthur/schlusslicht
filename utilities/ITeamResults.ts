import { Distances } from "./IDistances";

export interface ITeamResults {
  team1Score: number;
  team1Distances: Distances;
  team1Wins: boolean;

  team2Score: number;
  team2Distances: Distances;
  team2Wins: boolean;

  swimPercentage: number;
  bikePercentage: number;
  runPercentage: number;
}
