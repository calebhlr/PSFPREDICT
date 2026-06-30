export type ApiFootballFixtureStatusShort = "TBD" | "NS" | "1H" | "HT" | "2H" | "ET" | "BT" | "P" | "SUSP" | "INT" | "FT" | "AET" | "PEN" | "PST" | "CANC" | "ABD" | "AWD" | "WO" | "LIVE";

export type ApiFootballFixture = {
  fixture: {
    id: number;
    date: string;
    status: { short: ApiFootballFixtureStatusShort; long: string; elapsed: number | null };
    venue?: { name?: string | null; city?: string | null };
  };
  league: { id: number; name: string; season: number; round?: string | null };
  teams: {
    home: { id: number; name: string; logo?: string | null; winner?: boolean | null };
    away: { id: number; name: string; logo?: string | null; winner?: boolean | null };
  };
  goals: { home: number | null; away: number | null };
};

export type ApiFootballTeam = {
  team: { id: number; name: string; code?: string | null; country?: string | null; logo?: string | null };
};

export type ApiFootballResponse<T> = {
  get: string;
  parameters: Record<string, string>;
  errors: unknown[] | Record<string, unknown>;
  results: number;
  paging: { current: number; total: number };
  response: T[];
};
