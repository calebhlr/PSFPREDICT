"use server";

import { eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { feedEvents, matches, participants, predictions, teams } from "@/lib/db/schema";

type RankingRow = {
  participantId: string;
  position: number;
  previousPosition: number | null;
  totalPoints: number;
  exactScores: number;
  hitRate: number;
};

export async function generatePostMatchFeedEvents(matchId: string, rankingRows: RankingRow[]) {
  if (!db) return [];

  const [match] = await db.select().from(matches).where(eq(matches.id, matchId)).limit(1);
  if (!match) return [];

  const [homeTeam] = match.homeTeamId ? await db.select().from(teams).where(eq(teams.id, match.homeTeamId)).limit(1) : [];
  const [awayTeam] = match.awayTeamId ? await db.select().from(teams).where(eq(teams.id, match.awayTeamId)).limit(1) : [];
  const matchLabel = `${homeTeam?.name ?? "Casa"} × ${awayTeam?.name ?? "Fora"}`;

  const matchPredictions = await db.select().from(predictions).where(eq(predictions.matchId, matchId));
  const exactPredictions = matchPredictions.filter((prediction) => prediction.outcome === "exact");
  const participantIds = Array.from(new Set([
    ...exactPredictions.map((prediction) => prediction.participantId),
    ...rankingRows.map((row) => row.participantId),
  ]));
  const relatedParticipants = participantIds.length > 0
    ? await db.select().from(participants).where(inArray(participants.id, participantIds))
    : [];
  const participantById = new Map(relatedParticipants.map((participant) => [participant.id, participant]));

  const createdEvents = [];

  await db.insert(feedEvents).values({
    type: "match_finished",
    title: `${matchLabel} terminou ${match.homeScore ?? 0}×${match.awayScore ?? 0}`,
    body: "Resultado oficial registrado e ranking recalculado.",
    matchId,
    metadata: { homeScore: match.homeScore, awayScore: match.awayScore },
  });
  createdEvents.push("match_finished");

  if (exactPredictions.length === 1) {
    const prediction = exactPredictions[0];
    const participant = participantById.get(prediction.participantId);
    await db.insert(feedEvents).values({
      type: "exact_score",
      title: `${participant?.name ?? "Um participante"} acertou sozinho ${matchLabel}`,
      body: `Cravou ${prediction.homeScore}×${prediction.awayScore} e somou 1 ponto.`,
      matchId,
      participantId: prediction.participantId,
      metadata: { homeScore: prediction.homeScore, awayScore: prediction.awayScore },
    });
    createdEvents.push("exact_score");
  }

  const leader = rankingRows.find((row) => row.position === 1);
  if (leader && leader.previousPosition !== 1) {
    const participant = participantById.get(leader.participantId);
    await db.insert(feedEvents).values({
      type: "leader_changed",
      title: `${participant?.name ?? "Novo líder"} assumiu a liderança`,
      body: `Agora lidera com ${leader.totalPoints} pontos e ${leader.exactScores} placares exatos.`,
      participantId: leader.participantId,
      metadata: { totalPoints: leader.totalPoints, exactScores: leader.exactScores },
    });
    createdEvents.push("leader_changed");
  }

  const biggestDrop = rankingRows
    .filter((row) => row.previousPosition !== null && row.previousPosition < row.position)
    .sort((a, b) => (b.position - (b.previousPosition ?? b.position)) - (a.position - (a.previousPosition ?? a.position)))[0];

  if (biggestDrop) {
    const participant = participantById.get(biggestDrop.participantId);
    const delta = biggestDrop.position - (biggestDrop.previousPosition ?? biggestDrop.position);
    await db.insert(feedEvents).values({
      type: "position_changed",
      title: `${participant?.name ?? "Participante"} caiu ${delta} posições`,
      body: `Agora ocupa a ${biggestDrop.position}ª posição no ranking geral.`,
      participantId: biggestDrop.participantId,
      metadata: { from: biggestDrop.previousPosition, to: biggestDrop.position, delta },
    });
    createdEvents.push("position_changed");
  }

  return createdEvents;
}
