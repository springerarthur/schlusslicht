import { ChallengeResult } from "../types/ChallengeResult";
import ProfileImage from "./profile-image";
import styles from "./challenge-result-card.module.css";
import { formatDistance } from "../utilities/UiHelper";

export default function ChallengeResultCard({
  challengeResult,
}: {
  challengeResult: ChallengeResult;
}) {
  function getRankClassName(rank: number): string {
    switch (rank) {
      case 1:
        return styles.rank1;
      case 2:
        return styles.rank2;
      case 3:
        return styles.rank3;
      default:
        return "";
    }
  }

  function getTrophyIcon(rank: number, score: number): string {
    if(score == 0) {
      return "";
    }

    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return "";
    }
  }

  return (
    <div className={"card mb-3 " + getRankClassName(challengeResult.rank)}>
      <div className="card-body py-0">
        <div className="row g-0">
          <div className="col-2 d-flex align-items-center justify-content-center">
            <ProfileImage
              user={challengeResult.user}
              size={60}
              className="profile-img"
            />
          </div>
          <div className="col-3 d-flex align-items-center">
            <span className="text-center fs-1">
              <span className={styles.trophyIcon}>
                {getTrophyIcon(challengeResult.rank, challengeResult.totalScore)}
              </span>
              {challengeResult.totalScore}
            </span>
          </div>
          <div className="col-7">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <span className="row">
                  <span className="col-2">🏊</span>
                  <span className={"col-2"}>
                    {getTrophyIcon(challengeResult.swimRank, challengeResult.swimScore)}
                  </span>
                  <span className={"col-2"}>{challengeResult.swimScore}</span>
                  <span className={"col-6 text-start"}>
                    {formatDistance(challengeResult.distances.swimDistance)}
                  </span>
                </span>
              </li>
              <li className="list-group-item">
                <span className="row">
                  <span className="col-2">🚴</span>
                  <span className={"col-2"}>
                    {getTrophyIcon(challengeResult.bikeRank, challengeResult.bikeScore)}
                  </span>
                  <span className={"col-2"}>{challengeResult.bikeScore}</span>
                  <span className={"col-6 text-start"}>
                    {formatDistance(challengeResult.distances.bikeDistance)}
                  </span>
                </span>
              </li>
              <li className="list-group-item">
                <span className="row">
                  <span className="col-2">🏃</span>
                  <span className={"col-2"}>
                    {getTrophyIcon(challengeResult.runRank, challengeResult.runScore)}
                  </span>
                  <span className={"col-2"}>{challengeResult.runScore}</span>
                  <span className={"col-6 text-start"}>
                    {formatDistance(challengeResult.distances.runDistance)}
                  </span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    // <div className={"ranking-item rounded " + getRankClassName(challengeResult)}>
    //   <ProfileImage user={challengeResult.user} size={80} className="profile-img" />
    //   <div className="result-info">
    //     <h5>{challengeResult.totalScore} Punkte</h5>
    //     <div className="points">
    //       <p>Schwimmen: {challengeResult.swimScore}</p>
    //       <p>Laufen: {challengeResult.runScore}</p>
    //       <p>Radfahren: {challengeResult.bikeScore}</p>
    //     </div>
    //   </div>
    // </div>

    // <div key={challengeResult.user.garminUserId} className="card rank-card">
    //   <ProfileImage user={challengeResult.user} size={40}></ProfileImage>
    //   <div className="card-body">
    //     <h5 className="badge bg-primary rounded-pill">
    //       {challengeResult.totalScore} Punkte
    //     </h5>
    //     <div className="ml-auto">
    //       <p className="mb-0">🏊 {challengeResult.swimScore}</p>
    //       <p className="mb-0">🚴 {challengeResult.bikeScore}</p>
    //       <p className="mb-0">🏃 {challengeResult.runScore}</p>
    //     </div>
    //   </div>
    // </div>
  );
}
