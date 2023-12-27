import { IActivity } from "garmin-connect/dist/garmin/types";
import GarminConnect from "./GarminConnect";
import clientPromise from "./mongodb";

const arthurGarminId = 'Springer.arthur';
const waldiGarminId = 'f8d6b455-0aec-4c46-b3e1-5621cac1719f';
const danielGarminId = '6d29db1b-2cc2-4d32-b63c-479a1fa38471';
const rolandGarminId = '97e62216-5e5d-42b2-a7d1-f9452a5363b4';

const alexHGarminId = '1690439f-a46f-4079-9709-33ffa337c80c';
const alexSGarminId = 'skipper2193';
const janGarminId = '20434747-96b2-4592-be63-6cf0c93d42ce';
const thomasGarminId = 'b936a5d7-ed2f-4ca6-a535-25e6d25707bc';

export default class GarminConnectSync {
    static lastUpdate: Date = new Date();
    readonly syncInterval: number = 15;

    async importDataFromGarminConnect(force: boolean = false) {
        try {
            if (force || this.shouldUpdate(GarminConnectSync.lastUpdate)) {
                console.log(`Import data from garmin connect: Force=${force}, lastUpdate=${GarminConnectSync.lastUpdate}`);
                this.importData();

                GarminConnectSync.lastUpdate = new Date();
            }
        } catch (e) {
            console.error(e);
        }
    }

    private async importData() {
        const GCClient = new GarminConnect({
            username: process.env.GARMIN_EMAIL + "",
            password: process.env.GARMIN_PWD + ""
        });
        await GCClient.login();

        await this.addActivitiesIfNotExists(GCClient, arthurGarminId);
        await this.addActivitiesIfNotExists(GCClient, waldiGarminId);
        await this.addActivitiesIfNotExists(GCClient, danielGarminId);
        await this.addActivitiesIfNotExists(GCClient, rolandGarminId);

        await this.addActivitiesIfNotExists(GCClient, alexHGarminId);
        await this.addActivitiesIfNotExists(GCClient, alexSGarminId);
        await this.addActivitiesIfNotExists(GCClient, janGarminId);
        await this.addActivitiesIfNotExists(GCClient, thomasGarminId);
    }

    private shouldUpdate(date: Date): boolean {
        const now = new Date();
        const differenzInMs = now.getTime() - date.getTime();

        const differenzInMinuten = differenzInMs / (1000 * 60);

        return differenzInMinuten > this.syncInterval;
    }

    private async addActivitiesIfNotExists(GCClient: GarminConnect, garminConnectUserId: string) {
        try {
            const activitiesFromGarmin = await GCClient.getActivitiesForUser(garminConnectUserId, 0, 15);

            const activitiesFromDb = await this.getActivitiesFromMongoDb();

            for (const activityFromGarmin of activitiesFromGarmin) {
                // sportTypeId
                // 1 => Laufen
                // 2 => Fahrrad
                // 5 => Schwimmen
                if (activityFromGarmin.sportTypeId !== 1 && activityFromGarmin.sportTypeId !== 2 && activityFromGarmin.sportTypeId !== 5) {
                    continue;
                }

                if (activitiesFromDb.some(activityFromDb => activityFromDb.activityId == activityFromGarmin.activityId)) {
                    continue;
                }

                const garminStartDate = new Date(activityFromGarmin.startTimeLocal);
                if (garminStartDate.getFullYear() === 2023 && garminStartDate.getMonth() + 1 === 12) {
                    await this.insertActivityToMongoDb(activityFromGarmin);
                }
            }
        } catch (e) {
            console.error(e);
        }
    }

    private async getActivitiesFromMongoDb(): Promise<IActivity[]> {
        const mongoDbClient = await clientPromise;

        return await mongoDbClient
            .db("schlusslicht")
            .collection<IActivity>("activities")
            .find()
            .toArray();
    }

    private async insertActivityToMongoDb(activity: IActivity) {
        const mongoDbClient = await clientPromise;

        return await mongoDbClient
            .db("schlusslicht")
            .collection<IActivity>("activities")
            .insertOne(activity);
    }
}
