import Head from "next/head";
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
