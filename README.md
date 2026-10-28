# IATheos Pro — backend QI Store Pro

Aplicação React/Express de estudo bíblico. Código no GitHub; autenticação e dados no Supabase **QI Store Pro**, projeto `idrumlpdobiackcnhdas`, São Paulo. O nome da interface permanece IATheos Pro; QI Store Pro é o nome do projeto Supabase solicitado.

## Materiais e cobrança

Os arquivos ficam em uma nuvem externa. O administrador cadastra um **link HTTPS**; nenhum PDF é enviado ou armazenado no Supabase. O catálogo não contém o endereço. A API confere sessão, concessão individual ou benefício de assinatura e só então libera o link. Arquivamento impede novas concessões e preserva direitos anteriores.

**Pagamentos:** os planos iniciais são **mensal por R$ 10,00 (30 dias)** e **anual por R$ 100,00 (365 dias)**. O Checkout Integrado da InfinitePay confirma pagamentos por webhook (`paid`/`settled`) de forma idempotente e pode ativar a assinatura automaticamente para o e-mail cadastrado. Os links atuais de Planos e Recorrências são links gerenciados no aplicativo InfinitePay e, até que a InfinitePay forneça evento/identificador compatível, permanecem pendentes para conferência e concessão administrativa; nunca liberamos acesso por retorno do navegador. As chaves ficam somente no servidor; o valor nunca é aceito do navegador.

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

### Vercel (backend serverless)

O arquivo `api/[...path].ts` adapta o Express para uma Vercel Function Node.js. O
frontend continua sendo o build Vite em `dist`, enquanto `/api/*` é atendido
pela função. Não use `npm run dev` como servidor de produção na Vercel.

No projeto Vercel, cadastre as variáveis abaixo em **Settings → Environment
Variables**. Use **Production** e **Preview** conforme o ambiente; as variáveis
secretas devem ser do tipo **Secret** e nunca devem ser prefixadas com `VITE_`.

| Variável | Tipo | Uso |
| --- | --- | --- |
| `SUPABASE_URL` | Secret/config | URL do projeto QI Store Pro |
| `SUPABASE_PUBLISHABLE_KEY` | Secret/config | Chave publicável usada pelo servidor |
| `SUPABASE_SECRET_KEY` | Secret | Chave privada somente do backend |
| `ALLOW_REMOTE_SUPABASE` | Config | `true` na Vercel |
| `GEMINI_API_KEY` | Secret | Chave do Gemini |
| `GEMINI_MODEL` | Config | `gemini-2.5-flash` (ou modelo escolhido) |
| `INFINITEPAY_API_KEY` | Secret | Chave do Checkout Integrado |
| `INFINITEPAY_HANDLE` | Config | Handle da conta InfinitePay |
| `INFINITEPAY_WEBHOOK_SECRET` | Secret | Segredo HMAC do webhook, quando habilitado |
| `PUBLIC_URL` | Config | `https://ia-theos-pro-intelig-ncia-teol-gica.vercel.app` |
| `VITE_SUPABASE_URL` | Config | URL usada pelo cliente React durante o build |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Config | Chave publicável usada pelo cliente React |

`HOST` e `PORT` não são necessários em Vercel Functions. Nunca copie o arquivo
`.env` para o GitHub ou para o bundle do frontend. Depois de salvar as
variáveis, faça um novo deploy para que o build e a função recebam a
configuração.

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
