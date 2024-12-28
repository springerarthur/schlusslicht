import styles from "./team-challenge-progress.module.css"

export default function TeamChallengeProgress({
    teamName,
    progress,
    goals,
  }: {
    teamName: string;
    progress: { cycling: number; running: number; swimming: number };
    goals: { cycling: number; running: number; swimming: number };
  }) {
    const renderProgressBar = (current: number, target: number, label: string) => (
      <div>
        <label>{label}</label>
        <div className={styles.progress+" progress"} >
          <div
            className="progress-bar"
            style={{ width: `${(current / target) * 100}%`, backgroundColor: '#34cfeb' }}
          >
          </div>
          <span className={styles.progressText}>{current.toFixed(1)} / {target.toFixed(1)} km</span>
        </div>
      </div>
    );
  
    return (
      <div>
        <h3>{teamName}</h3>
        {renderProgressBar(progress.cycling, goals.cycling, "🚴 Fahrrad")}
        {renderProgressBar(progress.running, goals.running, "🏃 Laufen")}
        {renderProgressBar(progress.swimming, goals.swimming, "🏊 Schwimmen")}
      </div>
    );
  }
  