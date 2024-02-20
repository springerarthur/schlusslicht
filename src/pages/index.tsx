import Head from "next/head";
import { ChallengeResult } from "../types/ChallengeResult";
import ChallengeResultCard from "../components/challenge-result-card";
import ActivitiesFeed from "../components/activities/ActivitiesFeed";
import ChallengeResultSnapshotService from "../lib/ChallengeResultService";
import { useEffect, useState } from "react";
import { ChallengeResultSnapshot } from "../types/ChallengeResultSnapshot";
import { SportType } from "../lib/GarminConstants";
import SportTypeFilter from "../components/sport-type-filter";

export async function getServerSideProps() {
  try {
    const challengeResultSnapshotService = new ChallengeResultSnapshotService();
    const latestChallengeResultSnapshot =
      await challengeResultSnapshotService.getLatestChallengeResultSnapshot();

    return {
      props: {
        latestChallengeResultSnapshot: JSON.parse(
          JSON.stringify(latestChallengeResultSnapshot)
        ),
      },
    };
  } catch (e) {
    console.error(e);
  }
  return {
    props: {
      latestChallengeResultSnapshot: { latestChallengeResultSnapshot: {} },
    },
  };
}

export default function Challenge({
  latestChallengeResultSnapshot,
}: {
  latestChallengeResultSnapshot: ChallengeResultSnapshot;
}) {
  const [results, setChallengeResults] = useState<ChallengeResult[]>(
    latestChallengeResultSnapshot.results
  );
  const [isLoading, setIsLoading] = useState(false);
  const [activitiesChanged, setActivitiesChanged] = useState(false);
  const [filter, setFilterType] = useState<SportType | undefined>(
    undefined
  );

  useEffect(() => {
    const updateChallengeResults = async () => {
      if (!updateIsRequired(latestChallengeResultSnapshot.creationTime)) {
        return;
      }

      try {
        setIsLoading(true);

        await fetch("/api/update/challengeResults")
          .then((res) => res.json())
          .then((challengeResults) => {
            setChallengeResults(challengeResults);
            setActivitiesChanged(true);
          });
      } finally {
        setIsLoading(false);
      }
    };

    updateChallengeResults();
  }, [latestChallengeResultSnapshot.creationTime]);

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

        <SportTypeFilter
          filter={filter}
          onFilterChange={setFilterType}
        ></SportTypeFilter>

        {results.map((challengeResult: ChallengeResult) => {
          return (
            <ChallengeResultCard
              key={challengeResult.user.garminUserId}
              challengeResult={challengeResult}
            ></ChallengeResultCard>
          );
        })}

        <ActivitiesFeed
          leftTeam={[]}
          rightTeam={[]}
          activitiesChanged={activitiesChanged}
          startDate={new Date(2024, 1, 1)}
          endDate={new Date(2024, 8, 31)}
          filter={filter}
        ></ActivitiesFeed>
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
