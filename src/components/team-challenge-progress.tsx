import styles from "./team-challenge-progress.module.css";

export default function TeamChallengeProgress({
  teamName,
  progress,
  goals,
}: {
  teamName: string;
  progress: { cycling: number; running: number; swimming: number };
  goals: { cycling: number; running: number; swimming: number };
}) {
  const renderProgressBar = (
    current: number,
    target: number,
    label: string
  ) => {
    // Falls target erreicht wird Anzeige grün
    const percentage = (current / target) * 100;
    const isGoalReached = current >= target;
    const barColor = isGoalReached ? "lightgreen" : "#34cfeb";

    return (
      <div>
        <label>{label}</label>
        <div className={styles.progress + " progress"}>
          <div
            className="progress-bar"
            style={{
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: barColor,
            }}
          ></div>
          <span className={styles.progressText}>
            {current.toFixed(1)} / {target.toFixed(1)} km
          </span>
        </div>
      </div>
    );
  };

  return (
    <div>
      {renderProgressBar(progress.cycling, goals.cycling, "🚴 Fahrrad")}
      {renderProgressBar(progress.running, goals.running, "🏃 Laufen")}
      {renderProgressBar(progress.swimming, goals.swimming, "🏊 Schwimmen")}
    </div>
  );
}
