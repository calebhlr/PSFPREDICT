import { getFeed } from "@/lib/public/queries";

export default async function FeedPage() {
  const feed = await getFeed();

  return (
    <main className="mx-auto grid max-w-3xl gap-6 px-5 py-8 sm:px-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-psf-blue">Feed</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] sm:text-6xl">A história da rodada</h1>
        <p className="mt-3 text-text-secondary">Eventos automáticos gerados após resultados e recálculo do ranking.</p>
      </header>
      <section className="grid gap-3">
        {feed.length === 0 ? <div className="rounded-[2rem] border border-dashed border-border bg-card p-8 text-text-secondary">Nenhum evento gerado ainda.</div> : feed.map((event) => (
          <article key={event.id} className="rounded-[2rem] border border-border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-secondary">{event.type.replaceAll("_", " ")}</p>
            <h2 className="mt-3 text-xl font-black tracking-[-0.03em]">{event.title}</h2>
            {event.body ? <p className="mt-2 text-text-secondary">{event.body}</p> : null}
            <time className="mt-4 block text-xs text-muted">{new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(event.createdAt)}</time>
          </article>
        ))}
      </section>
    </main>
  );
}
