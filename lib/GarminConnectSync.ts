import { IActivity } from "garmin-connect/dist/garmin/types";
import { GarminConnect } from "garmin-connect";
import { SportTypeIds, getActivitiesForUserURL } from "./GarminConstants";
import { Roland, Users } from "../datastore/Users";
import ActivityService from "./ActivityService";
import ConfigurationService from "./ConfigurationService";

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
    if (!force && process.env.DISABLE_AUTOUPDATE) {
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

    const activitiesFromDb = await this.activityService.getActivities();

    Users.forEach(async user => {
        await this.addActivitiesIfNotExists(activitiesFromDb, GCClient, user.garminUserId);
    });
  }

  private async addActivitiesIfNotExists(
    activitiesFromDb: IActivity[],
    gcClient: GarminConnect,
    garminConnectUserId: string
  ) {
    try {
      const activitiesFromGarmin = (
        await gcClient.get<any>(getActivitiesForUserURL + garminConnectUserId, {
          params: { start: 0, limit: 5 },
        })
      ).activityList as IActivity[];

      await Promise.all(
        activitiesFromGarmin.map(async (activityFromGarmin) => {
          if (
            activityFromGarmin.sportTypeId !== SportTypeIds.running &&
            activityFromGarmin.sportTypeId !== SportTypeIds.bike &&
            activityFromGarmin.sportTypeId !== SportTypeIds.swimming
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

          const garminStartDate = new Date(activityFromGarmin.startTimeLocal);
          let now = new Date();
          if (
            garminStartDate.getFullYear() === now.getFullYear() &&
            garminStartDate.getMonth() === now.getMonth()
          ) {
            await this.activityService.insertActivity(activityFromGarmin);
          }
        })
      );
    } catch (e) {
      console.error(e);
    }
  }
}
