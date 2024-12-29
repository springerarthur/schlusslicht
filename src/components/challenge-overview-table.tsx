import React from "react";
import ChallengeGoalService from "../lib/ChallengeGoalService";
import styles from "./challenge-overview-table.module.css";

const goalService = new ChallengeGoalService();

export default function ChallengeOverviewTable() {
  const allGoals = goalService.getAllChallengeGoals();

  return (
    <div className={styles.challengeOverview}>
      <h3>Challenge Übersicht</h3>
      <table className={`table table-striped ${styles.table}`}>
        <thead>
          <tr>
            <th className={styles.tableHeader}>Woche</th>
            <th className={styles.tableHeader}>Fahrrad (km)</th>
            <th className={styles.tableHeader}>Laufen (km)</th>
            <th className={styles.tableHeader}>Schwimmen (km)</th>
          </tr>
        </thead>
        <tbody>
          {allGoals.map((goal, index) => (
            <tr key={index} className={styles.tableRow}>
              <td className={styles.tableCell}>{goal.week}</td>
              <td className={styles.tableCell}>
                {goal.goals.cycling.toFixed(1)}
              </td>
              <td className={styles.tableCell}>
                {goal.goals.running.toFixed(1)}
              </td>
              <td className={styles.tableCell}>
                {goal.goals.swimming.toFixed(1)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
