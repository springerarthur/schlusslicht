import Head from "next/head";
import { useEffect, useState } from "react";
import { ChallengeResultSnapshot } from "../types/ChallengeResultSnapshot";
import {
  getCurrentPushSubscription,
  registerPushNotifications,
  unregisterPushNotifications,
} from "../notifications/pushService";
import PushSubscriptionToggleButton from "../components/PushSubscriptionToggleButton";

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
