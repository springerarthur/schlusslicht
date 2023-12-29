import { IActivity } from 'garmin-connect/dist/garmin/types';
import moment from 'moment';
import { SportTypeIds } from '../lib/GarminConstants';
import { isInTeam1, isInTeam2 } from '../datastore/Teams';

export class UiHelper {
    public static formatDuration(duration: number): string {
        const hours: number = Math.floor(duration / 3600);
        const minutes: number = Math.floor((duration % 3600) / 60);
        const seconds: number = Math.floor(duration % 60);

        const formattedhours: string = (hours < 10) ? "0" + hours : hours.toString();
        const formattedMinutes: string = (minutes < 10) ? "0" + minutes : minutes.toString();
        const formattedSeconds: string = (seconds < 10) ? "0" + seconds : seconds.toString();

        return formattedhours + ":" + formattedMinutes + ":" + formattedSeconds;
    }

    public static getTotalSumOfDistanz(team1Activities: IActivity[], sportTypeId: number) {
        var sumDistance = 0;
        team1Activities.filter(activity => activity.sportTypeId == sportTypeId).forEach(function (activity) {
            sumDistance += (activity.distance / 1000);
        });

        return sumDistance;
    }

    public static formatTimelineMarkerDate(date: string): string {
        return moment(date).calendar({
            sameDay: '[Heute]',
            lastDay: '[Gestern]',
            lastWeek: 'dddd',
            sameElse: 'DD.MM.YYYY'
        });
    }

    public static getSportIdIcon(sportTypeId: number): string {
        if (sportTypeId === SportTypeIds.running) {
            return "🏃";
        }
        if (sportTypeId === SportTypeIds.bike) {
            return "🚴";
        }
        if (sportTypeId === SportTypeIds.swimming) {
            return "🏊";
        }
        return "";
    }

    public static getActivityTeamClassName(ownerDisplayName: string) {
        if (isInTeam1(ownerDisplayName)) {
            return 'activity-left';
        }
        if (isInTeam2(ownerDisplayName)) {
            return 'activity-right';
        }
    }
}
