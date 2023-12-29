import KeyValuePair from "./KeyValuePair";
import clientPromise from "./mongodb";

export default class ConfigurationService {
    public async getLastUpdateTimeStamp(): Promise<Date> {
        const mongoDbClient = await clientPromise;

        let lastUpdateTimeStamp = (await mongoDbClient
            .db("schlusslicht")
            .collection<KeyValuePair>("configuration")
            .findOne({ key: "lastUpdateTimeStamp" }) as KeyValuePair)
            ?.value ?? new Date();

        return new Date(lastUpdateTimeStamp);
    }

    public async upsertLastUpdateTimeStamp() {
        const mongoDbClient = await clientPromise;

        await mongoDbClient
            .db("schlusslicht")
            .collection<KeyValuePair>("configuration")
            .updateOne(
                { key: "lastUpdateTimeStamp" },
                { "$set": { value: new Date() } },
                { "upsert": true });
    }
}