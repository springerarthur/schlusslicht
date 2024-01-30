import Head from "next/head";

import { Team1, Team2 } from "../datastore/Teams";

import { getTeamResults } from "../utilities/TeamResultsCalculator";

import ActivityService from "../lib/ActivityService";
import { useEffect, useState } from "react";
import ActivitiesFeed from "../components/activities/ActivitiesFeed";
import TeamProgress from "../components/team-progress";
import TeamScore from "../components/team-score";
import { SportType } from "../lib/GarminConstants";
import { TeamResults } from "../types/TeamResults";

export async function getServerSideProps() {
  try {
    const startDate = new Date(2024, 0, 1);
    const endDate = new Date(2024, 0, 31);
    const activityService = new ActivityService();
    const activities = await activityService.findActivities({date: {startDate: startDate, endDate: endDate}});

    const teamResults = getTeamResults(
      activities,
      Team1,
      Team2
    );

    return {
      props: { teamResults: JSON.parse(JSON.stringify(teamResults)) },
    };
  } catch (e) {
    console.error(e);
  }
  return {
    props: { teamResults: { teamResults: [{}] } },
  };
}

export default function TeamChallenge({
  teamResults,
}: {
  teamResults: TeamResults;
}) {
  const [results, setTeamResults] = useState<TeamResults>(teamResults);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    let updateCompleted = false;

    setTimeout(() => {
      if (!updateCompleted) {
        setLoading(true);
      }
    }, 1000);

    fetch("/api/update")
      .then((res) => res.json())
      .then((data) => {
        const teamResults = getTeamResults(
          data,
          Team1,
          Team2
        );

        setTeamResults(teamResults);
        setLoading(false);
        updateCompleted = true;
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        updateCompleted = true;
      });
  }, []);

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
          <TeamScore teamResults={results}></TeamScore>

          <TeamProgress
            team1Distance={results.team1Distances.swimDistance}
            team2Distance={results.team2Distances.swimDistance}
            sportTypeId={SportType.SWIMMING}
          ></TeamProgress>

          <TeamProgress
            team1Distance={results.team1Distances.bikeDistance}
            team2Distance={results.team2Distances.bikeDistance}
            sportTypeId={SportType.BIKE}
          ></TeamProgress>

          <TeamProgress
            team1Distance={results.team1Distances.runDistance}
            team2Distance={results.team2Distances.runDistance}
            sportTypeId={SportType.RUNNING}
          ></TeamProgress>

          <ActivitiesFeed leftTeam={Team1} rightTeam={Team2}></ActivitiesFeed>
        </div>
      </main>
    </div>
  );
}
