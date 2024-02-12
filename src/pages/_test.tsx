import { IActivity } from "garmin-connect/dist/garmin/types";
import ActivityService from "../lib/ActivityService";
import { useEffect, useState } from "react";

export async function getServerSideProps() {
  try {
    const activityService = new ActivityService();
    const activities = await activityService.getAllActivities();

    return {
      props: { initialActivities: JSON.parse(JSON.stringify(activities)) },
    };
  } catch (e) {
    console.error(e);
  }
  return {
    props: { initialActivities: { initialActivities: [{}] } },
  };
}

export default function Home({
  initialActivities,
}: {
  initialActivities: IActivity[];
}) {
  const [activities, setActivities] = useState(initialActivities);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/activities")
      .then((res) => res.json())
      .then((data) => {
        setActivities(data);
        setLoading(false);
      });
  }, []);

  return <></>;
};
