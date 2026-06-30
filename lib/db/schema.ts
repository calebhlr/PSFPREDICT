import { relations, sql } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const matchStatusEnum = pgEnum("match_status", [
  "scheduled",
  "live",
  "halftime",
  "finished",
  "postponed",
  "cancelled",
]);

export const predictionOutcomeEnum = pgEnum("prediction_outcome", ["exact", "result", "miss", "pending"]);

export const feedEventTypeEnum = pgEnum("feed_event_type", [
  "exact_score",
  "leader_changed",
  "position_changed",
  "match_finished",
]);

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull().default("PSF Admin"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const participants = pgTable("participants", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  avatarUrl: text("avatar_url"),
  favoriteTeam: text("favorite_team"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const teams = pgTable("teams", {
  id: uuid("id").defaultRandom().primaryKey(),
  apiFootballId: integer("api_football_id").notNull().unique(),
  name: text("name").notNull(),
  code: text("code"),
  country: text("country"),
  flagUrl: text("flag_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const matches = pgTable(
  "matches",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    apiFootballFixtureId: integer("api_football_fixture_id").notNull().unique(),
    homeTeamId: uuid("home_team_id").references(() => teams.id),
    awayTeamId: uuid("away_team_id").references(() => teams.id),
    kickoffAt: timestamp("kickoff_at", { withTimezone: true }).notNull(),
    venueName: text("venue_name"),
    stage: text("stage"),
    round: text("round"),
    status: matchStatusEnum("status").default("scheduled").notNull(),
    homeScore: integer("home_score"),
    awayScore: integer("away_score"),
    rawPayload: jsonb("raw_payload").default(sql`'{}'::jsonb`).notNull(),
    syncedAt: timestamp("synced_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({ kickoffIdx: uniqueIndex("matches_fixture_idx").on(table.apiFootballFixtureId) }),
);

export const predictions = pgTable(
  "predictions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    matchId: uuid("match_id").notNull().references(() => matches.id, { onDelete: "cascade" }),
    participantId: uuid("participant_id").notNull().references(() => participants.id, { onDelete: "cascade" }),
    homeScore: integer("home_score").notNull(),
    awayScore: integer("away_score").notNull(),
    points: integer("points").default(0).notNull(),
    outcome: predictionOutcomeEnum("outcome").default("pending").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({ participantMatchIdx: uniqueIndex("predictions_participant_match_idx").on(table.participantId, table.matchId) }),
);

export const rankingSnapshots = pgTable("ranking_snapshots", {
  id: uuid("id").defaultRandom().primaryKey(),
  participantId: uuid("participant_id").notNull().references(() => participants.id, { onDelete: "cascade" }),
  position: integer("position").notNull(),
  previousPosition: integer("previous_position"),
  totalPoints: integer("total_points").default(0).notNull(),
  exactScores: integer("exact_scores").default(0).notNull(),
  hitRate: integer("hit_rate").default(0).notNull(),
  calculatedAt: timestamp("calculated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const feedEvents = pgTable("feed_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: feedEventTypeEnum("type").notNull(),
  title: text("title").notNull(),
  body: text("body"),
  matchId: uuid("match_id").references(() => matches.id, { onDelete: "set null" }),
  participantId: uuid("participant_id").references(() => participants.id, { onDelete: "set null" }),
  metadata: jsonb("metadata").default(sql`'{}'::jsonb`).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const participantsRelations = relations(participants, ({ many }) => ({
  predictions: many(predictions),
  rankings: many(rankingSnapshots),
  feedEvents: many(feedEvents),
}));

export const matchesRelations = relations(matches, ({ one, many }) => ({
  homeTeam: one(teams, { fields: [matches.homeTeamId], references: [teams.id] }),
  awayTeam: one(teams, { fields: [matches.awayTeamId], references: [teams.id] }),
  predictions: many(predictions),
  feedEvents: many(feedEvents),
}));

export const predictionsRelations = relations(predictions, ({ one }) => ({
  match: one(matches, { fields: [predictions.matchId], references: [matches.id] }),
  participant: one(participants, { fields: [predictions.participantId], references: [participants.id] }),
}));
