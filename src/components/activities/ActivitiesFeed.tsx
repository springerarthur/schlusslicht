import { IActivity } from "garmin-connect/dist/garmin/types";
import { Users } from "../../datastore/Users";
import { Distance } from "../../types/Distance";
import ProfileImage from "../profile-image";
import styles from "./ActivitiesFeed.module.css";
import { useState } from "react";
import {
  formatDuration,
  formatTimelineMarkerDate,
  getSportIdIcon,
} from "../../utilities/UiHelper";

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
        let timelineMarkerText = formatTimelineMarkerDate(
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
              }).then(async (response) => {
                if (response.ok) {
                  const updatedActivities = await response.json();
                  setActivities(updatedActivities);
                } else {
                  const errorData = await response.json();
                  console.error("Error:", errorData.message);
                }
              });
            } catch (error) {
              console.error("Error deleting activity:", error);
              alert("Fehler beim Löschen der Aktivität");
            }
          }
        }

        return (
          <div key={activity.activityId}>
            <hr
              className={"mt-1 " + styles.timelineMarker}
              data-content={timelineMarkerText}
              style={{ display: showTimelineMarker ? "visible" : "none" }}
            />
            <div className="row">
              <div className={"pb-4 " + styles.left}>
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
                  {getSportIdIcon(activity.sportTypeId)}
                  {distance.toString()}
                  Km ⏱️
                  {formatDuration(activity.duration)}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
