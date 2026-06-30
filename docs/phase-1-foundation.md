# Fase 1 — Fundação

Esta fase estabelece a base técnica do PSF Predict para evoluir o MVP da Copa do Mundo FIFA 2026.

## Incluído

- Aplicação Next.js App Router com TypeScript e Tailwind CSS.
- Tema dark-first com tokens visuais da PSF.
- Estrutura de pastas modular para páginas públicas, admin, features, server e bibliotecas.
- Schema Drizzle/PostgreSQL para admin, participantes, seleções, partidas, palpites, ranking e feed.
- Client da API-Football com endpoints da Copa do Mundo 2026.
- Helpers de mapeamento/sync inicial para fixtures e teams.
- Configuração base de Better Auth para admin por e-mail e senha.
- App Hono mínimo com rota de healthcheck.
- Lógica de pontuação V1 isolada em `lib/scoring`.

## Próxima fase

A Fase 2 deve conectar o admin panel às entidades reais, implementar CRUD de participantes e construir a tela de inserção de palpites em bulk.
