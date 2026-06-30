# Fase 3 — Pontuação, Ranking, Sync e Feed

Esta fase conecta o resultado oficial das partidas ao núcleo competitivo do PSF Predict.

## Incluído

- Serviço de pontuação V1 com placar exato, resultado correto e erro.
- Recalcular pontos de todos os palpites de uma partida encerrada.
- Recalcular ranking global com desempate por placares exatos.
- Persistir snapshots de ranking com posição anterior para cálculo de tendência.
- Gerar eventos automáticos do feed após partidas encerradas:
  - partida finalizada;
  - acerto único de placar exato;
  - mudança de liderança;
  - maior queda de posição.
- Job de sync de resultados via API-Football para partidas ao vivo/recentes.
- Worker Scheduled para Cloudflare chamar o job de sync.
- Admin fallback conectado ao recálculo real de partidas encerradas.

## Estratégia operacional

- O worker consulta partidas em janela ativa e atualiza status/placar.
- Quando uma partida muda para `finished`, o sistema recalcula a partida, ranking e feed.
- O botão administrativo de recálculo reprocessa partidas encerradas como fallback manual.
