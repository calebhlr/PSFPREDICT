export type MatchStatus = "scheduled" | "live" | "halftime" | "finished" | "postponed" | "cancelled";

export type PredictionOutcome = "exact" | "result" | "miss" | "pending";

export type FeedEventType = "exact_score" | "leader_changed" | "position_changed" | "match_finished";

export type TeamSide = "home" | "away";
