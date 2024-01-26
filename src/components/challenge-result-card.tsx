import { ChallengeResult } from "../types/ChallengeResult";
import ProfileImage from "./profile-image";

export default function ChallengeResultCard({
  challengeResult,
}: {
  challengeResult: ChallengeResult;
}) {
  function getRankClassName(challengeResult: ChallengeResult) {
    return "rank-" + challengeResult.rank;
  }

  return (
    <div className={"card mb-3 " + getRankClassName(challengeResult)}>
      <div className="card-body">
        <div className="row g-0">
          <div className="col-3 d-flex align-items-center justify-content-center">
            <ProfileImage
              user={challengeResult.user}
              size={60}
              className="profile-img"
            />
          </div>
          <div className="col-3 d-flex align-items-center justify-content-center">
            <span className="text-center fs-2">
              {challengeResult.totalScore} Pkt.
            </span>
          </div>
          <div className="col-6 fs-3 d-flex align-items-center justify-content-center">
            <span>
              🏊{challengeResult.swimScore} | 🚴{challengeResult.bikeScore} | 🏃
              {challengeResult.runScore}
            </span>
            {/* <ul className="list-group list-group-flush">
            <li className="list-group-item">Schwimmen</li>
            <li className="list-group-item">Fahrrad</li>
            <li className="list-group-item">Laufen</li>
          </ul> */}
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
