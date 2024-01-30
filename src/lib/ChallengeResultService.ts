import { ChallengeResult } from "../types/ChallengeResult";
import { ChallengeResultSnapshot } from "../types/ChallengeResultSnapshot";
import clientPromise from "./mongodb";

export default class ChallengeResultService {
  public async getLatestChallengeResultSnapshot(): Promise<ChallengeResultSnapshot> {
    const mongoDbClient = await clientPromise;

    const lastChallengeResultSnapshot = await mongoDbClient
      .db("schlusslicht")
      .collection<ChallengeResultSnapshot>("challenge_result_snapshots")
      .findOne({}, { sort: { creationTime: -1 } });

    if (lastChallengeResultSnapshot) {
      return lastChallengeResultSnapshot;
    } else {
      return { creationTime: new Date(2000, 0, 1), results: [] };
    }
  }

  public async createChallengeResultSnapshot(
    challengeResults: ChallengeResult[]
  ) {
    const mongoDbClient = await clientPromise;

    await mongoDbClient
      .db("schlusslicht")
      .collection<ChallengeResultSnapshot>("challenge_result_snapshots")
      .insertOne({creationTime: new Date(), results: challengeResults});
  }
}
