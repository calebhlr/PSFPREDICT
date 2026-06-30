import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/lib/db/schema";

const connectionString = process.env.DATABASE_URL;

export const client = connectionString
  ? postgres(connectionString, { prepare: false })
  : undefined;

export const db = client ? drizzle(client, { schema }) : undefined;

export type Database = NonNullable<typeof db>;
