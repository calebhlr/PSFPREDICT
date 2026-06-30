import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url().optional(),
  BETTER_AUTH_SECRET: z.string().min(32).optional(),
  BETTER_AUTH_URL: z.string().url().optional(),
  API_FOOTBALL_KEY: z.string().optional(),
  API_FOOTBALL_HOST: z.string().default("v3.football.api-sports.io"),
});

export const env = envSchema.parse(process.env);
