import Link from "next/link";
import { notFound } from "next/navigation";
import { getMatchDetail } from "@/lib/public/queries";

export default async function GameDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await getMatchDetail(id);

  if (!detail) {
    notFound();
    return null;
  }

  const { match, revealed, predictions } = detail;
  const finished = match.status === "finished";

  return (
    <main className="mx-auto grid max-w-5xl gap-6 px-5 py-8 sm:px-8">
      <Link className="text-sm font-bold text-text-secondary hover:text-white" href="/games">← Voltar para partidas</Link>

      <section className="rounded-[2.5rem] border border-border bg-card p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-psf-blue">{match.round ?? match.stage ?? "Partida"}</p>
        <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-4 text-center">
          <TeamBlock name={match.homeTeam?.name ?? "Casa"} flagUrl={match.homeTeam?.flagUrl ?? null} />
          <div>
            {finished ? (
              <p className="text-4xl font-black tracking-[-0.06em] sm:text-6xl">{match.homeScore}×{match.awayScore}</p>
            ) : (
              <p className="text-2xl font-black text-text-secondary">×</p>
            )}
            <p className="mt-2 rounded-full bg-surface px-3 py-1 text-xs font-bold text-text-secondary">{statusLabel(match.status)}</p>
          </div>
          <TeamBlock name={match.awayTeam?.name ?? "Fora"} flagUrl={match.awayTeam?.flagUrl ?? null} />
        </div>
        <p className="mt-6 text-center text-text-secondary">{new Intl.DateTimeFormat("pt-BR", { dateStyle: "full", timeStyle: "short" }).format(match.kickoffAt)} · {match.venueName ?? "Estádio a confirmar"}</p>
      </section>

      <section className="rounded-[2rem] border border-border bg-card p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-text-secondary">Palpites</p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">{revealed ? "Palpites revelados" : "Suspense até o kickoff"}</h2>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${revealed ? "bg-success/20 text-success" : "bg-warning/20 text-warning"}`}>
            {revealed ? "Revelado" : "Oculto"}
          </span>
        </div>

        {!revealed ? (
          <p className="mt-6 rounded-2xl border border-dashed border-border bg-surface p-5 text-text-secondary">Os palpites ficam ocultos até o início da partida para preservar o suspense da rodada.</p>
        ) : predictions.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-dashed border-border bg-surface p-5 text-text-secondary">Nenhum palpite registrado para esta partida.</p>
        ) : (
          <div className="mt-6 grid gap-3">
            {predictions.map((prediction) => (
              <article key={prediction.participantId} className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-4">
                <div>
                  <p className="font-bold">{prediction.name}</p>
                  <p className="text-sm text-text-secondary">@{prediction.username}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black">{prediction.homeScore}×{prediction.awayScore}</p>
                  <p className={`text-xs font-bold ${prediction.outcome === "exact" ? "text-success" : "text-text-secondary"}`}>{prediction.points} ponto{prediction.points === 1 ? "" : "s"}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function TeamBlock({ name, flagUrl }: { name: string; flagUrl: string | null }) {
  return (
    <div className="grid justify-items-center gap-3">
      {flagUrl ? <img alt="" className="size-14 rounded-full object-cover" src={flagUrl} /> : <div className="size-14 rounded-full bg-surface" />}
      <h1 className="text-xl font-black tracking-[-0.04em] sm:text-3xl">{name}</h1>
    </div>
  );
}

function statusLabel(status: string) {
  if (status === "finished") return "Encerrado";
  if (status === "live" || status === "halftime") return "Ao vivo";
  return "Agendado";
}
