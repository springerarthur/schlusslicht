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
import {
  getCurrentPushSubscription,
  registerPushNotifications,
  sendPushSubscriptionToServer,
  unregisterPushNotifications,
} from "../notifications/pushService";

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
    async function syncPushSubscription() {
      try {
        const subscription = await getCurrentPushSubscription();
        if (subscription) {
          await sendPushSubscriptionToServer(subscription);
        }
      } catch (error) {
        console.error(error);
      }
    }

    syncPushSubscription();
  }, []);

  useEffect(() => {
    if (filter === undefined) {
      return;
    }

    fetch("/api/webpush/notifyAllSubscriptions");
  }, [filter]);

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

        <PushSubscriptionToggleButton />
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

function PushSubscriptionToggleButton() {
  const [hasActivePushSubscription, setHasActivePushSubscription] =
    useState<boolean>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getActivePushSubscription() {
      const subscription = await getCurrentPushSubscription();
      setHasActivePushSubscription(!!subscription);
    }
    getActivePushSubscription();
  }, []);

  async function setPushNotificationsEnabled(enabled: boolean) {
    if (loading) {
      return;
    }
    setLoading(true);

    try {
      if (enabled) {
        await registerPushNotifications();
      } else {
        await unregisterPushNotifications();
      }
      setLoading(false);
      setHasActivePushSubscription(enabled);
    } catch (error) {
      console.error(error);
      if (enabled && Notification.permission === "denied") {
        alert("Aktiviere Benachrichtigungen für diese Seite auf deinem Gerät!");
      } else {
        alert("Es ist etwas unerwartetes schiefgelaufen.");
      }
    }
  }

  if (hasActivePushSubscription === undefined) {
    return null;
  }

  return (
    <div className="relative">
      {loading && (
        <div
          className="spinner-border spinner-border-sm text-info me-2"
          role="status"
        ></div>
      )}
      {hasActivePushSubscription ? (
        <span
          role="button"
          title="Benachrichtigungne deaktivieren"
          onClick={() => setPushNotificationsEnabled(false)}
          className="h1"
        >
          🔕
        </span>
      ) : (
        <span
          role="button"
          title="Benachrichtigungne aktivieren"
          onClick={() => setPushNotificationsEnabled(true)}
          className="h1"
        >
          🔔
        </span>
      )}
    </div>
  );
}

function updateIsRequired(lastUpdate: Date): boolean {
  const updateInterval = 30 * 60 * 1000; /* 30 minutes */

  return (
    new Date().getTime() - new Date(lastUpdate).getTime() >= updateInterval
  );
}
