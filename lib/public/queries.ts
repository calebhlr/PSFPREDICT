import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { feedEvents, matches, participants, predictions, rankingSnapshots, teams } from "@/lib/db/schema";

export type PublicTeam = {
  id: string;
  name: string;
  code: string | null;
  flagUrl: string | null;
};

export type PublicMatch = {
  id: string;
  apiFootballFixtureId: number;
  kickoffAt: Date;
  venueName: string | null;
  stage: string | null;
  round: string | null;
  status: string;
  homeScore: number | null;
  awayScore: number | null;
  homeTeam: PublicTeam | null;
  awayTeam: PublicTeam | null;
};

export type PublicRankingRow = {
  participantId: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  favoriteTeam: string | null;
  position: number;
  previousPosition: number | null;
  totalPoints: number;
  exactScores: number;
  hitRate: number;
};

export type PublicFeedEvent = {
  id: string;
  type: string;
  title: string;
  body: string | null;
  createdAt: Date;
};

export type PublicPrediction = {
  participantId: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  homeScore: number;
  awayScore: number;
  points: number;
  outcome: string;
};

export async function getHomeData() {
  const [nextMatch, ranking, feed] = await Promise.all([
    getNextMatch(),
    getRanking(3),
    getFeed(3),
  ]);

  return { nextMatch, ranking, feed };
}

export async function getNextMatch() {
  const allMatches = await getMatches();
  const now = new Date();
  return allMatches.find((match) => match.kickoffAt >= now && match.status !== "finished") ?? allMatches[0] ?? null;
}

export async function getMatches(): Promise<PublicMatch[]> {
  if (!db) return [];

  const [matchRows, teamRows] = await Promise.all([
    db.select().from(matches).orderBy(matches.kickoffAt),
    db.select().from(teams),
  ]);
  const teamById = new Map(teamRows.map((team) => [team.id, team]));

  return matchRows.map((match) => ({
    id: match.id,
    apiFootballFixtureId: match.apiFootballFixtureId,
    kickoffAt: match.kickoffAt,
    venueName: match.venueName,
    stage: match.stage,
    round: match.round,
    status: match.status,
    homeScore: match.homeScore,
    awayScore: match.awayScore,
    homeTeam: toPublicTeam(match.homeTeamId ? teamById.get(match.homeTeamId) : undefined),
    awayTeam: toPublicTeam(match.awayTeamId ? teamById.get(match.awayTeamId) : undefined),
  }));
}

export async function getMatchDetail(matchId: string) {
  if (!db) return null;

  const [match] = (await getMatches()).filter((item) => item.id === matchId);
  if (!match) return null;

  const revealed = match.kickoffAt <= new Date();
  const predictionRows = await db.select().from(predictions).where(eq(predictions.matchId, matchId));
  const participantRows = await db.select().from(participants);
  const participantById = new Map(participantRows.map((participant) => [participant.id, participant]));

  const publicPredictions = revealed
    ? predictionRows.map((prediction) => {
      const participant = participantById.get(prediction.participantId);
      return {
        participantId: prediction.participantId,
        name: participant?.name ?? "Participante",
        username: participant?.username ?? "psf",
        avatarUrl: participant?.avatarUrl ?? null,
        homeScore: prediction.homeScore,
        awayScore: prediction.awayScore,
        points: prediction.points,
        outcome: prediction.outcome,
      };
    })
    : [];

  return { match, revealed, predictions: publicPredictions };
}

export async function getRanking(limit?: number): Promise<PublicRankingRow[]> {
  if (!db) return [];

  const [snapshotRows, participantRows] = await Promise.all([
    db.select().from(rankingSnapshots).orderBy(desc(rankingSnapshots.calculatedAt)),
    db.select().from(participants).where(eq(participants.isActive, true)),
  ]);
  const participantById = new Map(participantRows.map((participant) => [participant.id, participant]));
  const latestByParticipant = new Map<string, typeof snapshotRows[number]>();

  for (const snapshot of snapshotRows) {
    if (!latestByParticipant.has(snapshot.participantId)) {
      latestByParticipant.set(snapshot.participantId, snapshot);
    }
  }

  const rows = Array.from(latestByParticipant.values())
    .map((snapshot) => {
      const participant = participantById.get(snapshot.participantId);
      if (!participant) return null;
      return {
        participantId: snapshot.participantId,
        name: participant.name,
        username: participant.username,
        avatarUrl: participant.avatarUrl,
        favoriteTeam: participant.favoriteTeam,
        position: snapshot.position,
        previousPosition: snapshot.previousPosition,
        totalPoints: snapshot.totalPoints,
        exactScores: snapshot.exactScores,
        hitRate: snapshot.hitRate,
      } satisfies PublicRankingRow;
    })
    .filter((row): row is PublicRankingRow => Boolean(row))
    .sort((a, b) => a.position - b.position);

  return typeof limit === "number" ? rows.slice(0, limit) : rows;
}

export async function getFeed(limit?: number): Promise<PublicFeedEvent[]> {
  if (!db) return [];

  const rows = await db.select().from(feedEvents).orderBy(desc(feedEvents.createdAt));
  const mapped = rows.map((event) => ({
    id: event.id,
    type: event.type,
    title: event.title,
    body: event.body,
    createdAt: event.createdAt,
  }));

  return typeof limit === "number" ? mapped.slice(0, limit) : mapped;
}

function toPublicTeam(team?: typeof teams.$inferSelect): PublicTeam | null {
  if (!team) return null;
  return { id: team.id, name: team.name, code: team.code, flagUrl: team.flagUrl };
}
