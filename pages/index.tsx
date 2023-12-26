import Head from 'next/head'
import Image from 'next/image'
import clientPromise from '../lib/mongodb'
import { IActivity } from 'garmin-connect/dist/garmin/types';

export async function getServerSideProps() {
  try {
    const client = await clientPromise;
    const db = client.db("schlusslicht");

    const activities = await client
      .db("schlusslicht")
      .collection("activities")
      .find()
      .toArray();

    return {
      props: { activities: JSON.parse(JSON.stringify(activities)) },
    };
  } catch (e) {
    console.error(e);
  }
}

export default function Home({ activities }) {//: InferGetServerSidePropsType<typeof getServerSideProps>) {

  const profileImageWidth = 60;

  const arthurGarminId = 'Springer.arthur';
  const waldiGarminId = 'f8d6b455-0aec-4c46-b3e1-5621cac1719f';
  const danielGarminId = '6d29db1b-2cc2-4d32-b63c-479a1fa38471';
  const rolandGarminId = '97e62216-5e5d-42b2-a7d1-f9452a5363b4';

  const alexHGarminId = '1690439f-a46f-4079-9709-33ffa337c80c';
  const alexSGarminId = 'skipper2193';
  const janGarminId = '20434747-96b2-4592-be63-6cf0c93d42ce';
  const thomasGarminId = 'b936a5d7-ed2f-4ca6-a535-25e6d25707bc';

  const team1Activities = activities.filter(activity => activity.ownerDisplayName == arthurGarminId || activity.ownerDisplayName == waldiGarminId || activity.ownerDisplayName == danielGarminId || activity.ownerDisplayName == rolandGarminId);
  const team2Activities = activities.filter(activity => activity.ownerDisplayName == alexHGarminId || activity.ownerDisplayName == alexSGarminId || activity.ownerDisplayName == janGarminId || activity.ownerDisplayName == thomasGarminId);

  var team1_swim = getTotalSumOfDistanz(team1Activities, 5);
  var team1_bike = getTotalSumOfDistanz(team1Activities, 2);
  var team1_run = getTotalSumOfDistanz(team1Activities, 1);

  var team2_swim = getTotalSumOfDistanz(team2Activities, 5);
  var team2_bike = getTotalSumOfDistanz(team2Activities, 2);
  var team2_run = getTotalSumOfDistanz(team2Activities, 1);

  var team1Points = 0;
  if (team1_swim > team2_swim) { team1Points++; }
  if (team1_bike > team2_bike) { team1Points++; }
  if (team1_run > team2_run) { team1Points++; }

  var team2Points = 0;
  if (team2_swim > team1_swim) { team2Points++; }
  if (team2_bike > team1_bike) { team2Points++; }
  if (team2_run > team1_run) { team2Points++; }

  var team1PokalWidth = 105;
  var team1PokalHeight = 258;
  var team2PokalWidth = 105;
  var team2PokalHeight = 258;

  var team1wins = team1Points > team2Points
  if (team1wins) {
    var team1PokalWidth = 115;
    var team1PokalHeight = 282;
  }
  var team2wins = team2Points > team1Points
  if (team2wins) {
    var team2PokalWidth = 115;
    var team2PokalHeight = 282;
  }

  var sumSwim = team1_swim + team2_swim;
  var percentSwim = team1_swim / sumSwim * 100;

  var sumBike = team1_bike + team2_bike;
  var percentBike = team1_bike / sumBike * 100;

  var sumRun = team1_run + team2_run;
  var percentRun = team1_run / sumRun * 100;

  return (
    <div className="container">
      <Head>
        <title>Punktestand</title>
      </Head>

      <main>
        <div className="container mt-4 main-content text-center">
          <div className="row justify-content-center">
            <div className="col-2 mt-5 profile-icons text-end">
              <Image src="/Daniel.png" width={profileImageWidth} height={profileImageWidth} className="mb-2 profile-icon profile-left" alt="Daniel" />
              <Image src="/Waldi.png" width={profileImageWidth} height={profileImageWidth} className="mb-2 profile-icon" alt="Waldi" />
              <Image src="/Roland.png" width={profileImageWidth} height={profileImageWidth} className="mb-2 profile-icon" alt="Roland" />
              <Image src="/Arthur.png" width={profileImageWidth} height={profileImageWidth} className="mb-2 profile-icon profile-left" alt="Arthur" />
            </div>

            <div className="col-2 pokal">
              <h1 className="points"><span id="points-left">{team1Points}</span> : <span id="points-right">{team2Points}</span></h1>
              <Image src="/Pokal-links.png" width={team1PokalWidth} height={team1PokalHeight} alt="Pokal Team Blau" id="pokal-left" className={"img-fluid mb-2 pokal-part" + team1wins ? "pokal-winner" : ""} />
              <Image src="/Pokal-rechts.png" width={team2PokalWidth} height={team2PokalHeight} alt="Pokal Team Rot" id="pokal-right" className={"img-fluid mb-2 pokal-part" + team2wins ? "pokal-winner" : ""} />
            </div>

            <div className="col-2 mt-5 profile-icons text-start">
              <Image src="/AlexH.png" width={profileImageWidth} height={profileImageWidth} className="mb-2 profile-icon profile-right" alt="Alex H." />
              <Image src="/AlexS.png" width={profileImageWidth} height={profileImageWidth} className="mb-2 profile-icon" alt="Alex S." />
              <Image src="/Thomas.png" width={profileImageWidth} height={profileImageWidth} className="mb-2 profile-icon" alt="Thomas" />
              <Image src="/Jan.jpg" width={profileImageWidth} height={profileImageWidth} className="mb-2 profile-icon profile-right" alt="Jan" />
            </div>
          </div>

          <div id="progress-container">
            <div className="progress">
              <div id="progress-bar-swim" className="progress-bar" role="progressbar" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100} style={{ 'width': percentSwim + '%' }}>
                <div className="progress-text text1">{team1_swim.toFixed(3)}</div>
                <div className="progress-text text2">🏊</div>
                <div className="progress-text text3">{team2_swim.toFixed(3)}</div>
              </div>
            </div>
          </div>
          <div id="progress-container">
            <div className="progress">
              <div id="progress-bar-bike" className="progress-bar" role="progressbar" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100} style={{ 'width': percentBike + '%' }}>
                <div className="progress-text text1">{team1_bike.toFixed(3)}</div>
                <div className="progress-text text2">🚴</div>
                <div className="progress-text text3">{team2_bike.toFixed(3)}</div>
              </div>
            </div>
          </div>
          <div id="progress-container">
            <div className="progress">
              <div id="progress-bar-run" className="progress-bar" role="progressbar" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100} style={{ 'width': percentRun + '%' }} >
                <div className="progress-text text1">{team1_run.toFixed(3)}</div>
                <div className="progress-text text2">🏃</div>
                <div className="progress-text text3">{team2_run.toFixed(3)}</div>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  )
}

function getTotalSumOfDistanz(team1Activities: IActivity[], sportTypeId: number) {
  var sumDistance = 0;
  team1Activities.filter(activity => activity.sportTypeId == sportTypeId).forEach(function(activity) {
    sumDistance += (activity.distance / 1000);
  });

  return sumDistance;
}

