import Head from "next/head";
import { useEffect, useState } from "react";
import { ChallengeResultSnapshot } from "../types/ChallengeResultSnapshot";
import {
  getCurrentPushSubscription,
  registerPushNotifications,
  unregisterPushNotifications,
} from "../notifications/pushService";

export default function Subscription() {
  return (
    <div className="container mt-4 main-content">
      <Head>
        <title>Schlusslicht Punktestand</title>
      </Head>

      <main>
        <PushSubscriptionToggleButton />
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
        alert("Es ist etwas schiefgelaufen. Lade die Seite neu und versuche es noch mal.");
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
