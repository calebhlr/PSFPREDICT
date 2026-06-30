import type { MatchStatus } from "@/types/domain";
import type { ApiFootballFixtureStatusShort } from "./types";

export function mapFixtureStatus(status: ApiFootballFixtureStatusShort): MatchStatus {
  if (["1H", "2H", "ET", "BT", "P", "LIVE"].includes(status)) return "live";
  if (status === "HT") return "halftime";
  if (["FT", "AET", "PEN"].includes(status)) return "finished";
  if (status === "PST") return "postponed";
  if (["CANC", "ABD", "AWD", "WO"].includes(status)) return "cancelled";
  return "scheduled";
}
