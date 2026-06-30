import { createParticipant, deactivateParticipant, listParticipants, updateParticipant } from "@/lib/admin/participants";

export default async function ParticipantsPage() {
  const participants = await listParticipants();

  return (
    <section className="grid gap-6">
      <div className="rounded-[2rem] border border-border bg-card p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-psf-blue">Participantes</p>
        <h2 className="mt-3 text-3xl font-black tracking-[-0.04em]">Gerenciar comunidade</h2>
        <p className="mt-2 text-text-secondary">Crie, edite ou desative participantes sem liberar cadastro público.</p>
      </div>

      <form action={createParticipant} className="grid gap-3 rounded-[2rem] border border-border bg-surface p-5 sm:grid-cols-5">
        <input className="rounded-2xl border border-border bg-card px-4 py-3" name="name" placeholder="Nome" required />
        <input className="rounded-2xl border border-border bg-card px-4 py-3" name="username" placeholder="username" required />
        <input className="rounded-2xl border border-border bg-card px-4 py-3" name="favoriteTeam" placeholder="Time favorito" />
        <input className="rounded-2xl border border-border bg-card px-4 py-3" name="avatarUrl" placeholder="Avatar URL" />
        <button className="rounded-2xl bg-psf-blue px-4 py-3 font-bold" type="submit">Criar</button>
      </form>

      <div className="grid gap-3">
        {participants.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-border bg-card p-6 text-text-secondary">Nenhum participante cadastrado ainda.</div>
        ) : participants.map((participant) => (
          <article key={participant.id} className="grid gap-3 rounded-[2rem] border border-border bg-card p-5">
            <form action={updateParticipant} className="grid gap-3 sm:grid-cols-6">
              <input name="id" type="hidden" value={participant.id} />
              <input className="rounded-2xl border border-border bg-surface px-4 py-3" name="name" defaultValue={participant.name} />
              <input className="rounded-2xl border border-border bg-surface px-4 py-3" name="username" defaultValue={participant.username} />
              <input className="rounded-2xl border border-border bg-surface px-4 py-3" name="favoriteTeam" defaultValue={participant.favoriteTeam ?? ""} />
              <input className="rounded-2xl border border-border bg-surface px-4 py-3" name="avatarUrl" defaultValue={participant.avatarUrl ?? ""} />
              <span className="rounded-2xl border border-border bg-surface px-4 py-3 text-center text-sm text-text-secondary">{participant.isActive ? "Ativo" : "Inativo"}</span>
              <button className="rounded-2xl bg-psf-blue px-4 py-3 font-bold" type="submit">Salvar</button>
            </form>
            {participant.isActive ? (
              <form action={deactivateParticipant}>
                <input name="id" type="hidden" value={participant.id} />
                <button className="text-sm font-semibold text-danger" type="submit">Desativar participante</button>
              </form>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
