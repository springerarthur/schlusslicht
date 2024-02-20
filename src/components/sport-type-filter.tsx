import { useState } from "react";
import { SportType } from "../lib/GarminConstants";
import styles from "./sport-type-filter.module.css";

export default function SportTypeFilter({filter, onFilterChange} : {
    filter: SportType | undefined,
    onFilterChange: (filter: SportType | undefined) => void
}) {
  return (
    <div
      className="btn-group mb-3"
      role="group"
      aria-label="Filter Activities"
    >
      <button
        type="button"
        className={`btn btn-primary  px-3 py-2 ${
          filter === undefined ? styles.activeFilter : styles.inactiveFilter
        }`}
        onClick={() => onFilterChange(undefined)}
      >
        Alle
      </button>
      <button
        type="button"
        className={`btn btn-primary  px-4 py-2 ${
          filter === SportType.SWIMMING
            ? styles.activeFilter
            : styles.inactiveFilter
        }`}
        onClick={() => onFilterChange(SportType.SWIMMING)}
      >
        🏊
      </button>
      <button
        className={`btn btn-primary  px-4 py-2 ${
          filter === SportType.BIKE
            ? styles.activeFilter
            : styles.inactiveFilter
        }`}
        onClick={() => onFilterChange(SportType.BIKE)}
      >
        🚴
      </button>
      <button
        type="button"
        className={`btn btn-primary  px-4 py-2 ${
          filter === SportType.RUNNING
            ? styles.activeFilter
            : styles.inactiveFilter
        }`}
        onClick={() => onFilterChange(SportType.RUNNING)}
      >
        🏃
      </button>
    </div>
  );
}
