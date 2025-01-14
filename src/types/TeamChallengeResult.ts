import { User } from "../lib/User";
import { Distances } from "./Distances";

export type TeamChallengeResult = {
  user: User;
  distances: Distances;
  totalTime: number;
};