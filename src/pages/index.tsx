import Head from "next/head";
import { useEffect, useState } from "react";
import FlipMove from "react-flip-move";

import { ChallengeResult } from "../types/ChallengeResult";
import { ChallengeResultSnapshot } from "../types/ChallengeResultSnapshot";
import { SportType } from "../lib/GarminConstants";
import { IActivity } from "garmin-connect/dist/garmin/types";

import ChallengeResultCard from "../components/challenge-result-card";
import ActivitiesFeed from "../components/activities/ActivitiesFeed";
import SportTypeFilter from "../components/sport-type-filter";
import TeamChallengeProgress from "../components/team-challenge-progress";
import ChallengeOverviewTable from "../components/challenge-overview-table";

import ChallengeResultSnapshotService from "../lib/ChallengeResultService";
import ChallengeGoalService from "../lib/ChallengeGoalService";
import ChallengeProgressService from "../lib/ChallengeProgressService";

import { Users } from "../datastore/Users";
import { Team1, Team2 } from "../datastore/Teams";

// Wichtig: Asynchrone Funktion, die ein Promise<ChallengeResult[]> zurückgibt
import { calculateChallengeResults } from "../utilities/ResultsCalculator";

const goalService = new ChallengeGoalService();

// --------------------------------------------
// SSR: Lädt Snapshot, Ziele und TeamFortschritt
export async function getServerSideProps() {
  try {
    const challengeResultSnapshotService = new ChallengeResultSnapshotService();
    // ToDo  Das Snapshot kann überall raus.
    const latestChallengeResultSnapshot =
      await challengeResultSnapshotService.getLatestChallengeResultSnapshot();

    const currentWeek = goalService.getCurrentWeek();
    const currentWeekGoals = goalService.getWeeklyGoals(currentWeek);

    const progressService = new ChallengeProgressService();
    const teamProgress = await progressService.getAllTeamsProgress({
      "Winning Lions": Team1,
      "Endorphin Junkies": Team2,
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

// --------------------------------------------
// HAUPT-KOMPONENTE
export default function Challenge({
  latestChallengeResultSnapshot,
  currentWeekGoals,
  teamProgress,
}: {
  latestChallengeResultSnapshot: ChallengeResultSnapshot;
  currentWeekGoals: { cycling: number; running: number; swimming: number };
  teamProgress: {
    [key: string]: { cycling: number; running: number; swimming: number };
  };
}) {
  // React-States
  // ToDo Results sollten keine ChallengeResults sein. ChallengeResults waren für die alte Challenge bei der jeder ein Rang und Punkte hatte. Das brauchen wir hier nicht mehr.
  const [results, setChallengeResults] = useState<ChallengeResult[]>([]);

  // ToDo Ich würde hier ein teamAProgress und ein teamBProgress daraus machen,
  // ToDo Dann must du hier nicht immer mit dem Teamnamen drauf zugreiifen.
  const [localTeamProgress, setLocalTeamProgress] = useState(teamProgress);

  const [isLoading, setIsLoading] = useState(false);
  const [activitiesChanged, setActivitiesChanged] = useState(false);
  const [filter, setFilterType] = useState<SportType | undefined>(undefined);

  useEffect(() => {
    let updateCompleted = false;

    const timeoutId = setTimeout(() => {
      if (!updateCompleted) {
        setIsLoading(true);
      }
    }, 1000);

    async function loadAndCalculate() {
      try {
        const response = await fetch(
          `/api/update?startDate=${new Date(2024, 11, 30).toISOString()}`
        );
        const activities: IActivity[] = await response.json();
        const currentWeek = goalService.getCurrentWeek();
        const dateRange = goalService.getWeeklyGoalDateRange(currentWeek);
        const relevantActivities = activities.filter((activity) => {
          const start = new Date(activity.startTimeLocal);
          return start >= dateRange.startDate && start <= dateRange.endDate;
        });

        const newResults = await calculateChallengeResults(
          relevantActivities,
          Users
        );
        setChallengeResults(newResults);

        const updatedTeamProgress = calculateTeamProgressForAllActivities(
          {
            "Winning Lions": Team1,
            "Endorphin Junkies": Team2,
          },
          relevantActivities
        );
        setLocalTeamProgress(updatedTeamProgress);

        setActivitiesChanged(true);
        updateCompleted = true;
      } catch (error) {
        console.error("Error fetching or calculating:", error);
        updateCompleted = true;
      } finally {
        setIsLoading(false);
        clearTimeout(timeoutId);
      }
    }

    loadAndCalculate();

    return () => {
      updateCompleted = true;
      clearTimeout(timeoutId);
    };
  }, []);

  function calculateTeamProgressForAllActivities(
    teams: { [key: string]: { garminUserId: string }[] },
    activities: IActivity[]
  ): {
    [teamName: string]: { cycling: number; running: number; swimming: number };
  } {
    const result: {
      [teamName: string]: {
        cycling: number;
        running: number;
        swimming: number;
      };
    } = {};

    for (const [teamName, members] of Object.entries(teams)) {
      result[teamName] = { cycling: 0, running: 0, swimming: 0 };
      const memberIds = members.map((u) => u.garminUserId);

      const relevantActs = activities.filter((act) =>
        memberIds.includes(act.ownerDisplayName)
      );

      relevantActs.forEach((act) => {
        const distKm = act.distance / 1000;
        switch (act.sportTypeId) {
          case 1:
            result[teamName].running += distKm;
            break;
          case 2:
            result[teamName].cycling += distKm;
            break;
          case 5:
            result[teamName].swimming += distKm;
            break;
        }
      });
    }
    return result;
  }

  const getFilteredAndSortedTeams = (results: ChallengeResult[]) => {
    // ToDo kann entfernt werden, da wir kein Rank haben.
    const filteredResults = results.filter((result) => {
      if (!filter) return true;
      if (filter === SportType.SWIMMING) return result.swimRank !== undefined;
      if (filter === SportType.BIKE) return result.bikeRank !== undefined;
      if (filter === SportType.RUNNING) return result.runRank !== undefined;
      return true;
    });

    const teamA = filteredResults.filter((result) =>
      Team1.some((user) => user.garminUserId === result.user?.garminUserId)
    );
    const teamB = filteredResults.filter((result) =>
      Team2.some((user) => user.garminUserId === result.user?.garminUserId)
    );

    // ToDo Kann raus, da wir kein Rank haben
    function getRank(r: ChallengeResult) {
      if (filter === SportType.SWIMMING)
        return r.swimRank ?? Number.MAX_SAFE_INTEGER;
      if (filter === SportType.BIKE)
        return r.bikeRank ?? Number.MAX_SAFE_INTEGER;
      if (filter === SportType.RUNNING)
        return r.runRank ?? Number.MAX_SAFE_INTEGER;
      return r.rank ?? Number.MAX_SAFE_INTEGER;
    }

    // ToDo Kann raus, da wir kein Rank haben
    const sortTeam = (arr: ChallengeResult[]) =>
      arr.slice().sort((a, b) => getRank(a) - getRank(b));

    return {
      teamA: sortTeam(teamA),
      teamB: sortTeam(teamB),
    };
  };

  // TeamA als State, TeamB als State
  // Die Function getFilteredAndSortedTeams kann im UseEffect aufgerufen werden
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
            />
            Garmin-Aktivitäten werden aktualisiert!
          </div>
        )}

        <SportTypeFilter filter={filter} onFilterChange={setFilterType} />

        <div className="team-progress-container mt-1">
          <div className="row">
            <div className="col-md-6">
              {localTeamProgress && currentWeekGoals ? (
                <div>
                  <img
                    src="/WinningLions.webp"
                    alt="Winning Lions Logo"
                    style={{ height: "100px", marginRight: "10px" }}
                  />

                  <TeamChallengeProgress
                    teamName="Winning Lions"
                    progress={{
                      cycling: localTeamProgress["Winning Lions"]?.cycling || 0,
                      running: localTeamProgress["Winning Lions"]?.running || 0,
                      swimming:
                        localTeamProgress["Winning Lions"]?.swimming || 0,
                    }}
                    goals={currentWeekGoals}
                  />
                </div>
              ) : (
                // ToDo Hier könnte sinnvollerer Text stehen. Auch wenn die Challenge Vorbei ist, wird hier dieser Text angezeigt.
                <p>Loading Winning Lions progress...</p>
              )}

              <div className="team team-a mt-2">
                <FlipMove duration={700}>
                  {teamA.map((challengeResult) => (
                    <div key={challengeResult.user.garminUserId}>
                      <ChallengeResultCard challengeResult={challengeResult} />
                    </div>
                  ))}
                </FlipMove>
              </div>
            </div>
            <div className="col-md-6">
              {localTeamProgress && currentWeekGoals ? (
                <div>
                  <img
                    src="/EndorphinJunkies.png"
                    alt="Endorphin Junkies Logo"
                    style={{ height: "100px", marginRight: "10px" }}
                  />
                  <TeamChallengeProgress
                    teamName="Endorphin Junkies"
                    progress={{
                      cycling:
                        localTeamProgress["Endorphin Junkies"]?.cycling || 0,
                      running:
                        localTeamProgress["Endorphin Junkies"]?.running || 0,
                      swimming:
                        localTeamProgress["Endorphin Junkies"]?.swimming || 0,
                    }}
                    goals={currentWeekGoals}
                  />
                </div>
              ) : (
                <p>Loading Endorphin Junkies progress...</p>
              )}

              <div className="team team-b mt-2">
                <FlipMove duration={700}>
                  {teamB.map((challengeResult) => (
                    <div key={challengeResult.user.garminUserId}>
                      <ChallengeResultCard challengeResult={challengeResult} />
                    </div>
                  ))}
                </FlipMove>
              </div>
            </div>
          </div>
        </div>

        <ChallengeOverviewTable />

        <ActivitiesFeed
          leftTeam={Team1}
          rightTeam={Team2}
          activitiesChanged={activitiesChanged}
          startDate={new Date(2024, 11, 30)}
          endDate={new Date(2025, 1, 17)}
          filter={filter}
        />
      </main>
    </div>
  );
}
