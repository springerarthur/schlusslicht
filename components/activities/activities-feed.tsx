import { IActivity } from "garmin-connect/dist/garmin/types";
import { Users } from "../../datastore/Users";
import { Distance } from "../../utilities/Distance";
import UiHelper from "../../utilities/UiHelper";
import { Team1, Team2 } from "../../datastore/Teams";
import ProfileImage from "../profile-image";
import styles from "./activities-feed.module.css";

export default function ActivitiesFeed({
  activities,
}: {
  activities: IActivity[];
}) {
  let lastTimelineMarkerText: string;

  return (
    <div className="mt-5">
      {activities.map((activity: IActivity) => {
        let timelineMarkerText = UiHelper.formatTimelineMarkerDate(
          activity.startTimeLocal
        );

        const user = Users.find(
          (user) => user.garminUserId == activity.ownerDisplayName
        );

        if(user === undefined) {
            return (<></>);
        }

        let showTimelineMarker = true;
        if (lastTimelineMarkerText === timelineMarkerText) {
          showTimelineMarker = false;
        } else {
          lastTimelineMarkerText = timelineMarkerText;
          showTimelineMarker = true;
        }

        const distance = new Distance(activity.distance / 1000);

        return (
          <div key={activity.activityId}>
            <hr
              className={styles.timelineMarker}
              data-content={timelineMarkerText}
              style={{ display: showTimelineMarker ? "visible" : "none" }}
            />
            <div className="row">
              <div
                className={
                  getActivityTeamClassName(activity.ownerDisplayName) + " pb-4"
                }
              >
                <div className="col-2">
                  <ProfileImage user={user} size={50} />
                </div>
                <div className={"col-9 flex-shrink-1 rounded py-2 px-3 mr-3 " + styles.details}>
                  <h6> {activity.activityName}</h6>
                  {UiHelper.getSportIdIcon(activity.sportTypeId)}
                  {distance.toString()}
                  Km ⏱️
                  {UiHelper.formatDuration(activity.duration)}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function getActivityTeamClassName(ownerDisplayName: string) {
  if (Team1.some((user) => user.garminUserId === ownerDisplayName)) {
    return styles.left;
  }
  if (Team2.some((user) => user.garminUserId === ownerDisplayName)) {
    return styles.right;
  }
}
