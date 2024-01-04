import { IActivity } from "garmin-connect/dist/garmin/types";
import clientPromise from "./mongodb";
import { SportTypeIds } from "./GarminConstants";

export default class ActivityService {
  public async getActivities(): Promise<IActivity[]> {
    const mongoDbClient = await clientPromise;

    return await mongoDbClient
      .db("schlusslicht")
      .collection<IActivity>("activities")
      .find()
      .sort({ startTimeLocal: -1 })
      .toArray();
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
        const result = await mongoDbClient
          .db("schlusslicht")
          .collection<IActivity>("activities")
          .deleteOne({ activityId: activitiyId });

      return await this.getActivities();
    } catch (err) {
      console.error("Error deleting document:", err);
      return await this.getActivities();
    }
  }
}
