import { User } from "../lib/User";
import { Distances } from "./Distances";

export type ChallengeResult = {
  user: User;
  distances: Distances;
  rank: number;
  totalScore: number;
  swimScore: number;
  swimRank: number;
  bikeScore: number;
  bikeRank: number;
  runScore: number;
  runRank: number;
  totalTime: number;
};
