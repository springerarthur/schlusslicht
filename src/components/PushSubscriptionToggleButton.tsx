import { useEffect, useState } from "react";
import {
  getCurrentPushSubscription,
  registerPushNotifications,
  unregisterPushNotifications,
} from "../notifications/pushService";
import logToServer from "../utilities/logger";

export default function PushSubscriptionToggleButton() {
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
    logToServer("setPushNotificationsEnabled enabled=" + enabled);
    setLoading(true);

    try {
      if (enabled) {
        await registerPushNotifications();
        logToServer("registerPushNotifications finished");
      } else {
        await unregisterPushNotifications();
      }
      setLoading(false);
      setHasActivePushSubscription(enabled);
    } catch (error) {
      logToServer(error);
      if (enabled && Notification.permission === "denied") {
        alert("Aktiviere Benachrichtigungen für diese Seite auf deinem Gerät!");
      } else {
        alert(
          "Es ist ein Fehler aufgetreten. Prüfe ob dein Browser Benachrichtigungen verschicken darf. Technische Fehlermeldung: " +
            error
        );
      }

      setLoading(false);
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
      {/* <button
        type="button"
        className="btn btn-link"
        onClick={() => {
          fetch("/api/webpush/test");
        }}
      >
        Test
      </button> */}
    </div>
  );
}
