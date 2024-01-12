import { getSportIdIcon, formatDistance } from '../utilities/UiHelper';
import styles from "./team-progress.module.css";

export default function TeamProgress({
  team1Distance,
  team2Distance,
  sportTypeId,
}: {
  team1Distance: number;
  team2Distance: number;
  sportTypeId: number;
}) {

  return (
    <div className={styles.container}>
      <div
        className={
          styles.progress +
          " progress " +
          (team1Distance === 0 && team2Distance === 0
            ? styles.empty
            : "")
        }
      >
        <div
          className={"progress-bar " + styles.progressbar}
          style={{
            width:
              calculatePercentage(
                team1Distance,
                team2Distance
              ) + "%",
          }}
        >
          <div className={styles.text + " " + styles.text1}>
            {formatDistance(team1Distance)}
          </div>
          <div className={styles.text + " " + styles.text2}>
            {getSportIdIcon(sportTypeId)}
          </div>
          <div className={styles.text + " " + styles.text3}>
            {formatDistance(team2Distance)}
          </div>
        </div>
      </div>
    </div>
  );

  function calculatePercentage(
    team1Distance: number,
    team2Distance: number
  ): number {
    const totalDistance = team1Distance + team2Distance;
    if (totalDistance == 0) {
      return 0;
    }

    return (team1Distance / totalDistance) * 100;
  }
}
