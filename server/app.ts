import { Hono } from "hono";
import { healthRoute } from "./routes/health";

export const server = new Hono().route("/", healthRoute);
export type Server = typeof server;
