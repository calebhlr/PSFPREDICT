import { env } from "@/lib/utils/env";
import type { ApiFootballFixture, ApiFootballResponse, ApiFootballTeam } from "./types";

const WORLD_CUP_LEAGUE_ID = 1;
const WORLD_CUP_SEASON = 2026;

export class ApiFootballError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = "ApiFootballError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!env.API_FOOTBALL_KEY) {
    throw new ApiFootballError("API_FOOTBALL_KEY is required to call API-Football");
  }

  const response = await fetch(`https://${env.API_FOOTBALL_HOST}${path}`, {
    ...init,
    headers: {
      "x-rapidapi-host": env.API_FOOTBALL_HOST,
      "x-rapidapi-key": env.API_FOOTBALL_KEY,
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new ApiFootballError(`API-Football request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const apiFootballClient = {
  listWorldCupFixtures(season = WORLD_CUP_SEASON) {
    return request<ApiFootballResponse<ApiFootballFixture>>(
      `/fixtures?league=${WORLD_CUP_LEAGUE_ID}&season=${season}`,
    );
  },
  getFixture(id: number) {
    return request<ApiFootballResponse<ApiFootballFixture>>(`/fixtures?id=${id}`);
  },
  listWorldCupTeams(season = WORLD_CUP_SEASON) {
    return request<ApiFootballResponse<ApiFootballTeam>>(
      `/teams?league=${WORLD_CUP_LEAGUE_ID}&season=${season}`,
    );
  },
};
