import type { PredictionOutcome } from "@/types/domain";

export type Score = { homeScore: number; awayScore: number };
export type PredictionScore = { points: number; outcome: PredictionOutcome };

function resultOf(score: Score) {
  return Math.sign(score.homeScore - score.awayScore);
}

export function scorePrediction(prediction: Score, result: Score): PredictionScore {
  if (prediction.homeScore === result.homeScore && prediction.awayScore === result.awayScore) {
    return { points: 10, outcome: "exact" };
  }

  if (resultOf(prediction) === resultOf(result)) {
    return { points: 5, outcome: "result" };
  }

  return { points: 0, outcome: "miss" };
}

export function calculateHitRate(scoredPredictions: number, totalPredictions: number) {
  if (totalPredictions === 0) return 0;
  return Math.round((scoredPredictions / totalPredictions) * 100);
}
