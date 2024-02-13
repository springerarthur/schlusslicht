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
  const sortedResultsBySwimDistance = challengeResults.sort(
    (result1, result2) =>
      result1.distances.swimDistance - result2.distances.swimDistance
  ); // Sort by swimDistance Ascending

  let currentSwimScore = 0;
  let nextSwimScore = 1;
  let lastSwimDistance = 0;
  for (let sortedResultBySwimDistance of sortedResultsBySwimDistance) {
    if (
      lastSwimDistance === sortedResultBySwimDistance.distances.swimDistance
    ) {
      sortedResultBySwimDistance.swimScore = currentSwimScore;
    } else {
      currentSwimScore = nextSwimScore;
      sortedResultBySwimDistance.swimScore = nextSwimScore;
      lastSwimDistance = sortedResultBySwimDistance.distances.swimDistance;
    }
    nextSwimScore++;
  }

  const sortedResultsBySwimScore = challengeResults.sort(
    (result1, result2) => result2.swimScore - result1.swimScore
  ); // Sort by swimScore Descending

  let currentSwimRank = 0;
  let nextSwimRank = 1;
  let lastSwimScore = 0;
  for (let sortedResultBySwimScore of sortedResultsBySwimScore) {
    if (lastSwimScore === sortedResultBySwimScore.swimScore) {
      sortedResultBySwimScore.swimRank = currentSwimRank;
    } else {
      currentSwimRank = nextSwimRank;
      sortedResultBySwimScore.swimRank = nextSwimRank;
      lastSwimScore = sortedResultBySwimScore.swimScore;
    }
    nextSwimRank++;
  }

  const sortedResultsByBikeDistance = challengeResults.sort(
    (result1, result2) =>
      result1.distances.bikeDistance - result2.distances.bikeDistance
  ); // Sort by bikeDistance Ascending

  let currentBikeScore = 0;
  let nextBikeScore = 1;
  let lastBikeDistance = 0;
  for (let sortedResultByBikeDistance of sortedResultsByBikeDistance) {
    if (
      lastBikeDistance === sortedResultByBikeDistance.distances.bikeDistance
    ) {
      sortedResultByBikeDistance.bikeScore = currentBikeScore;
    } else {
      currentBikeScore = nextBikeScore;
      sortedResultByBikeDistance.bikeScore = nextBikeScore;
      lastBikeDistance = sortedResultByBikeDistance.distances.bikeDistance;
    }
    nextBikeScore++;
  }

  const sortedResultsByBikeScore = challengeResults.sort(
    (result1, result2) => result2.bikeScore - result1.bikeScore
  ); // Sort by bikeScore Descending

  let currentBikeRank = 0;
  let nextBikeRank = 1;
  let lastBikeScore = 0;
  for (let sortedResultByBikeScore of sortedResultsByBikeScore) {
    if (lastBikeScore === sortedResultByBikeScore.bikeScore) {
      sortedResultByBikeScore.bikeRank = currentBikeRank;
    } else {
      currentBikeRank = nextBikeRank;
      sortedResultByBikeScore.bikeRank = nextBikeRank;
      lastBikeScore = sortedResultByBikeScore.bikeScore;
    }
    nextBikeRank++;
  }

  const sortedResultsByRunDistance = challengeResults.sort(
    (result1, result2) =>
      result1.distances.runDistance - result2.distances.runDistance
  ); // Sort by runDistance Ascending

  let currentRunScore = 0;
  let nextRunScore = 1;
  let lastRunDistance = 0;
  for (let sortedResultByRunDistance of sortedResultsByRunDistance) {
    if (lastRunDistance === sortedResultByRunDistance.distances.runDistance) {
      sortedResultByRunDistance.runScore = currentRunScore;
    } else {
      currentRunScore = nextRunScore;
      sortedResultByRunDistance.runScore = nextRunScore;
      lastRunDistance = sortedResultByRunDistance.distances.runDistance;
    }
    nextRunScore++;
  }

  const sortedResultsByRunScore = challengeResults.sort(
    (result1, result2) => result2.runScore - result1.runScore
  ); // Sort by runScore Descending

  let currentRunRank = 0;
  let nextRunRank = 1;
  let lastRunScore = 0;
  for (let sortedResultByRunScore of sortedResultsByRunScore) {
    if (lastRunScore === sortedResultByRunScore.runScore) {
      sortedResultByRunScore.runRank = currentRunRank;
    } else {
      currentRunRank = nextRunRank;
      sortedResultByRunScore.runRank = nextRunRank;
      lastRunScore = sortedResultByRunScore.runScore;
    }
    nextRunRank++;
  }

  for (let challengeResult of challengeResults) {
    challengeResult.totalScore =
      challengeResult.swimScore +
      challengeResult.bikeScore +
      challengeResult.runScore;
  }

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

  return challengeResults.sort(
    (result1, result2) => result1.rank - result2.rank
  ); // Sort by rank ascending
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
