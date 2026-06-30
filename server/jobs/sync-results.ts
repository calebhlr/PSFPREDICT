import { eq, inArray } from "drizzle-orm";
import { apiFootballClient } from "@/lib/api-football/client";
import { mapFixtureStatus } from "@/lib/api-football/mappers";
import { db } from "@/lib/db";
import { matches } from "@/lib/db/schema";
import { recalculateMatchScore } from "@/lib/ranking/recalculate";

const LIVE_STATUSES = ["live", "halftime"] as const;
const ACTIVE_SYNC_WINDOW_MINUTES = 150;

export async function syncLiveAndRecentResults(now = new Date()) {
  if (!db) return { checked: 0, finalized: 0 };

  const candidates = await db.select().from(matches).where(inArray(matches.status, [...LIVE_STATUSES, "scheduled"]));
  const windowedCandidates = candidates.filter((match) => {
    const diffMinutes = Math.abs(match.kickoffAt.getTime() - now.getTime()) / 60_000;
    return match.status !== "scheduled" || diffMinutes <= ACTIVE_SYNC_WINDOW_MINUTES;
  });

  let finalized = 0;

  for (const match of windowedCandidates) {
    const response = await apiFootballClient.getFixture(match.apiFootballFixtureId);
    const fixture = response.response[0];
    if (!fixture) continue;

    const status = mapFixtureStatus(fixture.fixture.status.short);
    const wasFinished = match.status === "finished";
    const isFinished = status === "finished";

    await db.update(matches).set({
      status,
      kickoffAt: new Date(fixture.fixture.date),
      venueName: fixture.fixture.venue?.name ?? match.venueName,
      round: fixture.league.round ?? match.round,
      homeScore: fixture.goals.home,
      awayScore: fixture.goals.away,
      rawPayload: fixture,
      syncedAt: now,
      updatedAt: now,
    }).where(eq(matches.id, match.id));

    if (isFinished && !wasFinished) {
      await recalculateMatchScore(match.id);
      finalized += 1;
    }
  }

  return { checked: windowedCandidates.length, finalized };
}

export function shouldUseFastPolling(now = new Date()) {
  const hour = now.getUTCHours();
  return hour >= 14 && hour <= 23;
}
