import { getRanking } from "@/lib/public/queries";

export default async function RankingPage() {
  const ranking = await getRanking();

  return (
    <main className="mx-auto grid max-w-4xl gap-6 px-5 py-8 sm:px-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-psf-blue">Ranking</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] sm:text-6xl">Classificação geral</h1>
        <p className="mt-3 text-text-secondary">Cards modernos, sem tabelas. Desempate por número de placares exatos.</p>
      </header>
      <section className="grid gap-3">
        {ranking.length === 0 ? <div className="rounded-[2rem] border border-dashed border-border bg-card p-8 text-text-secondary">Ranking será exibido após o primeiro recálculo.</div> : ranking.map((row) => (
          <article key={row.participantId} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-[2rem] border border-border bg-card p-5">
            <div className="text-3xl font-black text-text-secondary">#{row.position}</div>
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <Avatar name={row.name} avatarUrl={row.avatarUrl} />
                <div>
                  <h2 className="font-black tracking-[-0.03em]">{row.name}</h2>
                  <p className="text-sm text-text-secondary">@{row.username}{row.favoriteTeam ? ` · ${row.favoriteTeam}` : ""}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black">{row.totalPoints}</p>
              <p className="text-xs text-text-secondary">{row.exactScores} exatos · {row.hitRate}%</p>
              <Trend current={row.position} previous={row.previousPosition} />
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

function Avatar({ name, avatarUrl }: { name: string; avatarUrl: string | null }) {
  if (avatarUrl) return <img alt="" className="size-12 rounded-full object-cover" src={avatarUrl} />;
  return <div className="grid size-12 place-items-center rounded-full bg-psf-blue font-black">{name.slice(0, 2).toUpperCase()}</div>;
}

function Trend({ current, previous }: { current: number; previous: number | null }) {
  if (!previous || previous === current) return <p className="text-xs font-bold text-text-secondary">= estável</p>;
  if (previous > current) return <p className="text-xs font-bold text-success">↑ subiu {previous - current}</p>;
  return <p className="text-xs font-bold text-danger">↓ caiu {current - previous}</p>;
}
