# Header

Organizador pessoal em Next.js/Vinext com navegação liquid glass, planejamento semanal, calendário, hábitos, desafios, finanças, Pomodoro e personalização.

## Plataforma

- Hospedagem e deploy: Vercel
- Banco relacional: Neon Postgres conectado pelo Vercel Marketplace
- Autenticação: Better Auth com usuários e sessões no Neon
- Imagens financeiras: Vercel Blob

O navegador nunca recebe a senha do banco. Todas as leituras e gravações passam por rotas autenticadas em `/api` e o `owner_id` é definido no servidor.

## Configuração local

1. Conecte o checkout ao projeto `header-web` da Vercel.
2. Execute `vercel env pull .env.local --yes`.
3. Confirme que `.env.local` contém `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` e a configuração do Blob.
4. Instale dependências com `npm ci`.
5. Aplique as tabelas do Better Auth e depois `npm run db:workspace`.
6. Inicie com `npm run dev`; o endereço local padrão é `http://localhost:2000`.

`.env.local` é ignorado pelo Git. Nunca coloque segredos em variáveis `NEXT_PUBLIC_*`.

## Verificação

- Tipos: `npx tsc --noEmit`
- Regras do planejador: `node --test lib/planner.test.mjs`
- Build: `npm run build`
- Fluxo completo: cadastro → sessão → criação de item → atualização do Neon → recarregamento da interface

O esquema dos dados do aplicativo está em `db/neon.sql`. O script `npm run db:workspace` usa `DATABASE_URL` do arquivo local e aplica esse esquema de forma idempotente.
