export interface WeightLog {
  id: string;
  user_id: string;
  logged_at: string;
  weight_kg: number;
  source: "manual";
  created_at: string;
}

export interface WeightTrendPoint {
  day: string;
  weight_kg: number;
  trend_7d: number;
}

export interface WeightTrendSummary {
  latest_weight_kg: number | null;
  weekly_change_kg: number | null;
  trend_direction: "up" | "down" | "stable" | "unknown";
}

export interface WeightTrendPayload {
  points: WeightTrendPoint[];
  summary: WeightTrendSummary;
}

