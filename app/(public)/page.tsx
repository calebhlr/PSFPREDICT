import Link from "next/link";
import { getHomeData } from "@/lib/public/queries";

export default async function HomePage() {
  const { nextMatch, ranking, feed } = await getHomeData();
  const leader = ranking[0];

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-5 py-8 sm:px-8">
      <section className="grid gap-6 rounded-[2.5rem] border border-border bg-surface/80 p-6 shadow-2xl shadow-black/20 sm:p-10">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-psf-blue">PSF Predict</p>
          <h1 className="text-5xl font-black tracking-[-0.06em] text-foreground sm:text-7xl">A Copa da PSF começa aqui.</h1>
          <p className="text-lg leading-8 text-text-secondary">Próximo jogo, liderança e acontecimentos recentes em uma tela escaneável em segundos.</p>
        </div>
        <nav className="flex flex-wrap gap-3 text-sm font-semibold">
          <Link className="rounded-full bg-psf-blue px-5 py-3 text-white" href="/games">Ver partidas</Link>
          <Link className="rounded-full border border-border bg-card px-5 py-3 text-white" href="/ranking">Ranking</Link>
          <Link className="rounded-full border border-border bg-card px-5 py-3 text-white" href="/feed">Feed</Link>
        </nav>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <article className="rounded-[2rem] border border-border bg-card p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-text-secondary">Próximo jogo</p>
          {nextMatch ? (
            <Link className="mt-6 block" href={`/games/${nextMatch.id}`}>
              <div className="flex items-center justify-between gap-4 text-2xl font-black tracking-[-0.04em] sm:text-4xl">
                <span>{nextMatch.homeTeam?.name ?? "Casa"}</span>
                <span className="text-text-secondary">×</span>
                <span className="text-right">{nextMatch.awayTeam?.name ?? "Fora"}</span>
              </div>
              <p className="mt-4 text-text-secondary">{new Intl.DateTimeFormat("pt-BR", { dateStyle: "full", timeStyle: "short" }).format(nextMatch.kickoffAt)}</p>
            </Link>
          ) : <p className="mt-6 text-text-secondary">Nenhuma partida sincronizada ainda.</p>}
        </article>

        <article className="rounded-[2rem] border border-border bg-card p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-text-secondary">Líder</p>
          {leader ? (
            <div className="mt-6">
              <p className="text-3xl font-black tracking-[-0.04em]">{leader.name}</p>
              <p className="mt-2 text-text-secondary">{leader.totalPoints} pontos · {leader.exactScores} exatos</p>
            </div>
          ) : <p className="mt-6 text-text-secondary">Ranking será exibido após o primeiro resultado.</p>}
        </article>
      </section>

      <section className="rounded-[2rem] border border-border bg-card p-6">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-text-secondary">Última rodada</p>
          <Link className="text-sm font-bold text-psf-blue" href="/feed">Ver feed</Link>
        </div>
        <div className="mt-5 grid gap-3">
          {feed.length === 0 ? <p className="text-text-secondary">Os eventos aparecerão após partidas encerradas.</p> : feed.map((event) => (
            <div key={event.id} className="rounded-2xl border border-border bg-surface p-4">
              <p className="font-bold">{event.title}</p>
              {event.body ? <p className="mt-1 text-sm text-text-secondary">{event.body}</p> : null}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
