import moment from "moment";
import { SportType } from "../lib/GarminConstants";

export function formatDuration(duration: number): string {
  const hours: number = Math.floor(duration / 3600);
  const minutes: number = Math.floor((duration % 3600) / 60);
  const seconds: number = Math.floor(duration % 60);

  const formattedhours: string = hours < 10 ? "0" + hours : hours.toString();
  const formattedMinutes: string =
    minutes < 10 ? "0" + minutes : minutes.toString();
  const formattedSeconds: string =
    seconds < 10 ? "0" + seconds : seconds.toString();

  return formattedhours + ":" + formattedMinutes + ":" + formattedSeconds;
}

export function formatTimelineMarkerDate(date: string): string {
  return moment(date).calendar({
    sameDay: "[Heute]",
    lastDay: "[Gestern]",
    lastWeek: "dddd",
    sameElse: "DD.MM.YYYY",
  });
}

export function getSportIdIcon(sportTypeId: number): string {
  if (sportTypeId === SportType.RUNNING) {
    return "🏃";
  }
  if (sportTypeId === SportType.BIKE) {
    return "🚴";
  }
  if (sportTypeId === SportType.SWIMMING) {
    return "🏊";
  }
  return "";
}

export function formatDistance(distance: number): string {
  const distanceInKiloMeter = distance / 1000
  const roundedDistance = Math.round(distanceInKiloMeter * 100) / 100;

  const formattedDistance = roundedDistance.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formattedDistance;
}