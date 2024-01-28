import { User } from "../lib/User";
import { Distances } from "./Distances";

export type ChallengeResult = {
  rank: number;
  user: User;
  totalScore: number;
  swimScore: number;
  swimRank: number;
  bikeScore: number;
  bikeRank: number;
  runScore: number;
  runRank: number;
  distances: Distances;
  totalTime: number;
};
