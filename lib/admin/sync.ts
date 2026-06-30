"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { apiFootballClient } from "@/lib/api-football/client";
import { mapFixtureStatus } from "@/lib/api-football/mappers";
import { db } from "@/lib/db";
import { matches } from "@/lib/db/schema";
import { recalculateFinishedMatches, recalculateMatchScore } from "@/lib/ranking/recalculate";

export async function getSyncStatus() {
  if (!db) {
    return { configured: false, totalMatches: 0, liveMatches: 0, finishedMatches: 0, lastSyncedAt: null as Date | null };
  }

  const allMatches = await db.select().from(matches);

  return {
    configured: true,
    totalMatches: allMatches.length,
    liveMatches: allMatches.filter((match) => match.status === "live" || match.status === "halftime").length,
    finishedMatches: allMatches.filter((match) => match.status === "finished").length,
    lastSyncedAt: allMatches.reduce<Date | null>((latest, match) => {
      if (!match.syncedAt) return latest;
      if (!latest || match.syncedAt > latest) return match.syncedAt;
      return latest;
    }, null),
  };
}

export async function forceFixtureResync(formData: FormData) {
  if (!db) return;

  const fixtureId = Number(formData.get("fixtureId"));
  if (!Number.isInteger(fixtureId)) return;

  const response = await apiFootballClient.getFixture(fixtureId);
  const fixture = response.response[0];
  if (!fixture) return;

  const status = mapFixtureStatus(fixture.fixture.status.short);

  const [match] = await db.update(matches).set({
    status,
    kickoffAt: new Date(fixture.fixture.date),
    venueName: fixture.fixture.venue?.name ?? null,
    round: fixture.league.round ?? null,
    homeScore: fixture.goals.home,
    awayScore: fixture.goals.away,
    rawPayload: fixture,
    syncedAt: new Date(),
    updatedAt: new Date(),
  }).where(eq(matches.apiFootballFixtureId, fixtureId)).returning();

  if (match && status === "finished") {
    await recalculateMatchScore(match.id);
  }

  revalidatePath("/admin/sync");
}

export async function forceRankingRecalculation() {
  await recalculateFinishedMatches();
  revalidatePath("/ranking");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/sync");
}
