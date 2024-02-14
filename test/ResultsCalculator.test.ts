import { User } from "../src/lib/User";
import { ChallengeResult } from "../src/types/ChallengeResult";
import { calculateRanksAndScores } from "../src/utilities/ResultsCalculator";

describe("calculateRanksAndScores", () => {
  it("should correctly calculate ranks and scores for a unique set of challenge results", async () => {
    const challengeResults: ChallengeResult[] = [
      {
        user: createDummyUser("Erster"),
        distances: { swimDistance: 50, bikeDistance: 5000, runDistance: 5000 },
        rank: 0,
        totalScore: 0,
        swimScore: 0,
        swimRank: 0,
        bikeScore: 0,
        bikeRank: 0,
        runScore: 0,
        runRank: 0,
        totalTime: 0,
      },
      {
        user: createDummyUser("Dritter"),
        distances: { swimDistance: 10, bikeDistance: 10, runDistance: 10 },
        rank: 0,
        totalScore: 0,
        swimScore: 0,
        swimRank: 0,
        bikeScore: 0,
        bikeRank: 0,
        runScore: 0,
        runRank: 0,
        totalTime: 0,
      },
      {
        user: createDummyUser("Zweiter"),
        distances: { swimDistance: 10, bikeDistance: 1000, runDistance: 1000 },
        rank: 0,
        totalScore: 0,
        swimScore: 0,
        swimRank: 0,
        bikeScore: 0,
        bikeRank: 0,
        runScore: 0,
        runRank: 0,
        totalTime: 0,
      },
      {
        user: createDummyUser("Vierter"),
        distances: { swimDistance: 0, bikeDistance: 4000, runDistance: 0 },
        rank: 0,
        totalScore: 0,
        swimScore: 0,
        swimRank: 0,
        bikeScore: 0,
        bikeRank: 0,
        runScore: 0,
        runRank: 0,
        totalTime: 0,
      },
    ];

    const results = await calculateRanksAndScores(challengeResults);

    expect(results[0].user.displayName).toEqual("Erster");
    expect(results[0].rank).toEqual(1);
    expect(results[0].totalScore).toEqual(12);
    expect(results[0].swimRank).toEqual(1);
    expect(results[0].swimScore).toEqual(4);
    expect(results[0].bikeRank).toEqual(1);
    expect(results[0].bikeScore).toEqual(4);
    expect(results[0].runRank).toEqual(1);
    expect(results[0].runScore).toEqual(4);

    expect(results[1].user.displayName).toEqual("Zweiter");
    expect(results[1].rank).toEqual(2);
    expect(results[1].totalScore).toEqual(7);
    expect(results[1].swimRank).toEqual(2);
    expect(results[1].swimScore).toEqual(2);
    expect(results[1].bikeRank).toEqual(3);
    expect(results[1].bikeScore).toEqual(2);
    expect(results[1].runRank).toEqual(2);
    expect(results[1].runScore).toEqual(3);

    expect(results[2].user.displayName).toEqual("Dritter");
    expect(results[2].rank).toEqual(3);
    expect(results[2].totalScore).toEqual(5);
    expect(results[2].swimRank).toEqual(2);
    expect(results[2].swimScore).toEqual(2);
    expect(results[2].bikeRank).toEqual(4);
    expect(results[2].bikeScore).toEqual(1);
    expect(results[2].runRank).toEqual(3);
    expect(results[2].runScore).toEqual(2);

    expect(results[3].user.displayName).toEqual("Vierter");
    expect(results[3].rank).toEqual(4);
    expect(results[3].totalScore).toEqual(3);
    expect(results[3].swimRank).toEqual(4);
    expect(results[3].swimScore).toEqual(0);
    expect(results[3].bikeRank).toEqual(2);
    expect(results[3].bikeScore).toEqual(3);
    expect(results[3].runRank).toEqual(4);
    expect(results[3].runScore).toEqual(0);
  });
});


