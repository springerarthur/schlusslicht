import { Distances } from "./Distances";

export interface ITeamResults {
  team1Score: number;
  team1Distances: Distances;

  team2Score: number;
  team2Distances: Distances;

  swimPercentage: number;
  bikePercentage: number;
  runPercentage: number;
}
