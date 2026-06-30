import assert from "node:assert/strict";

function resultOf(score) {
  return Math.sign(score.homeScore - score.awayScore);
}

function scorePrediction(prediction, result) {
  if (prediction.homeScore === result.homeScore && prediction.awayScore === result.awayScore) {
    return { points: 10, outcome: "exact" };
  }

  if (resultOf(prediction) === resultOf(result)) {
    return { points: 5, outcome: "result" };
  }

  return { points: 0, outcome: "miss" };
}

assert.deepEqual(scorePrediction({ homeScore: 2, awayScore: 1 }, { homeScore: 2, awayScore: 1 }), { points: 10, outcome: "exact" });
assert.deepEqual(scorePrediction({ homeScore: 2, awayScore: 1 }, { homeScore: 3, awayScore: 0 }), { points: 5, outcome: "result" });
assert.deepEqual(scorePrediction({ homeScore: 2, awayScore: 1 }, { homeScore: 0, awayScore: 1 }), { points: 0, outcome: "miss" });
assert.deepEqual(scorePrediction({ homeScore: 1, awayScore: 1 }, { homeScore: 0, awayScore: 0 }), { points: 5, outcome: "result" });
