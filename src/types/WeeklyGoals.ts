export type WeeklyGoals = {
    week: number;
    startDate: Date;
    endDate: Date;
    goals: {
      cycling: number;
      running: number;
      swimming: number;
    };
  };
  