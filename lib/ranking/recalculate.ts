"use server";

import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { matches, participants, predictions, rankingSnapshots } from "@/lib/db/schema";
import { calculateHitRate, scorePrediction } from "@/lib/scoring";
import { generatePostMatchFeedEvents } from "@/lib/feed/events";

type RankingRow = {
  participantId: string;
  position: number;
  previousPosition: number | null;
  totalPoints: number;
  exactScores: number;
  hitRate: number;
};

export async function recalculateMatchScore(matchId: string) {
  if (!db) return { updatedPredictions: 0, rankingRows: [] as RankingRow[] };

  const [match] = await db.select().from(matches).where(eq(matches.id, matchId)).limit(1);
  if (!match || match.homeScore === null || match.awayScore === null || match.status !== "finished") {
    return { updatedPredictions: 0, rankingRows: [] as RankingRow[] };
  }

  const matchPredictions = await db.select().from(predictions).where(eq(predictions.matchId, matchId));

  await Promise.all(matchPredictions.map((prediction) => {
    const scored = scorePrediction(
      { homeScore: prediction.homeScore, awayScore: prediction.awayScore },
      { homeScore: match.homeScore ?? 0, awayScore: match.awayScore ?? 0 },
    );

    return db.update(predictions).set({
      points: scored.points,
      outcome: scored.outcome,
      updatedAt: new Date(),
    }).where(eq(predictions.id, prediction.id));
  }));

  const rankingRows = await recalculateRanking();
  await generatePostMatchFeedEvents(matchId, rankingRows);

  return { updatedPredictions: matchPredictions.length, rankingRows };
}

export async function recalculateRanking(): Promise<RankingRow[]> {
  if (!db) return [];

  const activeParticipants = await db.select().from(participants).where(eq(participants.isActive, true));
  const activeParticipantIds = activeParticipants.map((participant) => participant.id);

  if (activeParticipantIds.length === 0) return [];

  const allPredictions = await db.select().from(predictions).where(inArray(predictions.participantId, activeParticipantIds));
  const previousRanking = await getLatestRankingByParticipant(activeParticipantIds);

  const rows = activeParticipants.map((participant) => {
    const participantPredictions = allPredictions.filter((prediction) => prediction.participantId === participant.id);
    const exactPredictions = participantPredictions.filter((prediction) => prediction.outcome === "exact").length;

    return {
      participantId: participant.id,
      position: 0,
      previousPosition: previousRanking.get(participant.id)?.position ?? null,
      totalPoints: participantPredictions.reduce((total, prediction) => total + prediction.points, 0),
      exactScores: participantPredictions.filter((prediction) => prediction.outcome === "exact").length,
      hitRate: calculateHitRate(exactPredictions, participantPredictions.length),
    };
  }).sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    if (b.exactScores !== a.exactScores) return b.exactScores - a.exactScores;
    return a.participantId.localeCompare(b.participantId);
  }).map((row, index) => ({ ...row, position: index + 1 }));

  await Promise.all(rows.map((row) => db.insert(rankingSnapshots).values(row)));

  return rows;
}

async function getLatestRankingByParticipant(participantIds: string[]) {
  const map = new Map<string, RankingRow>();
  if (!db || participantIds.length === 0) return map;

  const snapshots = await db.select().from(rankingSnapshots)
    .where(inArray(rankingSnapshots.participantId, participantIds))
    .orderBy(desc(rankingSnapshots.calculatedAt));

  for (const snapshot of snapshots) {
    if (!map.has(snapshot.participantId)) {
      map.set(snapshot.participantId, {
        participantId: snapshot.participantId,
        position: snapshot.position,
        previousPosition: snapshot.previousPosition,
        totalPoints: snapshot.totalPoints,
        exactScores: snapshot.exactScores,
        hitRate: snapshot.hitRate,
      });
    }
  }

  return map;
}

export async function recalculateFinishedMatches() {
  if (!db) return [];

  const finishedMatches = await db.select().from(matches).where(and(
    eq(matches.status, "finished"),
  ));

  return Promise.all(finishedMatches.map((match) => recalculateMatchScore(match.id)));
}
