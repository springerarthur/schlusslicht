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
import { ITeamResults } from "../utilities/ITeamResults";
import styles from "./team-score.module.css";

export default function TeamScore({
  teamResults,
}: {
  teamResults: ITeamResults;
}) {
  let cupWidth = 105;
  let cupHeight = 258;

  return (
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
          <span>{teamResults.team1Score}</span> :{" "}
          <span>{teamResults.team2Score}</span>
        </h1>
        <Image
          src="/Pokal-links.png"
          width={cupWidth}
          height={cupHeight}
          alt="Pokal Team Blau"
          className={
            "img-fluid mb-2 " +
            styles.cupPart + " " +
            (teamResults.team1Score > teamResults.team2Score ? styles.cupWinner : "")
          }
        />
        <Image
          src="/Pokal-rechts.png"
          width={cupWidth}
          height={cupHeight}
          alt="Pokal Team Gelb"
          className={
            "img-fluid mb-2 " +
            styles.cupPart + " " +
            (teamResults.team2Score > teamResults.team1Score ? styles.cupWinner : "")
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
  );
}
