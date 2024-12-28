import { WeeklyGoals } from "../types/WeeklyGoals";

export default class ChallengeGoalService {
  private readonly startDate = new Date(2024, 10, 30);
  private readonly incrementFactor = 1.3; // Wöchentliche Steigerung
  private readonly baseGoals = { cycling: 100, running: 20, swimming: 1 }; // Erste Woche
  private readonly totalWeeks = 8; // Gesamtanzahl der Wochen

  public getWeeklyGoals(week: number): { cycling: number; running: number; swimming: number } {
    if (week < 1 || week > this.totalWeeks) {
      throw new Error(`Invalid week number: ${week}. Must be between 1 and ${this.totalWeeks}.`);
    }

    return {
      cycling: this.baseGoals.cycling * Math.pow(this.incrementFactor, week - 1),
      running: this.baseGoals.running * Math.pow(this.incrementFactor, week - 1),
      swimming: this.baseGoals.swimming * Math.pow(this.incrementFactor, week - 1),
    };
  }

  public getCurrentWeek(): number {
    const weeksSinceStart = Math.ceil(
      (new Date().getTime() - this.startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
    );
    return Math.max(1, Math.min(weeksSinceStart, this.totalWeeks));
  }

  public getWeeklyGoalDateRange(week: number): { startDate: Date; endDate: Date } {
    if (week < 1 || week > this.totalWeeks) {
      throw new Error(`Invalid week number: ${week}. Must be between 1 and ${this.totalWeeks}.`);
    }

    const startDate = new Date(this.startDate);
    startDate.setDate(this.startDate.getDate() + (week - 1) * 7);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    return { startDate, endDate };
  }

  public getWeeklyGoalDetails(week: number): WeeklyGoals {
    const { startDate, endDate } = this.getWeeklyGoalDateRange(week);
    const goals = this.getWeeklyGoals(week);

    return { week, startDate, endDate, goals };
  }

  public getAllChallengeGoals(): WeeklyGoals[] {
    const goals: WeeklyGoals[] = [];
    for (let week = 1; week <= this.totalWeeks; week++) {
      goals.push(this.getWeeklyGoalDetails(week));
    }
    return goals;
  }
}
