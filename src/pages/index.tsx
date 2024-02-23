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
  const [filter, setFilterType] = useState<SportType | undefined>(undefined);

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

        await fetch("/api/webpush/notifyAllSubscriptions");
      } finally {
        setIsLoading(false);
      }
    };

    updateChallengeResults();
  }, [latestChallengeResultSnapshot.creationTime]);

  const getSortedResults = () => {
    return results.slice().sort((result1, result2) => {
      if (filter === SportType.SWIMMING) {
        return result1.swimRank - result2.swimRank;
      }
      if (filter === SportType.BIKE) {
        return result1.bikeRank - result2.bikeRank;
      }
      if (filter === SportType.RUNNING) {
        return result1.runRank - result2.runRank;
      }
      return result1.rank - result2.rank;
    });
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
            ></div>
            Garmin-Aktivitäten werden aktualisiert!
          </div>
        )}

        <SportTypeFilter
          filter={filter}
          onFilterChange={setFilterType}
        ></SportTypeFilter>
        <FlipMove duration={700}>
          {getSortedResults().map((challengeResult: ChallengeResult) => {
            return (
              <div key={challengeResult.user.garminUserId}>
                <ChallengeResultCard
                  challengeResult={challengeResult}
                ></ChallengeResultCard>
              </div>
            );
          })}
        </FlipMove>

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
