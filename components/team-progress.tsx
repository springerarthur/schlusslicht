import { Distance } from "../utilities/Distance";
import styles from "./team-progress.module.css";
import UiHelper from '../utilities/UiHelper';

export default function TeamProgress({
  team1Distance,
  team2Distance,
  percentage,
  sportTypeId,
}: {
  team1Distance: Distance;
  team2Distance: Distance;
  percentage: number;
  sportTypeId: number;
}) {
  return (
    <div className={styles.container}>
      <div
        className={
          styles.progress + " progress " +
          (team1Distance.distance === 0 && team2Distance.distance === 0
            ? styles.empty
            : "")
        }
      >
        <div
          className={"progress-bar " + styles.progressbar}
          role="progressbar"
          aria-valuenow={50}
          aria-valuemin={0}
          aria-valuemax={100}
          style={{ width: percentage + "%" }}
        >
          <div className={styles.text + " " + styles.text1}>{team1Distance.toString()}</div>
          <div className={styles.text + " " + styles.text2}>{UiHelper.getSportIdIcon(sportTypeId)}</div>
          <div className={styles.text + " " + styles.text3}>{team2Distance.toString()}</div>
        </div>
      </div>
    </div>
  );
}
