import { IActivity } from "garmin-connect/dist/garmin/types";
import { GarminConnect } from "garmin-connect";
import { SportType, getActivitiesForUserURL } from "./GarminConstants";
import { Users } from "../datastore/Users";
import ActivityService from "./ActivityService";
import ConfigurationService from "./ConfigurationService";
import webPush from "web-push";
import WebPushSubscriptionService from "./WebPushSubscriptionService";

export default class GarminConnectSync {
  readonly syncInterval: number = 15;

  private activityService = new ActivityService();
  private configurationService = new ConfigurationService();

  public async updateRequired(): Promise<boolean> {
    const lastUpdateTimeStamp =
      await this.configurationService.getLastUpdateTimeStamp();

    const now = new Date();
    const differenceInMs = now.getTime() - lastUpdateTimeStamp.getTime();

    const differenceInMinutes = differenceInMs / (1000 * 60);

    return differenceInMinutes > this.syncInterval;
  }

  public async importDataFromGarminConnect(force: boolean = false) {
    if (!force && process.env.DISABLE_AUTOUPDATE === "true") {
      return;
    }

    try {
      if (force || (await this.updateRequired())) {
        await this.importData();

        await this.configurationService.upsertLastUpdateTimeStamp();
      }
    } catch (e) {
      console.error(e);
    }
  }

  private async importData() {
    const GCClient = new GarminConnect({
      username: process.env.GARMIN_EMAIL + "",
      password: process.env.GARMIN_PWD + "",
    });
    await GCClient.login();

    const activitiesFromDb = await this.activityService.getAllActivities();

    let newActivititiesAreCreated = false;
    await Promise.all(
      Users.map(async (user) => {
        newActivititiesAreCreated =
          newActivititiesAreCreated ||
          (await this.addActivitiesIfNotExists(
            activitiesFromDb,
            GCClient,
            user.garminUserId
          ));
      })
    );

    if (newActivititiesAreCreated) {
      const webPushSubscriptionService = new WebPushSubscriptionService();
      webPushSubscriptionService.notifyAllSubscriber();
    }
  }

  private async addActivitiesIfNotExists(
    activitiesFromDb: IActivity[],
    gcClient: GarminConnect,
    garminConnectUserId: string
  ): Promise<boolean> {
    let newActivititiesAreCreated = false;

    try {
      const activitiesFromGarmin = (
        await gcClient.get<any>(getActivitiesForUserURL + garminConnectUserId, {
          params: { start: 0, limit: 8 },
        })
      ).activityList as IActivity[];

      await Promise.all(
        activitiesFromGarmin.map(async (activityFromGarmin) => {
          if (
            activityFromGarmin.sportTypeId !== SportType.RUNNING &&
            activityFromGarmin.sportTypeId !== SportType.BIKE &&
            activityFromGarmin.sportTypeId !== SportType.SWIMMING
          ) {
            return;
          }

          if (
            activitiesFromDb.some(
              (activityFromDb) =>
                activityFromDb.activityId == activityFromGarmin.activityId
            )
          ) {
            return;
          }

          await this.activityService.insertActivity(activityFromGarmin);
          newActivititiesAreCreated = true;
        })
      );
    } catch (e) {
      console.error(e);
    }

    return newActivititiesAreCreated;
  }
}
