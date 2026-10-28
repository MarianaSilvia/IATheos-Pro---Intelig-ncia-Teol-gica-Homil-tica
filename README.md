# IATheos Pro — backend QI Store Pro

Aplicação React/Express de estudo bíblico. Código no GitHub; autenticação e dados no Supabase **QI Store Pro**, projeto `idrumlpdobiackcnhdas`, São Paulo. O nome da interface permanece IATheos Pro; QI Store Pro é o nome do projeto Supabase solicitado.

## Materiais e cobrança

Os arquivos ficam em uma nuvem externa. O administrador cadastra um **link HTTPS**; nenhum PDF é enviado ou armazenado no Supabase. O catálogo não contém o endereço. A API confere sessão, concessão individual ou benefício de assinatura e só então libera o link. Arquivamento impede novas concessões e preserva direitos anteriores.

**Pagamentos:** o fluxo está preparado para o Checkout Integrado da InfinitePay. As chaves são somente de servidor e o webhook exige HMAC, valida o pedido/valor e é idempotente. A aprovação administrativa continua necessária antes da liberação do link do Google Drive.

Um link externo estático pode ser compartilhado depois de revelado. Expiração e proteção do arquivo dependem da nuvem externa: quando ela for escolhida, integrar URLs temporárias ou sua API de acesso. Não cadastrar URLs assinadas que expirem como links permanentes de produtos. O sistema não consegue garantir disponibilidade nem forçar download de arquivos controlados por terceiros.

## Uso local

Node >=22.14 e npm. Para a pilha Supabase local, instalar Docker Desktop ou Podman e iniciar o motor de contêineres.

```sh
npm ci --ignore-scripts
npm run supabase:start
```

Copiar `.env.example` para `.env` e preencher URL e chave **publicável** local nas variáveis correspondentes do servidor e Vite. As migrações em `supabase/migrations/` são aplicadas na inicialização local. Storage e seed estão desativados. `npm run supabase:stop` encerra os contêineres. Não executar reset contra a nuvem.

```sh
npm run dev
npm run lint
npm test
npm run test:integration
npm run supabase:test
npm run build
```

Aplicação: http://127.0.0.1:3000. O teste SQL executa uma transação com `ROLLBACK`, sem deixar usuários ou materiais de demonstração. Os testes HTTP não dependem de conta ou cobrança real.

Para usar o projeto remoto, configurar `SUPABASE_URL` e `VITE_SUPABASE_URL` com `https://idrumlpdobiackcnhdas.supabase.co`, suas chaves publicáveis e `ALLOW_REMOTE_SUPABASE=true`. O servidor recusa outros destinos remotos. `.env` é ignorado pelo Git.

## Autenticação e primeiro administrador

O administrador usa e-mail e senha. Compradores usam link mágico e só conseguem solicitar o link depois de aprovados. No Supabase, configure SMTP próprio e cadastre a URL pública e os redirects exatos. O Google OAuth permanece desativado.

Após um usuário entrar, o perfil é criado por `sync_profile`. Para conceder a primeira administração, configurar uma chave privada Supabase apenas em `SUPABASE_SECRET_KEY` e executar:

```sh
npm run admin:grant -- UUID_DO_USUARIO
# Somente após conferir o usuário e o destino remoto:
npm run admin:grant -- UUID_DO_USUARIO --remote
```

`app_admins` controla administração; metadados editáveis do usuário e localStorage não concedem permissões. As APIs validam o token no Supabase e consultam o papel vigente. Operações normais usam o token do usuário e RLS, sem precisar de chave privilegiada. A chave privada é usada no comando administrativo e na gravação de eventos reais da IA.

## Gemini

Configurar `GEMINI_API_KEY`, `GEMINI_MODEL` e `SUPABASE_SECRET_KEY` somente no servidor. A IA exige assinatura ativa ou administrador e possui limite transacional de cinco consultas/minuto. Sem configuração, responde com erro recuperável, sem conteúdo fictício.

## Migração e sincronização

Ver [docs/MIGRACAO-SUPABASE.md](docs/MIGRACAO-SUPABASE.md), [VALIDACAO.md](VALIDACAO.md) e [SINCRONIZACAO.md](SINCRONIZACAO.md). O Firebase antigo permanece preservado. Não foram importados dados ou usuários antigos, publicados site/backend ou contratados serviços pagos. Os documentos de auditoria inicial em `docs/` são históricos e descrevem a versão anterior.
