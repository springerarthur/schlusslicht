import { IDistances } from "./IDistances";

export interface IScores {
  team1Score: number;
  team1Distances: IDistances;

  team2Score: number;
  team2Distances: IDistances;

  swimPercentage: number;
  bikePercentage: number;
  runPercentage: number;
}


