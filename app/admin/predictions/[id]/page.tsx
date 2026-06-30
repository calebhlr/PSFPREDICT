import { getPredictionEntryData, saveBulkPredictions } from "@/lib/admin/predictions";

export default async function PredictionEntryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { match, participants, predictions } = await getPredictionEntryData(id);

  if (!match) {
    return <div className="rounded-[2rem] border border-border bg-card p-6 text-text-secondary">Partida não encontrada.</div>;
  }

  const locked = match.kickoffAt <= new Date();
  const predictionByParticipant = new Map(predictions.map((prediction) => [prediction.participantId, prediction]));

  return (
    <section className="grid gap-6">
      <div className="rounded-[2rem] border border-border bg-card p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-psf-blue">Entrada em bulk</p>
        <h2 className="mt-3 text-3xl font-black tracking-[-0.04em]">Palpites da partida</h2>
        <p className="mt-2 text-text-secondary">
          Kickoff: {new Intl.DateTimeFormat("pt-BR", { dateStyle: "full", timeStyle: "short" }).format(match.kickoffAt)} · {locked ? "palpites bloqueados" : "palpites abertos"}
        </p>
      </div>

      <form action={saveBulkPredictions} className="grid gap-3 rounded-[2rem] border border-border bg-surface p-5">
        <input name="matchId" type="hidden" value={match.id} />
        {participants.length === 0 ? (
          <p className="text-text-secondary">Cadastre participantes ativos antes de inserir palpites.</p>
        ) : participants.map((participant) => {
          const prediction = predictionByParticipant.get(participant.id);
          return (
            <div key={participant.id} className="grid items-center gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-[1fr_96px_96px]">
              <div>
                <input name="participantId" type="hidden" value={participant.id} />
                <p className="font-bold">{participant.name}</p>
                <p className="text-sm text-text-secondary">@{participant.username}</p>
              </div>
              <input aria-label={`Placar mandante de ${participant.name}`} className="rounded-2xl border border-border bg-surface px-4 py-3 text-center" defaultValue={prediction?.homeScore ?? ""} disabled={locked} min={0} name={`homeScore:${participant.id}`} placeholder="Casa" type="number" />
              <input aria-label={`Placar visitante de ${participant.name}`} className="rounded-2xl border border-border bg-surface px-4 py-3 text-center" defaultValue={prediction?.awayScore ?? ""} disabled={locked} min={0} name={`awayScore:${participant.id}`} placeholder="Fora" type="number" />
            </div>
          );
        })}
        <button className="rounded-2xl bg-psf-blue px-5 py-3 font-bold disabled:cursor-not-allowed disabled:opacity-50" disabled={locked} type="submit">Salvar palpites</button>
      </form>
    </section>
  );
}
