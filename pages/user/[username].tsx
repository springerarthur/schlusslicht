import Head from "next/head";

import { User } from "../../src/lib/User";
import UserService from "../../src/lib/UserService";
import ProfileImage from "../../components/profile-image";
import { IActivity } from "garmin-connect/dist/garmin/types";
import ActivityService from "../../src/lib/ActivityService";
import ActivitiesFeed from "../../components/activities/activities-feed";

export async function getServerSideProps(context) {
  const username = context.query.username;

  const userService = new UserService();
  const user = await userService.getUserByGarminUserId(username);

  const activityService = new ActivityService();
  const activities = await activityService.getActivitiesForUser(user?.garminUserId);

  return {
    props: { user: JSON.parse(JSON.stringify(user)), activities: JSON.parse(JSON.stringify(activities)) },
  };
}

// Create the user page component
export default function UserPage({ user, activities }: { user: User, activities: IActivity[] }) {
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
          <div>
            <ActivitiesFeed initialActivities={activities}></ActivitiesFeed>
          </div>
        </div>
      </main>
    </div>
  );
}
