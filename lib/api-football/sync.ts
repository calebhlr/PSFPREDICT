import { apiFootballClient } from "./client";
import { mapFixtureStatus } from "./mappers";

export async function previewWorldCupSync() {
  const [fixtures, teams] = await Promise.all([
    apiFootballClient.listWorldCupFixtures(),
    apiFootballClient.listWorldCupTeams(),
  ]);

  return {
    fixtures: fixtures.response.map((fixture) => ({
      apiFootballFixtureId: fixture.fixture.id,
      kickoffAt: fixture.fixture.date,
      status: mapFixtureStatus(fixture.fixture.status.short),
      homeTeam: fixture.teams.home.name,
      awayTeam: fixture.teams.away.name,
      round: fixture.league.round ?? null,
      venueName: fixture.fixture.venue?.name ?? null,
      homeScore: fixture.goals.home,
      awayScore: fixture.goals.away,
    })),
    teams: teams.response.map(({ team }) => ({
      apiFootballId: team.id,
      name: team.name,
      code: team.code ?? null,
      country: team.country ?? null,
      flagUrl: team.logo ?? null,
    })),
  };
}