describe("calculateRanksAndScores", () => {
  it("should correctly calculate ranks and scores for users with same total score by better ranking", async () => {
    const challengeResults: ChallengeResult[] = [
      {
        user: createDummyUser("Vierter"),
        distances: { swimDistance: 20, bikeDistance: 1000, runDistance: 100 },
        rank: 0,
        totalScore: 0,
        swimScore: 0,
        swimRank: 0,
        bikeScore: 0,
        bikeRank: 0,
        runScore: 0,
        runRank: 0,
        totalTime: 0,
      },
      {
        user: createDummyUser("Zweiter"),
        distances: { swimDistance: 10, bikeDistance: 3000, runDistance: 400 },
        rank: 0,
        totalScore: 0,
        swimScore: 0,
        swimRank: 0,
        bikeScore: 0,
        bikeRank: 0,
        runScore: 0,
        runRank: 0,
        totalTime: 0,
      },
      {
        user: createDummyUser("Erster"),
        distances: { swimDistance: 40, bikeDistance: 4000, runDistance: 0 },
        rank: 0,
        totalScore: 0,
        swimScore: 0,
        swimRank: 0,
        bikeScore: 0,
        bikeRank: 0,
        runScore: 0,
        runRank: 0,
        totalTime: 0,
      },
      {
        user: createDummyUser("Dritter"),
        distances: { swimDistance: 30, bikeDistance: 2000, runDistance: 300 },
        rank: 0,
        totalScore: 0,
        swimScore: 0,
        swimRank: 0,
        bikeScore: 0,
        bikeRank: 0,
        runScore: 0,
        runRank: 0,
        totalTime: 0,
      },
    ];

    const results = await calculateRanksAndScores(challengeResults);

    expect(results[0].user.displayName).toEqual("Erster");
    expect(results[0].rank).toEqual(1);
    expect(results[0].totalScore).toEqual(8);
    expect(results[0].swimRank).toEqual(1);
    expect(results[0].swimScore).toEqual(4);
    expect(results[0].bikeRank).toEqual(1);
    expect(results[0].bikeScore).toEqual(4);
    expect(results[0].runRank).toEqual(4);
    expect(results[0].runScore).toEqual(0);

    expect(results[1].user.displayName).toEqual("Zweiter");
    expect(results[1].rank).toEqual(2);
    expect(results[1].totalScore).toEqual(8);
    expect(results[1].swimRank).toEqual(4);
    expect(results[1].swimScore).toEqual(1);
    expect(results[1].bikeRank).toEqual(2);
    expect(results[1].bikeScore).toEqual(3);
    expect(results[1].runRank).toEqual(1);
    expect(results[1].runScore).toEqual(4);

    expect(results[2].user.displayName).toEqual("Dritter");
    expect(results[2].rank).toEqual(3);
    expect(results[2].totalScore).toEqual(8);
    expect(results[2].swimRank).toEqual(2);
    expect(results[2].swimScore).toEqual(3);
    expect(results[2].bikeRank).toEqual(3);
    expect(results[2].bikeScore).toEqual(2);
    expect(results[2].runRank).toEqual(2);
    expect(results[2].runScore).toEqual(3);

    expect(results[3].user.displayName).toEqual("Vierter");
    expect(results[3].rank).toEqual(4);
    expect(results[3].totalScore).toEqual(5);
    expect(results[3].swimRank).toEqual(3);
    expect(results[3].swimScore).toEqual(2);
    expect(results[3].bikeRank).toEqual(4);
    expect(results[3].bikeScore).toEqual(1);
    expect(results[3].runRank).toEqual(3);
    expect(results[3].runScore).toEqual(2);
  });
});

function createDummyUser(displayName: string): User {
  return {
    displayName: displayName,
    garminUserId: "001",
    profileImg: "img1",
    profileImgSmall: "img1s",
  };
}
