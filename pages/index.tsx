import Head from 'next/head'
import Image from 'next/image'
import clientPromise from '../lib/mongodb'
import { IActivity } from 'garmin-connect/dist/garmin/types';
import GarminConnectSync from '../lib/GarminConnectSync';
import { GarminUserIds, SportTypeIds } from '../lib/GarminConstants';
import moment from 'moment';
import 'moment/locale/de';

moment.locale('de');

export async function getServerSideProps() {
  const garminConnectSync = new GarminConnectSync();
  await garminConnectSync.importDataFromGarminConnect();

  try {
    const client = await clientPromise;

    const activities = await client
      .db("schlusslicht")
      .collection("activities")
      .find()
      .sort({ startTimeLocal: -1 })
      .toArray();

    return {
      props: { activities: JSON.parse(JSON.stringify(activities)) },
    };
  } catch (e) {
    console.error(e);
  }

  return {
    props: { activities: { activities: [{}] } },
  };
}

export default function Home({ activities }) {
  if (activities == undefined) {
    return (
      <div className="alert alert-danger" role="alert">
        Fehler biem Laden der Daten!
      </div>
    );
  }

  let lastTimelineMarkerText: string;

  const profileImageWidth = 60;

  const team1Activities = activities.filter(activity => activity.ownerDisplayName == GarminUserIds.arthur || activity.ownerDisplayName == GarminUserIds.waldi || activity.ownerDisplayName == GarminUserIds.daniel || activity.ownerDisplayName == GarminUserIds.roland);
  const team2Activities = activities.filter(activity => activity.ownerDisplayName == GarminUserIds.alexH || activity.ownerDisplayName == GarminUserIds.alexS || activity.ownerDisplayName == GarminUserIds.jan || activity.ownerDisplayName == GarminUserIds.thomas);

  var team1_swim = getTotalSumOfDistanz(team1Activities, SportTypeIds.swimming);
  var team1_bike = getTotalSumOfDistanz(team1Activities, SportTypeIds.bike);
  var team1_run = getTotalSumOfDistanz(team1Activities, SportTypeIds.running);

  var team2_swim = getTotalSumOfDistanz(team2Activities, SportTypeIds.swimming);
  var team2_bike = getTotalSumOfDistanz(team2Activities, SportTypeIds.bike);
  var team2_run = getTotalSumOfDistanz(team2Activities, SportTypeIds.running);

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

  function getActivityTeamClassName(ownerDisplayName: string) {
    if (ownerDisplayName == GarminUserIds.arthur || ownerDisplayName == GarminUserIds.waldi || ownerDisplayName == GarminUserIds.daniel || ownerDisplayName == GarminUserIds.roland) {
      return 'activity-left';
    }
    if (ownerDisplayName == GarminUserIds.alexH || ownerDisplayName == GarminUserIds.alexS || ownerDisplayName == GarminUserIds.thomas || ownerDisplayName == GarminUserIds.jan) {
      return 'activity-right';
    }
  }

  function getProfielImage(ownerDisplayName: string): string {
    if (ownerDisplayName == GarminUserIds.arthur) {
      return "/Arthur.png"
    }
    if (ownerDisplayName == GarminUserIds.waldi) {
      return "/Waldi.png"
    }
    if (ownerDisplayName == GarminUserIds.daniel) {
      return "/Daniel.png"
    }
    if (ownerDisplayName == GarminUserIds.roland) {
      return "/Roland.png"
    }
    if (ownerDisplayName == GarminUserIds.alexH) {
      return "/AlexH.png"
    }
    if (ownerDisplayName == GarminUserIds.alexS) {
      return "/AlexS.png"
    }
    if (ownerDisplayName == GarminUserIds.jan) {
      return "/Jan.png"
    }
    if (ownerDisplayName == GarminUserIds.thomas) {
      return "/Thomas.png"
    }

    return "";
  }

  function getSportIdIcon(sportTypeId: number): string {
    if (sportTypeId === SportTypeIds.running) {
      return "🏃";
    }
    if (sportTypeId === SportTypeIds.bike) {
      return "🚴";
    }
    if (sportTypeId === SportTypeIds.swimming) {
      return "🏊";
    }
    return "";
  }

  return (
    <div className="container">
      <Head>
        <title>Punktestand</title>
      </Head>

      <main>
        <div className="container mt-4 main-content text-center">
          <div className="row justify-content-center">

            <div className="alert alert-danger" style={{ display: Object.keys(activities).length === 0 ? 'visible' : 'none' }} role="alert">
              Es konnten keine Daten geladen werden!
            </div>

            <div className="col-2 mt-5 profile-icons text-end">
              <Image src="/Daniel.png" width={profileImageWidth} height={profileImageWidth} className="mb-2 rounded-circle profile-left" alt="Daniel" />
              <Image src="/Waldi.png" width={profileImageWidth} height={profileImageWidth} className="mb-2 rounded-circle" alt="Waldi" />
              <Image src="/Roland.png" width={profileImageWidth} height={profileImageWidth} className="mb-2 rounded-circle" alt="Roland" />
              <Image src="/Arthur.png" width={profileImageWidth} height={profileImageWidth} className="mb-2 rounded-circle profile-left" alt="Arthur" />
            </div>

            <div className="col-2 pokal">
              <h1 className="points"><span id="points-left">{team1Points}</span> : <span id="points-right">{team2Points}</span></h1>
              <Image src="/Pokal-links.png" width={team1PokalWidth} height={team1PokalHeight} alt="Pokal Team Blau" id="pokal-left" className={"img-fluid mb-2 pokal-part" + team1wins ? "pokal-winner" : ""} />
              <Image src="/Pokal-rechts.png" width={team2PokalWidth} height={team2PokalHeight} alt="Pokal Team Rot" id="pokal-right" className={"img-fluid mb-2 pokal-part" + team2wins ? "pokal-winner" : ""} />
            </div>

            <div className="col-2 mt-5 profile-icons text-start">
              <Image src="/AlexH.png" width={profileImageWidth} height={profileImageWidth} className="mb-2 rounded-circle profile-right" alt="Alex H." />
              <Image src="/AlexS.png" width={profileImageWidth} height={profileImageWidth} className="mb-2 rounded-circle" alt="Alex S." />
              <Image src="/Thomas.png" width={profileImageWidth} height={profileImageWidth} className="mb-2 rounded-circle" alt="Thomas" />
              <Image src="/Jan.jpg" width={profileImageWidth} height={profileImageWidth} className="mb-2 rounded-circle profile-right" alt="Jan" />
            </div>
          </div>

          <div id="progress-container">
            <div className="progress">
              <div id="progress-bar-swim" className="progress-bar" role="progressbar" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100} style={{ 'width': percentSwim + '%' }}>
                <div className="progress-text text1">{team1_swim.toFixed(2)}</div>
                <div className="progress-text text2">🏊</div>
                <div className="progress-text text3">{team2_swim.toFixed(2)}</div>
              </div>
            </div>
          </div>
          <div id="progress-container">
            <div className="progress">
              <div id="progress-bar-bike" className="progress-bar" role="progressbar" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100} style={{ 'width': percentBike + '%' }}>
                <div className="progress-text text1">{team1_bike.toFixed(2)}</div>
                <div className="progress-text text2">🚴</div>
                <div className="progress-text text3">{team2_bike.toFixed(2)}</div>
              </div>
            </div>
          </div>
          <div id="progress-container">
            <div className="progress">
              <div id="progress-bar-run" className="progress-bar" role="progressbar" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100} style={{ 'width': percentRun + '%' }} >
                <div className="progress-text text1">{team1_run.toFixed(2)}</div>
                <div className="progress-text text2">🏃</div>
                <div className="progress-text text3">{team2_run.toFixed(2)}</div>
              </div>
            </div>
          </div>

          <div className='mt-5'>
            {activities.map((activity: IActivity) => {
              let timelineMarkerText = moment(activity.startTimeLocal).calendar({
                sameDay: '[Heute]',
                lastDay: '[Gestern]',
                lastWeek: 'dddd',
                sameElse: 'DD.MM.YYYY'
              });

              let showTimelineMarker = true;
              if (lastTimelineMarkerText === timelineMarkerText) {
                showTimelineMarker = false;
              } else {
                lastTimelineMarkerText = timelineMarkerText;
                showTimelineMarker = true;
              }

              function formatDuration(movingDuration: number): string {
                const hours: number = Math.floor(movingDuration / 3600);
                const minutes: number = Math.floor((movingDuration % 3600) / 60);
                const seconds: number = Math.floor(movingDuration % 60);
            
                // Füge führende Nullen hinzu, wenn die Werte einstellig sind
                const formattedhours: string = (hours < 10) ? "0" + hours : hours.toString();
                const formattedMinutes: string = (minutes < 10) ? "0" + minutes : minutes.toString();
                const formattedSeconds: string = (seconds < 10) ? "0" + seconds : seconds.toString();
            
                return formattedhours + ":" + formattedMinutes + ":" + formattedSeconds;
            }

              return (
                <><hr className="timeline-marker" data-content={timelineMarkerText} style={{ display: showTimelineMarker ? 'visible' : 'none' }} /><div className='row' key={activity.activityId}>
                  <div className={getActivityTeamClassName(activity.ownerDisplayName) + " pb-4"}>
                    <div className='col-2'>
                      <Image src={getProfielImage(activity.ownerDisplayName)} width={50} height={50} className="rounded-circle" alt={activity.ownerDisplayName} />
                    </div>
                    <div className="activity-details col-9 flex-shrink-1 rounded py-2 px-3 mr-3">
                      <h6> {activity.activityName}</h6>
                      {getSportIdIcon(activity.sportTypeId)}{(activity.distance / 1000).toFixed(2)}Km ⏱️{formatDuration(activity.movingDuration)}
                    </div>
                  </div>
                </div></>
              )
            })}
          </div>
        </div>
      </main>

    </div>
  )
}

function getTotalSumOfDistanz(team1Activities: IActivity[], sportTypeId: number) {
  var sumDistance = 0;
  team1Activities.filter(activity => activity.sportTypeId == sportTypeId).forEach(function (activity) {
    sumDistance += (activity.distance / 1000);
  });

  return sumDistance;
}

