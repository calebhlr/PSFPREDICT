import Link from "next/link";

const cards = [
  { label: "Participantes", value: "CRUD", href: "/admin/participants" },
  { label: "Palpites", value: "Bulk", href: "/admin/predictions" },
  { label: "Sincronização", value: "API", href: "/admin/sync" },
];

export default function DashboardPage() {
  return (
    <section className="grid gap-5 sm:grid-cols-3">
      {cards.map((card) => (
        <Link key={card.href} className="rounded-[2rem] border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-psf-blue" href={card.href}>
          <p className="text-sm text-text-secondary">{card.label}</p>
          <strong className="mt-3 block text-3xl font-black tracking-[-0.04em]">{card.value}</strong>
        </Link>
      ))}
    </section>
  );
}
