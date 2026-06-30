import Link from "next/link";
import { getMatches } from "@/lib/public/queries";

export default async function GamesPage() {
  const matches = await getMatches();
  const grouped = matches.reduce((groups, match) => {
    const key = match.round ?? match.stage ?? "Partidas";
    const group = groups.get(key) ?? [];
    group.push(match);
    groups.set(key, group);
    return groups;
  }, new Map<string, typeof matches[number][]>());

  return (
    <main className="mx-auto grid max-w-6xl gap-6 px-5 py-8 sm:px-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-psf-blue">Partidas</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] sm:text-6xl">Calendário da Copa</h1>
      </header>
      {matches.length === 0 ? <EmptyState /> : Array.from(grouped.entries()).map(([round, roundMatches]) => (
        <section key={round} className="grid gap-3">
          <h2 className="text-lg font-bold text-text-secondary">{round}</h2>
          {roundMatches.map((match) => (
            <Link key={match.id} className="rounded-[2rem] border border-border bg-card p-5 transition hover:border-psf-blue" href={`/games/${match.id}`}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xl font-black tracking-[-0.03em]">{match.homeTeam?.name ?? "Casa"} × {match.awayTeam?.name ?? "Fora"}</p>
                  <p className="mt-1 text-sm text-text-secondary">{new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(match.kickoffAt)} · {match.venueName ?? "Estádio a confirmar"}</p>
                </div>
                <StatusBadge status={match.status} />
              </div>
            </Link>
          ))}
        </section>
      ))}
    </main>
  );
}

function StatusBadge({ status }: { status: string }) {
  const label = status === "finished" ? "Encerrado" : status === "live" || status === "halftime" ? "Ao vivo" : "Agendado";
  const tone = status === "finished" ? "bg-muted/30 text-text-secondary" : status === "live" || status === "halftime" ? "bg-success/20 text-success" : "bg-psf-blue/20 text-psf-blue";
  return <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${tone}`}>{label}</span>;
}

function EmptyState() {
  return <div className="rounded-[2rem] border border-dashed border-border bg-card p-8 text-text-secondary">Nenhuma partida sincronizada ainda.</div>;
}
