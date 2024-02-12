import { User } from "../src/lib/User";
import { ChallengeResult } from "../src/types/ChallengeResult";
import { calculateRanksAndScores } from "../src/utilities/ResultsCalculator";

describe("calculateRanksAndScores", () => {
  it("should correctly calculate ranks and scores for a unique set of challenge results", async () => {
    const challengeResults: ChallengeResult[] = [
      {
        user: createDummyUser("Erster"),
        distances: { swimDistance: 50, bikeDistance: 5000, runDistance: 5000 },
      },
      {
        user: createDummyUser("Dritter"),
        distances: { swimDistance: 10, bikeDistance: 10, runDistance: 10 },
      },
      {
        user: createDummyUser("Zweiter"),
        distances: { swimDistance: 100, bikeDistance: 1000, runDistance: 1000 },
      },
      {
        user: createDummyUser("Vierter"),
        distances: { swimDistance: 0, bikeDistance: 4000, runDistance: 0 },
      },
    ];

    const results = await calculateRanksAndScores(challengeResults);

    expect(results[0].user.displayName).toEqual("Erster");
    // expect(results[0].rank).toEqual(1);
    // expect(results[0].swimRank).toEqual(2);
    // expect(results[0].swimScore).toEqual(3);
    // expect(results[0].bikeRank).toEqual(1);
    // expect(results[0].bikeScore).toEqual(4);
    // expect(results[0].runRank).toEqual(1);
    // expect(results[0].runScore).toEqual(4);

    expect(results[1].user.displayName).toEqual("Zweiter");
    expect(results[2].user.displayName).toEqual("Dritter");
    expect(results[3].user.displayName).toEqual("Vierter");
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
