import { User } from "../lib/User";
import { Distances } from "./Distances";

export type ChallengeResult = {
  rank: number;
  user: User;
  totalScore: number;
  swimScore: number;
  bikeScore: number;
  runScore: number;
  distances: Distances;
  totalTime: number;
};
