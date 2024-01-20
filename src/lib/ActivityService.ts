import { IActivity } from "garmin-connect/dist/garmin/types";
import clientPromise from "./mongodb";
import { SportType } from "./GarminConstants";

export default class ActivityService {
  private readonly chunksize = 2;

  public async getAllActivities(): Promise<IActivity[]> {
    const mongoDbClient = await clientPromise;

    return await mongoDbClient
      .db("schlusslicht")
      .collection<IActivity>("activities")
      .find()
      .sort({ startTimeLocal: -1 })
      .toArray();
  }

  public async findActivities(
    page: number,
    userId?: string,
    sportType?: SportType
  ): Promise<IActivity[]> {
    const mongoDbClient = await clientPromise;

    const filter: any = {};
    if (userId) {
      filter.ownerDisplayName = userId;
    }
    if (sportType) {
      filter.sportTypeId = sportType;
    }

    const query = mongoDbClient
      .db("schlusslicht")
      .collection<IActivity>("activities")
      .find(filter)
      .sort({ startTimeLocal: -1 });

    if (page >= 0) {
      query.skip(this.chunksize * page).limit(this.chunksize);
    }

    return await query.toArray();
  }

  public async insertActivity(activity: IActivity) {
    const mongoDbClient = await clientPromise;

    await mongoDbClient
      .db("schlusslicht")
      .collection<IActivity>("activities")
      .insertOne(activity);
  }

  public async deleteActivity(activitiyId: number): Promise<IActivity[]> {
    const mongoDbClient = await clientPromise;

    try {
      await mongoDbClient
        .db("schlusslicht")
        .collection<IActivity>("activities")
        .deleteOne({ activityId: activitiyId });

      return await this.getAllActivities();
    } catch (err) {
      console.error("Error deleting document:", err);
      return await this.getAllActivities();
    }
  }
}
