export default function LoginPage() {
  return (
    <section className="grid gap-6 rounded-[2rem] border border-border bg-card p-6 sm:p-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-psf-blue">Acesso protegido</p>
        <h2 className="mt-3 text-3xl font-black tracking-[-0.04em]">Entrar como admin</h2>
        <p className="mt-2 max-w-2xl text-text-secondary">
          A V1 tem um único usuário autenticado. A integração Better Auth já está configurada; a tela visual fica pronta para conectar ao client de sessão na próxima etapa de hardening.
        </p>
      </div>
      <form className="grid gap-4 sm:max-w-md">
        <label className="grid gap-2 text-sm font-semibold text-text-secondary">
          E-mail
          <input className="rounded-2xl border border-border bg-surface px-4 py-3 text-white outline-none ring-psf-blue focus:ring-2" placeholder="admin@psf.com" type="email" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-text-secondary">
          Senha
          <input className="rounded-2xl border border-border bg-surface px-4 py-3 text-white outline-none ring-psf-blue focus:ring-2" placeholder="••••••••" type="password" />
        </label>
        <button className="rounded-full bg-psf-blue px-5 py-3 text-sm font-bold text-white" type="button">Entrar</button>
      </form>
    </section>
  );
}
