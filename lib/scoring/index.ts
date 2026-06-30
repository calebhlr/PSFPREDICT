import type { PredictionOutcome } from "@/types/domain";

type Score = { homeScore: number; awayScore: number };

function resultOf(score: Score) {
  return Math.sign(score.homeScore - score.awayScore);
}

export function scorePrediction(prediction: Score, result: Score): { points: number; outcome: PredictionOutcome } {
  if (prediction.homeScore === result.homeScore && prediction.awayScore === result.awayScore) {
    return { points: 10, outcome: "exact" };
  }

  if (resultOf(prediction) === resultOf(result)) {
    return { points: 5, outcome: "result" };
  }

  return { points: 0, outcome: "miss" };
}
