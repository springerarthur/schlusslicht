import { IActivity } from "garmin-connect/dist/garmin/types";
import { Users } from "../../datastore/Users";
import ProfileImage from "../profile-image";
import styles from "./ActivitiesFeed.module.css";
import { useEffect, useState, useRef } from "react";
import {
  formatDistance,
  formatDuration,
  formatTimelineMarkerDate,
  getSportIdIcon,
} from "../../utilities/UiHelper";
import { User } from "../../lib/User";
import { SportType, getActivityDetailsLink } from "../../lib/GarminConstants";
import Link from "next/link";
import SportTypeFilter from "../sport-type-filter";

export default function ActivitiesFeed({
  userId,
  leftTeam,
  rightTeam,
  activitiesChanged,
  startDate,
  endDate,
  filter
}: {
  userId?: string;
  leftTeam: User[];
  rightTeam: User[];
  activitiesChanged?: boolean;
  startDate?: Date;
  endDate?: Date;
  filter: SportType | undefined;
}) {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchActivities = () => {
      const params = new URLSearchParams();
      if (filter !== undefined) {
        params.append("sportType", filter.toString());
      }
      if (userId !== undefined) {
        params.append("userId", userId);
      }
      if (startDate !== undefined) {
        params.append("startDate", startDate.toISOString());
      }
      if (endDate !== undefined) {
        params.append("endDate", endDate.toISOString());
      }

      params.append("page", page + "");

      let url = `/api/activities?${params.toString()}`;

      fetch(url)
        .then((res) => res.json())
        .then((newActivities) => {
          if (newActivities.length === 0) {
            setHasMore(false);
          } else {
            setActivities((prevActivities) => [
              ...prevActivities,
              ...newActivities,
            ]);
            setPage((prevPage) => prevPage + 1);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    };

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !loading && hasMore) {
        setLoading(true);
        fetchActivities();
      }
    }, options);

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [
    userId,
    filter,
    activitiesChanged,
    startDate,
    endDate,
    loading,
    page,
    hasMore,
  ]);

  let lastTimelineMarkerText: string;

  return (
    <div className="mt-5 justify-content-center">
      {activities
        .filter(
          (activity) =>
            filter === undefined || activity.sportTypeId === filter
        )
        .map((activity: IActivity) => {
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
          }

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
                style={{ display: showTimelineMarker ? "block" : "none" }}
              />
              <div className="row">
                <div
                  className={
                    getActivityTeamClassName(activity.ownerDisplayName) +
                    " pb-4"
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
                        deleteActivity(
                          activity.activityId,
                          activity.activityName
                        )
                      }
                    >
                      ❌
                    </span>
                    <h6>
                      <Link
                        href={getActivityDetailsLink(activity.activityId)}
                        target="_blank"
                        className={styles.activityLink}
                      >
                        {activity.activityName}
                      </Link>
                    </h6>
                    {getSportIdIcon(activity.sportTypeId)}
                    {formatDistance(activity.distance)}
                    Km ⏱️
                    {formatDuration(
                      activity.movingDuration ?? activity.duration
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

      {loading && (
        <div>
          <div
            className="spinner-border spinner-border-sm text-info me-2"
            role="status"
          ></div>
          Aktivitäten werden geladen!
        </div>
      )}
      <div className="mb-2" ref={containerRef}></div>
      <div className="mb-2"></div>
    </div>
  );

  function getActivityTeamClassName(ownerDisplayName: string): string {
    if (leftTeam.some((user) => user.garminUserId === ownerDisplayName)) {
      return styles.left;
    }
    if (rightTeam.some((user) => user.garminUserId === ownerDisplayName)) {
      return styles.right;
    }

    return styles.impartial;
  }
}
