import Link from "next/link";
import { listPredictionMatches } from "@/lib/admin/predictions";

export default async function PredictionsPage() {
  const matches = await listPredictionMatches();

  return (
    <section className="grid gap-6">
      <div className="rounded-[2rem] border border-border bg-card p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-psf-blue">Palpites</p>
        <h2 className="mt-3 text-3xl font-black tracking-[-0.04em]">Escolha uma partida</h2>
        <p className="mt-2 text-text-secondary">Os palpites só podem ser salvos antes do kickoff.</p>
      </div>
      <div className="grid gap-3">
        {matches.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-border bg-card p-6 text-text-secondary">Nenhuma partida sincronizada ainda.</div>
        ) : matches.map((match) => {
          const locked = match.kickoffAt <= new Date();
          return (
            <Link key={match.id} className="flex items-center justify-between rounded-[2rem] border border-border bg-card p-5 transition hover:border-psf-blue" href={`/admin/predictions/${match.id}`}>
              <div>
                <p className="font-bold">{match.round ?? "Rodada"}</p>
                <p className="text-sm text-text-secondary">{new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(match.kickoffAt)}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${locked ? "bg-danger/20 text-danger" : "bg-success/20 text-success"}`}>
                {locked ? "Bloqueado" : "Aberto"}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
