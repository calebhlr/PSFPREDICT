"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { matches, participants, predictions, teams } from "@/lib/db/schema";

export async function listPredictionMatches() {
  if (!db) return [];

  return db.select({
    id: matches.id,
    kickoffAt: matches.kickoffAt,
    status: matches.status,
    round: matches.round,
    homeTeamName: teams.name,
  }).from(matches).leftJoin(teams, eq(matches.homeTeamId, teams.id)).orderBy(matches.kickoffAt);
}

export async function getPredictionEntryData(matchId: string) {
  if (!db) return { match: null, participants: [], predictions: [] };

  const [match] = await db.select().from(matches).where(eq(matches.id, matchId)).limit(1);
  const activeParticipants = await db.select().from(participants).where(eq(participants.isActive, true)).orderBy(participants.name);
  const existingPredictions = await db.select().from(predictions).where(eq(predictions.matchId, matchId));

  return { match: match ?? null, participants: activeParticipants, predictions: existingPredictions };
}

export async function saveBulkPredictions(formData: FormData) {
  if (!db) return;

  const matchId = String(formData.get("matchId") ?? "");
  const [match] = await db.select().from(matches).where(eq(matches.id, matchId)).limit(1);

  if (!match || match.kickoffAt <= new Date()) {
    return;
  }

  const participantIds = formData.getAll("participantId").map(String);

  await Promise.all(participantIds.map(async (participantId) => {
    const homeScoreValue = formData.get(`homeScore:${participantId}`);
    const awayScoreValue = formData.get(`awayScore:${participantId}`);

    if (homeScoreValue === null || awayScoreValue === null || homeScoreValue === "" || awayScoreValue === "") {
      return;
    }

    const homeScore = Number(homeScoreValue);
    const awayScore = Number(awayScoreValue);

    if (!Number.isInteger(homeScore) || !Number.isInteger(awayScore) || homeScore < 0 || awayScore < 0) {
      return;
    }

    const [existingPrediction] = await db.select().from(predictions).where(and(
      eq(predictions.matchId, matchId),
      eq(predictions.participantId, participantId),
    )).limit(1);

    if (existingPrediction) {
      await db.update(predictions).set({ homeScore, awayScore, updatedAt: new Date() }).where(eq(predictions.id, existingPrediction.id));
      return;
    }

    await db.insert(predictions).values({ matchId, participantId, homeScore, awayScore });
  }));

  revalidatePath(`/admin/predictions/${matchId}`);
}
