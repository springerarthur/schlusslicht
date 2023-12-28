import { IActivity } from "garmin-connect/dist/garmin/types";
import clientPromise from "./mongodb";
import { GarminConnect } from "garmin-connect";
import { GarminUserIds, SportTypeIds, getActivitiesForUserURL } from './GarminConstants';

export default class GarminConnectSync {
    private static lastUpdate: Date;

    readonly syncInterval: number = 15;

    async importDataFromGarminConnect(force: boolean = false) {
        try {
            console.log(`Check for import data timestamp. GarminConnectSync.lastUpdate=${GarminConnectSync.lastUpdate}`);
            if (GarminConnectSync.lastUpdate === undefined) {
                GarminConnectSync.lastUpdate = new Date();
            }

            if (force || this.shouldUpdate(GarminConnectSync.lastUpdate)) {
                console.log(`Import data from garmin connect: Force=${force}, lastUpdate=${GarminConnectSync.lastUpdate}`);
                await this.importData();

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

        const activitiesFromDb = await this.getActivitiesFromMongoDb();

        await this.addActivitiesIfNotExists(activitiesFromDb, GCClient, GarminUserIds.arthur);
        await this.addActivitiesIfNotExists(activitiesFromDb, GCClient, GarminUserIds.waldi);
        await this.addActivitiesIfNotExists(activitiesFromDb, GCClient, GarminUserIds.daniel);
        await this.addActivitiesIfNotExists(activitiesFromDb, GCClient, GarminUserIds.roland);

        await this.addActivitiesIfNotExists(activitiesFromDb, GCClient, GarminUserIds.alexH);
        await this.addActivitiesIfNotExists(activitiesFromDb, GCClient, GarminUserIds.alexS);
        await this.addActivitiesIfNotExists(activitiesFromDb, GCClient, GarminUserIds.jan);
        await this.addActivitiesIfNotExists(activitiesFromDb, GCClient, GarminUserIds.thomas);
    }

    private async addActivitiesIfNotExists(activitiesFromDb: IActivity[], gcClient: GarminConnect, garminConnectUserId: string) {
        try {
            const activitiesFromGarmin = (await gcClient.get<any>(getActivitiesForUserURL + garminConnectUserId, {
                params: { start: 0, limit: 5 }
            })).activityList as IActivity[];

            for (const activityFromGarmin of activitiesFromGarmin) {
                if (activityFromGarmin.sportTypeId !== SportTypeIds.running && activityFromGarmin.sportTypeId !== SportTypeIds.bike && activityFromGarmin.sportTypeId !== SportTypeIds.swimming) {
                    continue;
                }

                if (activitiesFromDb.some(activityFromDb => activityFromDb.activityId == activityFromGarmin.activityId)) {
                    continue;
                }

                const garminStartDate = new Date(activityFromGarmin.startTimeLocal);
                let now = new Date();
                if (garminStartDate.getFullYear() === now.getFullYear() && garminStartDate.getMonth() === now.getMonth()) {
                    await this.insertActivityToMongoDb(activityFromGarmin);
                }
            }
        } catch (e) {
            console.error(e);
        }
    }

    private shouldUpdate(date: Date): boolean {
        const now = new Date();
        const differenzInMs = now.getTime() - date.getTime();

        const differenzInMinuten = differenzInMs / (1000 * 60);

        return differenzInMinuten > this.syncInterval;
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
