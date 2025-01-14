import Head from "next/head";
import { useEffect, useState } from "react";
import FlipMove from "react-flip-move";


import { TeamChallengeResult } from "../types/TeamChallengeResult";
import { Distances } from "../types/Distances"
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
const TEAM_A = "Winning Lions";
const TEAM_B = "Endorphin Junkies";
// --------------------------------------------
// SSR: Lädt Snapshot, Ziele und TeamFortschritt
export async function getServerSideProps() {
  try {

    const currentWeek = goalService.getCurrentWeek();
    const currentWeekGoals = goalService.getWeeklyGoals(currentWeek);

    const progressService = new ChallengeProgressService();
    const teamProgress = await progressService.getAllTeamsProgress({
      [TEAM_A]: Team1,
      [TEAM_B]: Team2,
    });

    return {
      props: {
        currentWeekGoals,
        teamProgress,
      },
    };
  } catch (e) {
    console.error(e);
    return {
      props: {
        currentWeekGoals: null,
        teamProgress: null,
      },
    };
  }
}

// --------------------------------------------
// HAUPT-KOMPONENTE
export default function Challenge({
  currentWeekGoals,
  teamProgress,
}: {
  currentWeekGoals: { cycling: number; running: number; swimming: number };
  teamProgress: {
    [key: string]: { cycling: number; running: number; swimming: number };
  };
}) {
  // React-States
  const [results, setChallengeResults] = useState<TeamChallengeResult[]>([]);

  const [teamAProgress, setTeamAProgress] = useState(teamProgress[TEAM_A]);
  const [teamBProgress, setTeamBProgress] = useState(teamProgress[TEAM_B]);
  const [isLoading, setIsLoading] = useState(false);
  const [activitiesChanged, setActivitiesChanged] = useState(false);
  const [filter, setFilterType] = useState<SportType | undefined>(undefined);

  const [teamA, setTeamA] = useState<TeamChallengeResult[]>([]);
  const [teamB, setTeamB] = useState<TeamChallengeResult[]>([]);

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
            [TEAM_A]: Team1,
            [TEAM_B]: Team2,
          },
          relevantActivities
        );
        setTeamAProgress(updatedTeamProgress[TEAM_A]);
        setTeamBProgress(updatedTeamProgress[TEAM_B]);

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

  useEffect(() => {
    const { teamA: newTeamA, teamB: newTeamB } = getFilteredAndSortedTeams(results);
    setTeamA(newTeamA);
    setTeamB(newTeamB);
  }, [results]);

  const getFilteredAndSortedTeams = (results: TeamChallengeResult[]) => {
    const teamA = results.filter((result) =>
      Team1.some((user) => user.garminUserId === result.user?.garminUserId)
    );
    const teamB = results.filter((result) =>
      Team2.some((user) => user.garminUserId === result.user?.garminUserId)
    );

    return {
      teamA,
      teamB
    };
  };

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
              {teamAProgress && currentWeekGoals ? (
                <div>
                  <img
                    src="/WinningLions.webp"
                    alt="Winning Lions Logo"
                    style={{ height: "100px", marginRight: "10px" }}
                  />

                  <TeamChallengeProgress
                    teamName={TEAM_A}
                    progress={teamAProgress}
                    goals={currentWeekGoals}
                  />
                </div>
              ) : (
                <p>Challenge Daten konnten nicht geladen werden</p>
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
              {teamBProgress && currentWeekGoals ? (
                <div>
                  <img
                    src="/EndorphinJunkies.png"
                    alt="Endorphin Junkies Logo"
                    style={{ height: "100px", marginRight: "10px" }}
                  />
                  <TeamChallengeProgress
                    teamName={TEAM_B}
                    progress={teamBProgress}
                    goals={currentWeekGoals}
                  />
                </div>
              ) : (
                <p>Challenge Daten konnten nicht geladen werden</p>
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
