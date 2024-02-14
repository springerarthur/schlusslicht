import { IActivity } from "garmin-connect/dist/garmin/types";
import { User } from "../lib/User";
import { ChallengeResult } from "../types/ChallengeResult";
import { Distances } from "../types/Distances";
import { SportType } from "../lib/GarminConstants";

export async function calculateChallengeResults(
  activities: IActivity[],
  users: User[]
): Promise<ChallengeResult[]> {
  let challengeResults: ChallengeResult[] = [];

  for (let user of users) {
    const activitesFoUser = getActivitiesForUser(activities, user);
    const distances = sumDistances(activitesFoUser);

    challengeResults.push({
      rank: 0,
      user: user,
      distances: distances,
      totalTime: sumTotalTime(activitesFoUser),
      totalScore: 0,
      swimScore: 0,
      swimRank: 0,
      bikeScore: 0,
      bikeRank: 0,
      runScore: 0,
      runRank: 0,
    });
  }

  return calculateRanksAndScores(challengeResults);
}

export async function calculateRanksAndScores(
  challengeResults: ChallengeResult[]
): Promise<ChallengeResult[]> {
  setDisciplineScore(challengeResults, "swimDistance", "swimScore");
  setDisciplineRank(challengeResults, "swimScore", "swimRank");

  setDisciplineScore(challengeResults, "bikeDistance", "bikeScore");
  setDisciplineRank(challengeResults, "bikeScore", "bikeRank");

  setDisciplineScore(challengeResults, "runDistance", "runScore");
  setDisciplineRank(challengeResults, "runScore", "runRank");

  sumupTotalScore(challengeResults);

  setTotalRank(challengeResults);

  return challengeResults.sort(
    (result1, result2) => result1.rank - result2.rank
  ); // Sort by rank ascending
}

function setTotalRank(challengeResults: ChallengeResult[]) {
  const sortedResultsByTotalScore = challengeResults.sort(
    (result1, result2) => result2.totalScore - result1.totalScore
  ); // Sort by totalScore Descending

  let currentRank = 0;
  let lastTotalScore = 0;
  for (let sortedResultByTotalScore of sortedResultsByTotalScore) {
    if (lastTotalScore !== sortedResultByTotalScore.totalScore) {
      currentRank++;
      lastTotalScore = sortedResultByTotalScore.totalScore;
    }

    sortedResultByTotalScore.rank = currentRank;
  }
}

function setDisciplineScore(
  challengeResults: ChallengeResult[],
  disciplineDistance: keyof Distances,
  disciplineScore: "swimScore" | "bikeScore" | "runScore"
) {
  const sortedResultsByDistance = challengeResults.sort(
    (result1, result2) =>
      result1.distances[disciplineDistance] -
      result2.distances[disciplineDistance]
  );

  let currentScore = 0;
  let nextScore = 1;
  let lastDistance = 0;
  for (let sortedResultByDistance of sortedResultsByDistance) {
    if (lastDistance === sortedResultByDistance.distances[disciplineDistance]) {
      sortedResultByDistance[disciplineScore] = currentScore;
    } else {
      currentScore = nextScore;
      sortedResultByDistance[disciplineScore] = nextScore;
      lastDistance = sortedResultByDistance.distances[disciplineDistance];
    }
    nextScore++;
  }
}

function setDisciplineRank(
  challengeResults: ChallengeResult[],
  disciplineScore: "swimScore" | "bikeScore" | "runScore",
  disciplineRank: "swimRank" | "bikeRank" | "runRank"
) {
  const sortedResultsByScore = challengeResults.sort(
    (result1, result2) => result2[disciplineScore] - result1[disciplineScore]
  ); // Sort by score Descending

  let currentRank = 0;
  let nextRank = 1;
  let lastScore = 0;
  for (let sortedResultByScore of sortedResultsByScore) {
    if (lastScore === sortedResultByScore[disciplineScore]) {
      sortedResultByScore[disciplineRank] = currentRank;
    } else {
      currentRank = nextRank;
      sortedResultByScore[disciplineRank] = nextRank;
      lastScore = sortedResultByScore[disciplineScore];
    }
    nextRank++;
  }
}

function sumupTotalScore(challengeResults: ChallengeResult[]) {
  for (let challengeResult of challengeResults) {
    challengeResult.totalScore =
      challengeResult.swimScore +
      challengeResult.bikeScore +
      challengeResult.runScore;
  }
}

function getActivitiesForUser(
  activities: IActivity[],
  user: User
): IActivity[] {
  return activities.filter(
    (activity) => activity.ownerDisplayName === user.garminUserId
  );
}

function sumDistances(activities: IActivity[]): Distances {
  const swimDistance = sumTotalDistanceForSportType(
    activities,
    SportType.SWIMMING
  );

  const bikeDistance = sumTotalDistanceForSportType(activities, SportType.BIKE);

  const runDistance = sumTotalDistanceForSportType(
    activities,
    SportType.RUNNING
  );

  return {
    swimDistance: swimDistance,
    bikeDistance: bikeDistance,
    runDistance: runDistance,
  };
}

function sumTotalDistanceForSportType(
  activities: IActivity[],
  sportTypeId: number
): number {
  return activities
    .filter((activity) => activity.sportTypeId === sportTypeId)
    .map((activity) => activity.distance)
    .reduce((sum, distance) => sum + distance, 0);
}

function sumTotalTime(activities: IActivity[]): number {
  return activities
    .map((activity) => activity.movingDuration ?? activity.duration)
    .reduce((sum, duration) => sum + duration, 0);
}
