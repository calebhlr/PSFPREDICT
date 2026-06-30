import { forceFixtureResync, forceRankingRecalculation, getSyncStatus } from "@/lib/admin/sync";

export default async function SyncPage() {
  const status = await getSyncStatus();

  return (
    <section className="grid gap-6">
      <div className="rounded-[2rem] border border-border bg-card p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-psf-blue">Sincronização</p>
        <h2 className="mt-3 text-3xl font-black tracking-[-0.04em]">Status da API e fallbacks</h2>
        <p className="mt-2 text-text-secondary">Use esta tela para diagnosticar dados da API-Football e acionar resyncs manuais.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <Metric label="Banco" value={status.configured ? "Online" : "Sem DATABASE_URL"} />
        <Metric label="Partidas" value={String(status.totalMatches)} />
        <Metric label="Ao vivo" value={String(status.liveMatches)} />
        <Metric label="Encerradas" value={String(status.finishedMatches)} />
      </div>

      <div className="rounded-[2rem] border border-border bg-card p-6 text-text-secondary">
        Última sync: {status.lastSyncedAt ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "medium" }).format(status.lastSyncedAt) : "ainda não registrada"}
      </div>

      <form action={forceFixtureResync} className="grid gap-3 rounded-[2rem] border border-border bg-surface p-5 sm:grid-cols-[1fr_auto]">
        <input className="rounded-2xl border border-border bg-card px-4 py-3" min={1} name="fixtureId" placeholder="API-Football fixture ID" required type="number" />
        <button className="rounded-2xl bg-psf-blue px-5 py-3 font-bold" type="submit">Forçar resync</button>
      </form>

      <form action={forceRankingRecalculation} className="rounded-[2rem] border border-border bg-surface p-5">
        <button className="rounded-2xl border border-border bg-card px-5 py-3 font-bold" type="submit">Forçar recálculo do ranking</button>
      </form>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[2rem] border border-border bg-card p-5">
      <p className="text-sm text-text-secondary">{label}</p>
      <strong className="mt-2 block text-2xl font-black tracking-[-0.04em]">{value}</strong>
    </div>
  );
}
