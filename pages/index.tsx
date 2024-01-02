import Head from "next/head";

import { IActivity } from "garmin-connect/dist/garmin/types";

import { Team1, Team2 } from "../datastore/Teams";

import TeamResultsCalculator from "../utilities/TeamResultsCalculator";

import ActivityService from "../lib/ActivityService";
import { useEffect, useState } from "react";
import ActivitiesFeed from "../components/activities/activities-feed";
import TeamProgress from "../components/team-progress";
import TeamScore from "../components/team-score";
import { SportTypeIds } from "../lib/GarminConstants";

export async function getServerSideProps() {
  try {
    const activityService = new ActivityService();
    const activities = await activityService.getActivities();

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

  const teamResultsCalculator = new TeamResultsCalculator();
  const teamResults = teamResultsCalculator.getTeamResults(
    activities,
    Team1,
    Team2
  );

  return (
    <div className="container">
      <Head>
        <title>Schlusslicht Punktestand</title>
      </Head>

      <main>
        <div className="container mt-4 main-content text-center">
          {isLoading && (
            <div className="alert alert-info fixed-top update-activities">
              <div
                className="spinner-border spinner-border-sm text-info me-2"
                role="status"
              ></div>
              Garmin-Aktivitäten werden aktualisiert!
            </div>
          )}
          <TeamScore teamResults={teamResults}></TeamScore>

          <TeamProgress
            team1Distance={teamResults.team1Distances.swimDistance}
            team2Distance={teamResults.team2Distances.swimDistance}
            percentage={teamResults.swimPercentage}
            sportTypeId={SportTypeIds.swimming}
          ></TeamProgress>

          <TeamProgress
            team1Distance={teamResults.team1Distances.bikeDistance}
            team2Distance={teamResults.team2Distances.bikeDistance}
            percentage={teamResults.bikePercentage}
            sportTypeId={SportTypeIds.bike}
          ></TeamProgress>

          <TeamProgress
            team1Distance={teamResults.team1Distances.runDistance}
            team2Distance={teamResults.team2Distances.runDistance}
            percentage={teamResults.runPercentage}
            sportTypeId={SportTypeIds.running}
          ></TeamProgress>

          <ActivitiesFeed activities={activities}></ActivitiesFeed>
        </div>
      </main>
    </div>
  );
}
