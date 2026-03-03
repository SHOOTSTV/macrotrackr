export interface UserProgress {
  user_id: string;
  timezone: string;
  current_streak: number;
  best_streak: number;
  weekly_completed_days: number;
  week_start_date: string;
  created_at: string;
  updated_at: string;
}

export interface StreakProgressPayload {
  timezone: string;
  current_streak: number;
  best_streak: number;
  weekly_completed_days: number;
  week_start_date: string;
}

export interface WeeklyProgressPayload {
  timezone: string;
  week_start_date: string;
  weekly_completed_days: number;
  weekly_target: number;
  remaining_days: number;
  weekly_goal_hit: boolean;
}
