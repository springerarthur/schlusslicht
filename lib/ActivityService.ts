import { IActivity } from "garmin-connect/dist/garmin/types";
import clientPromise from "./mongodb";

export default class ActivityService {
    public async getActivities(): Promise<IActivity[]> {
        const mongoDbClient = await clientPromise;

        return await mongoDbClient
            .db("schlusslicht")
            .collection<IActivity>("activities")
            .find()
            .toArray();
    }

    public async insertActivity(activity: IActivity) {
        const mongoDbClient = await clientPromise;

        await mongoDbClient
            .db("schlusslicht")
            .collection<IActivity>("activities")
            .insertOne(activity);
    }
}