# Fase 2 — Admin Panel

Esta fase adiciona a superfície operacional da V1 para o admin único da PSF.

## Incluído

- Shell visual do admin com navegação para dashboard, participantes, palpites e sync.
- Middleware de proteção para rotas `/admin/*`, exceto `/admin/login`, baseado no cookie de sessão do Better Auth.
- Tela de login visual para conectar ao client Better Auth.
- Dashboard com atalhos para as operações principais.
- CRUD server-side de participantes: criar, editar e desativar.
- Seleção de partida para entrada de palpites.
- Tela de palpites em bulk por partida e participante ativo.
- Bloqueio automático de inputs e salvamento quando o kickoff já passou.
- Tela de sync com métricas, resync manual por fixture ID e fallback de recálculo de ranking.

## Observações

As ações server-side retornam silenciosamente quando `DATABASE_URL` não está configurado, permitindo que a interface seja renderizada em ambientes de preview sem banco.
