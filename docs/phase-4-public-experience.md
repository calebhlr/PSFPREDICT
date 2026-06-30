# Fase 4 — Páginas Públicas

Esta fase transforma os dados operacionais em uma experiência pública mobile-first para a comunidade PSF.

## Incluído

- Home pública respondendo rapidamente:
  - próximo jogo;
  - líder atual;
  - últimos eventos do feed.
- Lista de partidas agrupada por rodada/fase com status visual.
- Tela de partida com placar oficial, contexto, estádio e data local.
- Palpites ocultos antes do kickoff e revelados automaticamente após o bloqueio.
- Ranking público em cards, sem tabelas, com pontos, exatos, tendência e aproveitamento.
- Feed público de eventos automáticos gerados pelo recálculo.
- Query layer pública isolada para manter SSR simples e reutilizável.

## Observações

As páginas retornam empty states amigáveis quando o banco ainda não está configurado ou quando a sincronização inicial ainda não importou partidas, ranking ou feed.
