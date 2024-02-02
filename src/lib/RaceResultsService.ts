import { RaceResult } from "../types/RaceResult";
import clientPromise from "./mongodb";

export default class RaceResultsService {
  public async getAllRaceResults(): Promise<RaceResult[]> {
    const mongoDbClient = await clientPromise;

    return await mongoDbClient
      .db("schlusslicht")
      .collection<RaceResult>("race-results")
      .find()
      .sort({ date: -1 })
      .toArray();
  }

  public async saveRaceResult(raceResult: RaceResult) {
    const mongoDbClient = await clientPromise;

    await mongoDbClient
      .db("schlusslicht")
      .collection<RaceResult>("race-results")
      .insertOne(raceResult);
  }
}
