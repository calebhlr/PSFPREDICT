import Link from "next/link";
import type { ReactNode } from "react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/participants", label: "Participantes" },
  { href: "/admin/predictions", label: "Palpites" },
  { href: "/admin/sync", label: "Sync" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-6 sm:px-8">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-border bg-surface/80 p-5 shadow-2xl shadow-black/20 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-psf-blue">Admin PSF</p>
            <h1 className="mt-2 text-2xl font-black tracking-[-0.04em]">Painel de controle</h1>
          </div>
          <nav className="flex flex-wrap gap-2 text-sm font-semibold text-text-secondary">
            {navItems.map((item) => (
              <Link key={item.href} className="rounded-full border border-border bg-card px-4 py-2 transition hover:text-white" href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        {children}
      </div>
    </main>
  );
}
