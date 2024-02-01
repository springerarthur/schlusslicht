import { IActivity } from "garmin-connect/dist/garmin/types";
import clientPromise from "./mongodb";
import { SportType } from "./GarminConstants";

export interface FindActivitiesOptions {
  page?: number;
  userId?: string;
  sportType?: SportType;
  date?: {startDate: Date, endDate: Date};
}

export default class ActivityService {
  private readonly chunksize = 25;

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
    findActivitiesOptions: FindActivitiesOptions
  ): Promise<IActivity[]> {
    const mongoDbClient = await clientPromise;

    const filter: any = {};
    if (findActivitiesOptions.userId !== undefined) {
      filter.ownerDisplayName = findActivitiesOptions.userId;
    }
    if (findActivitiesOptions.sportType !== undefined) {
      filter.sportTypeId = findActivitiesOptions.sportType;
    }
    if (findActivitiesOptions.date !== undefined) {
      console.warn("stacktrace: "+ console.trace());
      console.warn("startDate: " + findActivitiesOptions.date.startDate.toISOString());
      console.warn("endDate: " + findActivitiesOptions.date.endDate.toISOString());
      filter.startTimeLocal = {
        $gte: findActivitiesOptions.date.startDate.toISOString(),
        $lte: findActivitiesOptions.date.endDate.toISOString(),
      }
    }

    const query = mongoDbClient
      .db("schlusslicht")
      .collection<IActivity>("activities")
      .find(filter)
      .sort({ startTimeLocal: -1 });

    if (findActivitiesOptions.page !== undefined) {
      query
        .skip(this.chunksize * findActivitiesOptions.page)
        .limit(this.chunksize);
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
