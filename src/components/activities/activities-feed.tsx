import { IActivity } from "garmin-connect/dist/garmin/types";
import { Users } from "../../datastore/Users";
import { Team1, Team2 } from "../../datastore/Teams";
import { Distance } from "../../utilities/Distance";
import UiHelper from "../../utilities/UiHelper";
import ProfileImage from "../profile-image";
import styles from "./activities-feed.module.css";
import { useState } from "react";

export default function ActivitiesFeed({
  initialActivities,
}: {
  initialActivities: IActivity[];
}) {
  const [activities, setActivities] = useState(initialActivities);

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

        if (user === undefined) {
          return <></>;
        }

        let showTimelineMarker = true;
        if (lastTimelineMarkerText === timelineMarkerText) {
          showTimelineMarker = false;
        } else {
          lastTimelineMarkerText = timelineMarkerText;
          showTimelineMarker = true;
        }

        const distance = new Distance(activity.distance / 1000);

        function deleteActivity(
          activityId: number,
          activityName: string
        ): void {
          if (
            window.confirm(
              `Bist du sicher, dass du die Aktivität "${activityName}" löschen möchtest?`
            )
          ) {
            try {
              fetch("/api/activities/delete", {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: activityId }),
              })
                .then(async (response) => {
                  if (response.ok) {
                    const updatedActivities = await response.json();
                    setActivities(updatedActivities);
                  } else {
                    const errorData = await response.json();
                    console.error("Error:", errorData.message);
                  }
                })
            } catch (error) {
              console.error("Error deleting activity:", error);
              alert("Fehler beim Löschen der Aktivität");
            }
          }
        }

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
                <div
                  className={
                    "col-9 flex-shrink-1 rounded py-2 px-3 mr-3 " +
                    styles.details
                  }
                >
                  <span
                    className={styles.deleteicon}
                    onClick={() =>
                      deleteActivity(activity.activityId, activity.activityName)
                    }
                  >
                    ❌
                  </span>
                  <h6>{activity.activityName}</h6>
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
