# Validação do Header

- Regras de hierarquia, movimento, duplicação e datas: `node --test lib/planner.test.mjs`.
- Tipos: `npx tsc --noEmit`.
- Build: `npm run build`.
- Prévia isolada: `node node_modules/vite/bin/vite.js --config tests/preview/vite.config.mjs`, em http://127.0.0.1:5174.

A prévia importa os componentes reais sem credenciais e não altera o Neon. A integração completa é conferida no localhost com uma conta de teste.

Fluxos conferidos no navegador: navegação, criação de lista e subtarefa, duplicação, mudança de dia com descendentes, confirmação e exclusão, criação de evento, conclusão de hábito, check-in de desafio e histórico, salvamento de tema e abertura do perfil.

O acesso real autenticado, as rotas e o banco Neon devem ser conferidos juntos; testes visuais isolados não comprovam permissões/configurações externas.

O aplicativo Android existente sincroniza tarefas. As tabelas web de calendário, hábitos e desafios exigem suporte adicional no Android para sincronizar essas áreas também.
