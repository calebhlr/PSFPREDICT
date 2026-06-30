import { syncLiveAndRecentResults, shouldUseFastPolling } from "@/server/jobs/sync-results";

type ScheduledContext = {
  waitUntil(promise: Promise<unknown>): void;
};

export default {
  async scheduled(_event: unknown, _env: unknown, ctx: ScheduledContext) {
    ctx.waitUntil(syncLiveAndRecentResults());
  },
};

export { shouldUseFastPolling };
