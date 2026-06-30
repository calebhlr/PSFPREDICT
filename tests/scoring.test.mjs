import assert from "node:assert/strict";

function scorePrediction(prediction, result) {
  if (prediction.homeScore === result.homeScore && prediction.awayScore === result.awayScore) {
    return { points: 1, outcome: "exact" };
  }

  return { points: 0, outcome: "miss" };
}

assert.deepEqual(scorePrediction({ homeScore: 2, awayScore: 1 }, { homeScore: 2, awayScore: 1 }), { points: 1, outcome: "exact" });
assert.deepEqual(scorePrediction({ homeScore: 2, awayScore: 1 }, { homeScore: 3, awayScore: 0 }), { points: 0, outcome: "miss" });
assert.deepEqual(scorePrediction({ homeScore: 2, awayScore: 1 }, { homeScore: 0, awayScore: 1 }), { points: 0, outcome: "miss" });
assert.deepEqual(scorePrediction({ homeScore: 1, awayScore: 1 }, { homeScore: 0, awayScore: 0 }), { points: 0, outcome: "miss" });
