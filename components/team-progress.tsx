import { Distance } from "../src/utilities/Distance";
import styles from "./team-progress.module.css";
import UiHelper from "../src/utilities/UiHelper";

export default function TeamProgress({
  team1Distance,
  team2Distance,
  sportTypeId,
}: {
  team1Distance: Distance;
  team2Distance: Distance;
  sportTypeId: number;
}) {
  return (
    <div className={styles.container}>
      <div
        className={
          styles.progress +
          " progress " +
          (team1Distance.distance === 0 && team2Distance.distance === 0
            ? styles.empty
            : "")
        }
      >
        <div
          className={"progress-bar " + styles.progressbar}
          style={{
            width:
              calculatePercentage(
                team1Distance.distance,
                team2Distance.distance
              ) + "%",
          }}
        >
          <div className={styles.text + " " + styles.text1}>
            {team1Distance.toString()}
          </div>
          <div className={styles.text + " " + styles.text2}>
            {UiHelper.getSportIdIcon(sportTypeId)}
          </div>
          <div className={styles.text + " " + styles.text3}>
            {team2Distance.toString()}
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
