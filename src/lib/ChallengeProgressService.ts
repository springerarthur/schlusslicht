import ActivityService from "./ActivityService";
import ChallengeGoalService from "./ChallengeGoalService";
import { User } from "./User";

export default class ChallengeProgressService {
  private activityService: ActivityService;
  private goalService: ChallengeGoalService;

  constructor() {
    this.activityService = new ActivityService();
    this.goalService = new ChallengeGoalService();
  }

  public async getTeamProgress(team: User[]): Promise<{ cycling: number; running: number; swimming: number }> {
    const teamIds = team.map((user) => user.garminUserId); // Liste der User IDs
    const currentWeek = this.goalService.getCurrentWeek(); // Aktuelle Woche
    const dateRange = this.goalService.getWeeklyGoalDateRange(currentWeek); // Zeitrahmen der Woche

    // Aktivitäten holen
    const activities = await Promise.all(
      teamIds.map((id) =>
        this.activityService.findActivities({
          userId: id, // Individuell für jeden User
          date: dateRange,
        })
      )
    );

    // Flache Liste aller Aktivitäten
    const flattenedActivities = activities.flat();

    // Fortschritt berechnen
    const progress = {
      cycling: 0,
      running: 0,
      swimming: 0,
    };

    flattenedActivities.forEach((activity) => {
      switch (activity.sportTypeId) {
        case 2: // Fahrradfahren
          progress.cycling += activity.distance / 1000; // Umrechnung in km
          break;
        case 1: // Laufen
          progress.running += activity.distance / 1000;
          break;
        case 5: // Schwimmen
          progress.swimming += activity.distance / 1000;
          break;
      }
    });

    console.debug("[DEBUG] Team Progress for IDs:", teamIds);
    console.debug("[DEBUG] Date Range for Progress:", dateRange);
    console.debug("[DEBUG] Flattened Activities:", flattenedActivities);
    console.debug("[DEBUG] Calculated Progress:", progress);
    return progress;
  }

  public async getAllTeamsProgress(
    teams: { [key: string]: User[] }
  ): Promise<{ [teamName: string]: { cycling: number; running: number; swimming: number } }> {
    const teamProgressPromises = Object.entries(teams).map(async ([teamName, teamMembers]) => {
      const progress = await this.getTeamProgress(teamMembers);
      return { teamName, progress };
    });

    const allTeamProgress = await Promise.all(teamProgressPromises);

    return allTeamProgress.reduce((acc, { teamName, progress }) => {
      acc[teamName] = progress;
      return acc;
    }, {} as { [teamName: string]: { cycling: number; running: number; swimming: number } });
  }
}
