import Head from "next/head";
import ActivityService from "../lib/ActivityService";
import { getResults as getChallengeResults } from "../utilities/ResultsCalculator";
import { Users } from "../datastore/Users";
import { ChallengeResult } from "../types/ChallengeResult";
import ChallengeResultCard from "../components/challenge-result-card";
import ActivitiesFeed from "../components/activities/ActivitiesFeed";

export async function getServerSideProps() {
  try {
    const startDate = new Date(2024, 0, 1);
    const endDate = new Date(2024, 0, 31);
    const activityService = new ActivityService();
    const activities = await activityService.findActivities({date: {startDate: startDate, endDate: endDate}});

    const challengeResults = await getChallengeResults(activities, Users);

    return {
      props: { challengeResults: JSON.parse(JSON.stringify(challengeResults)) },
    };
  } catch (e) {
    console.error(e);
  }
  return {
    props: { challengeResults: { challengeResults: [{}] } },
  };
}

export default function Challenge({
  challengeResults,
}: {
  challengeResults: ChallengeResult[];
}) {
  return (
    <div className="container mt-4 main-content">
      <Head>
        <title>Schlusslicht Punktestand</title>
      </Head>

      <main>
        {challengeResults.map((challengeResult: ChallengeResult) => {
          return (
            <ChallengeResultCard
              key={challengeResult.user.garminUserId}
              challengeResult={challengeResult}
            ></ChallengeResultCard>
          );
        })}

        <ActivitiesFeed leftTeam={[]} rightTeam={[]}></ActivitiesFeed>
      </main>
    </div>
  );
}
