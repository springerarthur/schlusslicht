import Image from "next/image";

import {
  Daniel,
  Waldi,
  Roland,
  Arthur,
  AlexH,
  AlexS,
  Thomas,
  Jan,
} from "../datastore/Users";
import ProfileImage from "./profile-image";
import { TeamResults } from "../types/TeamResults";
import styles from "./team-score.module.css";
import { Distances } from "../types/Distances";
import { formatDuration } from "../utilities/UiHelper";

export default function TeamScore({
  teamResults,
}: {
  teamResults: TeamResults;
}) {
  let cupWidth = 105;
  let cupHeight = 258;

  const team1Score = calculateScoreForTeam(
    teamResults.team1Distances,
    teamResults.team2Distances
  );
  const team2Score = calculateScoreForTeam(
    teamResults.team2Distances,
    teamResults.team1Distances
  );

  const team1TotalTime = teamResults.team1TotalTime;
  const team2TotalTime = teamResults.team2TotalTime;

  const team1Wins = team1Score > team2Score;
  const team2Wins = team2Score > team1Score;

  return (
    <>
      <div className="row justify-content-center">
        <div className={"col-2 mt-5 text-end " + styles.icons}>
          <ProfileImage
            user={Daniel}
            size={60}
            className={"mb-2 " + styles.left}
          />
          <ProfileImage user={Waldi} size={60} className={"mb-2 "} />
          <ProfileImage user={Roland} size={60} className={"mb-2 "} />
          <ProfileImage
            user={Arthur}
            size={60}
            className={"mb-2 " + styles.left}
          />
        </div>

        <div className={"col-2 " + styles.cup}>
          <h1 className={styles.score}>
            <span>{team1Score}</span> : <span>{team2Score}</span>
          </h1>
          <Image
            src="/Pokal-links.png"
            width={cupWidth}
            height={cupHeight}
            alt="Pokal Team Blau"
            className={
              "img-fluid mb-2 " +
              styles.cupPart +
              " " +
              (team1Wins ? styles.cupWinner : "")
            }
          />
          <Image
            src="/Pokal-rechts.png"
            width={cupWidth}
            height={cupHeight}
            alt="Pokal Team Gelb"
            className={
              "img-fluid mb-2 " +
              styles.cupPart +
              " " +
              (team2Wins ? styles.cupWinner : "")
            }
          />
        </div>

        <div className={"col-2 mt-5 text-start " + styles.icons}>
          <ProfileImage
            user={AlexH}
            size={60}
            className={"mb-2 " + styles.right}
          />
          <ProfileImage user={AlexS} size={60} className={"mb-2 "} />
          <ProfileImage user={Thomas} size={60} className={"mb-2 "} />
          <ProfileImage
            user={Jan}
            size={60}
            className={"mb-2 " + styles.right}
          />
        </div>
      </div>
      <div className={"row justify-content-center " + styles.totalTime}>
        <div className="col-6 text-end">
          ⏱️{formatDuration(team1TotalTime)}
        </div>
        <div className="col-6 text-start">
          ⏱️{formatDuration(team2TotalTime)}
        </div>
      </div>
    </>
  );

  function calculateScoreForTeam(
    distances: Distances,
    otherTeamDistances: Distances
  ): number {
    let score = 0;

    if (distances.swimDistance > otherTeamDistances.swimDistance) {
      score++;
    }
    if (distances.bikeDistance > otherTeamDistances.bikeDistance) {
      score++;
    }
    if (distances.runDistance > otherTeamDistances.runDistance) {
      score++;
    }

    return score;
  }
}
