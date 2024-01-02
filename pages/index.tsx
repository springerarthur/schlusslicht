import Head from "next/head";
import Image from "next/image";

import { IActivity } from "garmin-connect/dist/garmin/types";

import {
  AlexH,
  AlexS,
  Arthur,
  Daniel,
  Jan,
  Roland,
  Thomas,
  Users,
  Waldi,
} from "../datastore/Users";
import { Team1, Team2 } from "../datastore/Teams";

import TeamResultsCalculator from "../utilities/TeamResultsCalculator";
import UiHelper from "../utilities/UiHelper";

import ActivityService from "../lib/ActivityService";
import { useEffect, useState } from "react";

export async function getServerSideProps() {
  try {
    const activityService = new ActivityService();
    const activities = await activityService.getActivities();

    return {
      props: { initialActivities: JSON.parse(JSON.stringify(activities)) },
    };
  } catch (e) {
    console.error(e);
  }
  return {
    props: { initialActivities: { initialActivities: [{}] } },
  };
}

export default function Home({
  initialActivities,
}: {
  initialActivities: IActivity[];
}) {
  const [activities, setActivities] = useState(initialActivities);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/activities")
      .then((res) => res.json())
      .then((data) => {
        setActivities(data);
        setLoading(false);
      });
  }, []);

  let lastTimelineMarkerText: string;

  const teamResultsCalculator = new TeamResultsCalculator();
  const teamResults = teamResultsCalculator.getTeamResults(
    activities,
    Team1,
    Team2
  );

  let pokalWidth = 105;
  let pokalHeight = 258;

  return (
    <div className="container">
      <Head>
        <title>Schlusslicht Punktestand</title>
      </Head>

      <main>
        <div className="container mt-4 main-content text-center">
          {isLoading && (
            <div className="alert alert-info fixed-top update-activities">
              <div
                className="spinner-border spinner-border-sm text-info me-2"
                role="status"
              ></div>
              Garmin-Aktivitäten werden aktualisiert!
            </div>
          )}
          <div className="row justify-content-center">
            <div className="col-2 mt-5 profile-icons text-end">
              <Image
                src={Daniel.profileImg}
                width={60}
                height={60}
                className="mb-2 rounded-circle profile-left"
                alt={Daniel.displayName}
              />
              <Image
                src={Waldi.profileImg}
                width={60}
                height={60}
                className="mb-2 rounded-circle"
                alt={Waldi.displayName}
              />
              <Image
                src={Roland.profileImg}
                width={60}
                height={60}
                className="mb-2 rounded-circle"
                alt={Roland.displayName}
              />
              <Image
                src={Arthur.profileImg}
                width={60}
                height={60}
                className="mb-2 rounded-circle profile-left"
                alt={Arthur.displayName}
              />
            </div>

            <div className="col-2 pokal">
              <h1 className="points">
                <span id="points-left">{teamResults.team1Score}</span> :{" "}
                <span id="points-right">{teamResults.team2Score}</span>
              </h1>
              <Image
                src="/Pokal-links.png"
                width={pokalWidth}
                height={pokalHeight}
                alt="Pokal Team Blau"
                id="pokal-left"
                className={
                  "img-fluid mb-2 pokal-part" +
                  (teamResults.team1Wins ? " pokal-winner" : "")
                }
              />
              <Image
                src="/Pokal-rechts.png"
                width={pokalWidth}
                height={pokalHeight}
                alt="Pokal Team Rot"
                id="pokal-right"
                className={
                  "img-fluid mb-2 pokal-part" +
                  (teamResults.team2Wins ? " pokal-winner" : "")
                }
              />
            </div>

            <div className="col-2 mt-5 profile-icons text-start">
              <Image
                src={AlexH.profileImg}
                width={60}
                height={60}
                className="mb-2 rounded-circle profile-right"
                alt={AlexH.displayName}
              />
              <Image
                src={AlexS.profileImg}
                width={60}
                height={60}
                className="mb-2 rounded-circle"
                alt={AlexS.displayName}
              />
              <Image
                src={Thomas.profileImg}
                width={60}
                height={60}
                className="mb-2 rounded-circle"
                alt={Thomas.displayName}
              />
              <Image
                src={Jan.profileImg}
                width={60}
                height={60}
                className="mb-2 rounded-circle profile-right"
                alt={Jan.displayName}
              />
            </div>
          </div>

          <div className="progress-container">
            <div className="progress">
              <div
                id="progress-bar-swim"
                className="progress-bar"
                role="progressbar"
                aria-valuenow={50}
                aria-valuemin={0}
                aria-valuemax={100}
                style={{ width: teamResults.swimPercentage + "%" }}
              >
                <div className="progress-text text1">
                  {teamResults.team1Distances.getFormattedSwimDistance()}
                </div>
                <div className="progress-text text2">🏊</div>
                <div className="progress-text text3">
                  {teamResults.team2Distances.getFormattedSwimDistance()}
                </div>
              </div>
            </div>
          </div>
          <div className="progress-container">
            <div className="progress">
              <div
                id="progress-bar-bike"
                className="progress-bar"
                role="progressbar"
                aria-valuenow={50}
                aria-valuemin={0}
                aria-valuemax={100}
                style={{ width: teamResults.bikePercentage + "%" }}
              >
                <div className="progress-text text1">
                  {teamResults.team1Distances.getFormattedBikeDistance()}
                </div>
                <div className="progress-text text2">🚴</div>
                <div className="progress-text text3">
                  {teamResults.team2Distances.getFormattedBikeDistance()}
                </div>
              </div>
            </div>
          </div>
          <div className="progress-container">
            <div className="progress">
              <div
                id="progress-bar-run"
                className="progress-bar"
                role="progressbar"
                aria-valuenow={50}
                aria-valuemin={0}
                aria-valuemax={100}
                style={{ width: teamResults.runPercentage + "%" }}
              >
                <div className="progress-text text1">
                  {teamResults.team1Distances.getFormattedRunDistance()}
                </div>
                <div className="progress-text text2">🏃</div>
                <div className="progress-text text3">
                  {teamResults.team2Distances.getFormattedRunDistance()}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5">
            {activities.map((activity: IActivity) => {
              let timelineMarkerText = UiHelper.formatTimelineMarkerDate(
                activity.startTimeLocal
              );

              let user = Users.find(
                (user) => user.garminUserId == activity.ownerDisplayName
              );

              let showTimelineMarker = true;
              if (lastTimelineMarkerText === timelineMarkerText) {
                showTimelineMarker = false;
              } else {
                lastTimelineMarkerText = timelineMarkerText;
                showTimelineMarker = true;
              }

              return (
                <div key={activity.activityId}>
                  <hr
                    className="timeline-marker"
                    data-content={timelineMarkerText}
                    style={{ display: showTimelineMarker ? "visible" : "none" }}
                  />
                  <div className="row">
                    <div
                      className={
                        getActivityTeamClassName(activity.ownerDisplayName) +
                        " pb-4"
                      }
                    >
                      <div className="col-2">
                        <Image
                          src={user?.profileImg ?? ""}
                          width={50}
                          height={50}
                          className="rounded-circle"
                          alt={activity.ownerDisplayName}
                        />
                      </div>
                      <div className="activity-details col-9 flex-shrink-1 rounded py-2 px-3 mr-3">
                        <h6> {activity.activityName}</h6>
                        {UiHelper.getSportIdIcon(activity.sportTypeId)}
                        {(activity.distance / 1000).toFixed(2)}
                        Km ⏱️
                        {UiHelper.formatDuration(activity.duration)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

function getActivityTeamClassName(ownerDisplayName: string) {
  if (Team1.some((user) => user.garminUserId === ownerDisplayName)) {
    return "activity-left";
  }
  if (Team2.some((user) => user.garminUserId === ownerDisplayName)) {
    return "activity-right";
  }
}
