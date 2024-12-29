import Head from "next/head";
import { ChallengeResult } from "../types/ChallengeResult";
import ChallengeResultCard from "../components/challenge-result-card";
import ActivitiesFeed from "../components/activities/ActivitiesFeed";
import ChallengeResultSnapshotService from "../lib/ChallengeResultService";
import { useEffect, useState } from "react";
import { ChallengeResultSnapshot } from "../types/ChallengeResultSnapshot";
import { SportType } from "../lib/GarminConstants";
import SportTypeFilter from "../components/sport-type-filter";
import FlipMove from "react-flip-move";
import { Team1, Team2 } from "../datastore/Teams";
import TeamChallengeProgress from "../components/team-challenge-progress";
import ChallengeOverviewTable from "../components/challenge-overview-table";
import ChallengeGoalService from "../lib/ChallengeGoalService";
import ChallengeProgressService from "../lib/ChallengeProgressService";

// Ziele werden dynamisch aus ChallengeGoalService geladen
const goalService = new ChallengeGoalService();

export async function getServerSideProps() {
  try {
    const challengeResultSnapshotService = new ChallengeResultSnapshotService();
    const latestChallengeResultSnapshot =
      await challengeResultSnapshotService.getLatestChallengeResultSnapshot();

    // Lade wöchentliche Ziele
    const currentWeek = goalService.getCurrentWeek();
    const currentWeekGoals = goalService.getWeeklyGoals(currentWeek);

    // Lade Fortschritt der Teams
    const progressService = new ChallengeProgressService();
    const teamProgress = await progressService.getAllTeamsProgress({
      "Winning Lions": Team1,
      "Moody Students": Team2,
    });

    return {
      props: {
        latestChallengeResultSnapshot: JSON.parse(
          JSON.stringify(latestChallengeResultSnapshot)
        ),
        currentWeekGoals,
        teamProgress,
      },
    };
  } catch (e) {
    console.error(e);
    return {
      props: {
        latestChallengeResultSnapshot: { latestChallengeResultSnapshot: {} },
        currentWeekGoals: null,
        teamProgress: null,
      },
    };
  }
}

export default function Challenge({
  latestChallengeResultSnapshot,
  currentWeekGoals,
  teamProgress,
}: {
  latestChallengeResultSnapshot: ChallengeResultSnapshot;
  currentWeekGoals: { cycling: number; running: number; swimming: number };
  teamProgress: { [key: string]: { cycling: number; running: number; swimming: number } };
}) {
  const [results, setChallengeResults] = useState<ChallengeResult[]>(
    latestChallengeResultSnapshot.results
  );
  const [isLoading, setIsLoading] = useState(false);
  const [activitiesChanged, setActivitiesChanged] = useState(false);
  const [filter, setFilterType] = useState<SportType | undefined>(undefined);

  useEffect(() => {
    async function syncPushSubscription() {
      console.warn("Push subscription sync is not implemented.");
    }
    syncPushSubscription();
  }, []);

  const getFilteredAndSortedTeams = (results: ChallengeResult[]) => {
    const filteredResults = results.filter((result) => {
      if (!filter) return true;
      return (
        (filter === SportType.SWIMMING && result.swimRank !== undefined) ||
        (filter === SportType.BIKE && result.bikeRank !== undefined) ||
        (filter === SportType.RUNNING && result.runRank !== undefined)
      );
    });

    const teamA = filteredResults.filter((result) =>
      Team1.some((user) => user.garminUserId === result.user.garminUserId)
    );
    const teamB = filteredResults.filter((result) =>
      Team2.some((user) => user.garminUserId === result.user.garminUserId)
    );

    const sortResults = (team: ChallengeResult[]) => {
      return team.slice().sort((result1, result2) => {
        if (filter === SportType.SWIMMING) return result1.swimRank - result2.swimRank;
        if (filter === SportType.BIKE) return result1.bikeRank - result2.bikeRank;
        if (filter === SportType.RUNNING) return result1.runRank - result2.runRank;
        return result1.rank - result2.rank;
      });
    };

    return {
      teamA: sortResults(teamA),
      teamB: sortResults(teamB),
    };
  };

  const { teamA, teamB } = getFilteredAndSortedTeams(results);

  return (
    <div className="container mt-4 main-content">
      <Head>
        <title>Schlusslicht Punktestand</title>
      </Head>

      <main>
        {isLoading && (
          <div className="alert alert-info fixed-top update-activities">
            <div
              className="spinner-border spinner-border-sm text-info me-2"
              role="status"
            ></div>
            Garmin-Aktivitäten werden aktualisiert!
          </div>
        )}

        <SportTypeFilter filter={filter} onFilterChange={setFilterType} />

        <div className="team-progress-container mt-5">
          <h3>Team Fortschritt</h3>
          <div className="row">
            <div className="col-md-6">
              {teamProgress && currentWeekGoals ? (
                <TeamChallengeProgress
                  teamName="Winning Lions"
                  progress={{
                    cycling: teamProgress["Winning Lions"]?.cycling || 0,
                    running: teamProgress["Winning Lions"]?.running || 0,
                    swimming: teamProgress["Winning Lions"]?.swimming || 0,
                  }}
                  goals={currentWeekGoals}
                />
              ) : (
                <p>Loading Winning Lions progress...</p>
              )}
            </div>
            <div className="col-md-6">
              {teamProgress && currentWeekGoals ? (
                <TeamChallengeProgress
                  teamName="Moody Students"
                  progress={{
                    cycling: teamProgress["Moody Students"]?.cycling || 0,
                    running: teamProgress["Moody Students"]?.running || 0,
                    swimming: teamProgress["Moody Students"]?.swimming || 0,
                  }}
                  goals={currentWeekGoals}
                />
              ) : (
                <p>Loading Moody Students progress...</p>
              )}
            </div>
          </div>
        </div>

        <div className="teams-container">
          <div className="team team-a">
            <h2>
              <img
                src="/WinningLions.webp"
                alt="Winning Lions Logo"
                style={{ height: "100px", marginRight: "10px" }}
              />
              Winning Lions
            </h2>
            <FlipMove duration={700}>
              {teamA.map((challengeResult: ChallengeResult) => (
                <div key={challengeResult.user.garminUserId}>
                  <ChallengeResultCard challengeResult={challengeResult} />
                </div>
              ))}
            </FlipMove>
          </div>

          <div className="team team-b">
            <h2>
              <img
                src="/MoodyStudents.webp"
                alt="Moody Students Logo"
                style={{ height: "100px", marginRight: "10px" }}
              />
              Moody Students
            </h2>
            <FlipMove duration={700}>
              {teamB.map((challengeResult: ChallengeResult) => (
                <div key={challengeResult.user.garminUserId}>
                  <ChallengeResultCard challengeResult={challengeResult} />
                </div>
              ))}
            </FlipMove>
          </div>
        </div>

        <ChallengeOverviewTable />

        <ActivitiesFeed
          leftTeam={Team1}
          rightTeam={Team2}
          activitiesChanged={activitiesChanged}
          startDate={new Date(2024, 11, 30)}
          endDate={new Date(2024, 1, 17)}
          filter={filter}
        />
      </main>
    </div>
  );
}

function updateIsRequired(lastUpdate: Date): boolean {
  const updateInterval = 30 * 60 * 1000; /* 30 minutes */

  return (
    new Date().getTime() - new Date(lastUpdate).getTime() >= updateInterval
  );
}
