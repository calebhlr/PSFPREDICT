import type { PredictionOutcome } from "@/types/domain";

export type Score = { homeScore: number; awayScore: number };
export type PredictionScore = { points: number; outcome: PredictionOutcome };

export function scorePrediction(prediction: Score, result: Score): PredictionScore {
  if (prediction.homeScore === result.homeScore && prediction.awayScore === result.awayScore) {
    return { points: 1, outcome: "exact" };
  }

  return { points: 0, outcome: "miss" };
}

export function calculateHitRate(exactPredictions: number, totalPredictions: number) {
  if (totalPredictions === 0) return 0;
  return Math.round((exactPredictions / totalPredictions) * 100);
}
