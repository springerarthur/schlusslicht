import Head from "next/head";
import { IActivity } from "garmin-connect/dist/garmin/types";

import { User } from "../../lib/User";
import UserService from "../../lib/UserService";
import ProfileImage from "../../components/profile-image";
import ActivityService from "../../lib/ActivityService";
import { calculateTotalTimeForTeam } from "../../utilities/TeamResultsCalculator";
import { formatDuration } from "../../utilities/UiHelper";
import ActivitiesFeed from "../../components/activities/ActivitiesFeed";

export async function getServerSideProps(context) {
  const username = context.query.username;

  const userService = new UserService();
  const user = await userService.getUserByGarminUserId(username);

  const activityService = new ActivityService();
  const activities = await activityService.findActivities(
    -1,
    user?.garminUserId
  );

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
      activities: JSON.parse(JSON.stringify(activities)),
    },
  };
}

export default function UserPage({
  user,
  activities,
}: {
  user: User;
  activities: IActivity[];
}) {
  const totalTime = calculateTotalTimeForTeam(activities, [user]);
  return (
    <div className="container">
      <Head>
        <title>{user.displayName}</title>
      </Head>

      <main>
        <div className="container mt-4 main-content text-center">
          <h1>{user.displayName}</h1>
          <div>
            <ProfileImage user={user} size={250} linkToProfile={false} />
          </div>
          <div>⏱️{formatDuration(totalTime)}</div>
          <div>
            <ActivitiesFeed userId={user.garminUserId} leftTeam={[]} rightTeam={[]}></ActivitiesFeed>
          </div>
        </div>
      </main>
    </div>
  );
}
