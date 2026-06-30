import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-10">
      <section className="flex flex-1 flex-col justify-center gap-8">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-psf-blue">PSF Predict</p>
          <h1 className="max-w-3xl text-5xl font-black tracking-[-0.06em] text-foreground sm:text-7xl">
            A Copa da PSF começa aqui.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-text-secondary">
            Palpites, ranking e histórias da comunidade Pelada Sem Fronteiras em uma experiência rápida,
            escura e feita para acompanhar cada jogo.
          </p>
        </div>
        <nav className="flex flex-wrap gap-3 text-sm font-semibold">
          <Link className="rounded-full bg-psf-blue px-5 py-3 text-white" href="/games">Ver partidas</Link>
          <Link className="rounded-full border border-border bg-surface px-5 py-3 text-white" href="/ranking">Ranking</Link>
          <Link className="rounded-full border border-border bg-surface px-5 py-3 text-white" href="/feed">Feed</Link>
        </nav>
      </section>
    </main>
  );
}
