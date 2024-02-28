import { useEffect, useState } from "react";
import {
  getCurrentPushSubscription,
  registerPushNotifications,
  unregisterPushNotifications,
} from "../notifications/pushService";

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

  if (loading) {
    return (
      <div className="mb-3 ms-4 px-3 py-2 btn btn-primary bg-custom">
        <span
          className="spinner-border spinner-border-sm text-info"
          role="status"
        ></span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPushNotificationsEnabled(!hasActivePushSubscription)}
      className={
        hasActivePushSubscription
          ? "mb-3 ms-4 px-3 py-2 btn btn-primary"
          : "mb-3 ms-4 px-3 py-2 btn btn-primary bg-custom"
      }
    >
      🔔
    </button>
  );
}
