export enum SportType {
  RUNNING = 1,
  BIKE = 2,
  SWIMMING = 5,
}

export const getActivitiesForUserURL =
  "https://connectapi.garmin.com/activitylist-service/activities/";

export function getActivityDetailsLink(activityId: number) {
  return "https://connect.garmin.com/modern/activity/" + activityId;
}
