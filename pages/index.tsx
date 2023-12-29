import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { IActivity } from 'garmin-connect/dist/garmin/types';

import clientPromise from '../lib/mongodb'
import GarminConnectSync from '../lib/GarminConnectSync';
import { SportTypeIds } from '../lib/GarminConstants';
import { UiHelper } from '../utilities/uihelper';

import { isInTeam1, isInTeam2 } from '../datastore/Teams';
import { AlexH, AlexS, Arthur, Daniel, Jan, Roland, Thomas, Users, Waldi } from '../datastore/Users';

export const getServerSideProps = (async () => {
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
}) satisfies GetServerSideProps<{ activities: IActivity[] }>

export default function Home({ activities }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  let lastTimelineMarkerText: string;

  const team1Activities = activities.filter(activity => isInTeam1(activity.ownerDisplayName));
  const team2Activities = activities.filter(activity => isInTeam2(activity.ownerDisplayName));

  var team1_swim = UiHelper.getTotalSumOfDistanz(team1Activities, SportTypeIds.swimming);
  var team1_bike = UiHelper.getTotalSumOfDistanz(team1Activities, SportTypeIds.bike);
  var team1_run = UiHelper.getTotalSumOfDistanz(team1Activities, SportTypeIds.running);

  var team2_swim = UiHelper.getTotalSumOfDistanz(team2Activities, SportTypeIds.swimming);
  var team2_bike = UiHelper.getTotalSumOfDistanz(team2Activities, SportTypeIds.bike);
  var team2_run = UiHelper.getTotalSumOfDistanz(team2Activities, SportTypeIds.running);

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

            <div className="alert alert-danger" style={{ display: Object.keys(activities).length === 0 ? 'visible' : 'none' }} role="alert">
              Es konnten keine Daten geladen werden!
            </div>
            <div className="col-2 mt-5 profile-icons text-end">
              <Image src={Daniel.profileImg} width={60} height={60} className="mb-2 rounded-circle profile-left" alt={Daniel.displayName} />
              <Image src={Waldi.profileImg} width={60} height={60} className="mb-2 rounded-circle" alt={Waldi.displayName} />
              <Image src={Roland.profileImg} width={60} height={60} className="mb-2 rounded-circle" alt={Roland.displayName} />
              <Image src={Arthur.profileImg} width={60} height={60} className="mb-2 rounded-circle profile-left" alt={Arthur.displayName} />
            </div>

            <div className="col-2 pokal">
              <h1 className="points"><span id="points-left">{team1Points}</span> : <span id="points-right">{team2Points}</span></h1>
              <Image src="/Pokal-links.png" width={team1PokalWidth} height={team1PokalHeight} alt="Pokal Team Blau" id="pokal-left" className={"img-fluid mb-2 pokal-part" + (team1wins ? " pokal-winner" : "")} />
              <Image src="/Pokal-rechts.png" width={team2PokalWidth} height={team2PokalHeight} alt="Pokal Team Rot" id="pokal-right" className={"img-fluid mb-2 pokal-part" + (team2wins ? " pokal-winner" : "")} />
            </div>

            <div className="col-2 mt-5 profile-icons text-start">
              <Image src={AlexH.profileImg} width={60} height={60} className="mb-2 rounded-circle profile-right" alt={AlexH.displayName} />
              <Image src={AlexS.profileImg} width={60} height={60} className="mb-2 rounded-circle" alt={AlexS.displayName} />
              <Image src={Thomas.profileImg} width={60} height={60} className="mb-2 rounded-circle" alt={Thomas.displayName} />
              <Image src={Jan.profileImg} width={60} height={60} className="mb-2 rounded-circle profile-right" alt={Jan.displayName} />
            </div>
          </div>

          <div className="progress-container">
            <div className="progress">
              <div id="progress-bar-swim" className="progress-bar" role="progressbar" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100} style={{ 'width': percentSwim + '%' }}>
                <div className="progress-text text1">{team1_swim.toFixed(2)}</div>
                <div className="progress-text text2">🏊</div>
                <div className="progress-text text3">{team2_swim.toFixed(2)}</div>
              </div>
            </div>
          </div>
          <div className="progress-container">
            <div className="progress">
              <div id="progress-bar-bike" className="progress-bar" role="progressbar" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100} style={{ 'width': percentBike + '%' }}>
                <div className="progress-text text1">{team1_bike.toFixed(2)}</div>
                <div className="progress-text text2">🚴</div>
                <div className="progress-text text3">{team2_bike.toFixed(2)}</div>
              </div>
            </div>
          </div>
          <div className="progress-container">
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
              let timelineMarkerText = UiHelper.formatTimelineMarkerDate(activity.startTimeLocal);

              let user = Users.find(user => user.garminUserId == activity.ownerDisplayName);

              let showTimelineMarker = true;
              if (lastTimelineMarkerText === timelineMarkerText) {
                showTimelineMarker = false;
              } else {
                lastTimelineMarkerText = timelineMarkerText;
                showTimelineMarker = true;
              }

              return (
                <div key={activity.activityId}>
                  <hr className="timeline-marker" data-content={timelineMarkerText} style={{ display: showTimelineMarker ? 'visible' : 'none' }} /><div className='row'>
                    <div className={UiHelper.getActivityTeamClassName(activity.ownerDisplayName) + " pb-4"}>
                      <div className='col-2'>
                        <Image src={user?.profileImg ?? ''} width={50} height={50} className="rounded-circle" alt={activity.ownerDisplayName} />
                      </div>
                      <div className="activity-details col-9 flex-shrink-1 rounded py-2 px-3 mr-3">
                        <h6> {activity.activityName}</h6>
                        {UiHelper.getSportIdIcon(activity.sportTypeId)}{(activity.distance / 1000).toFixed(2)}Km ⏱️{UiHelper.formatDuration(activity.duration)}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>

    </div>
  )
}