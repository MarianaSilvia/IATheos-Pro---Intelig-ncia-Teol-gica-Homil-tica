# IATheos Pro

Base local de estudos teológicos com React, Express, Firebase Authentication, Firestore, Firebase Storage e Gemini. PostgreSQL, Drizzle, compras simuladas e privilégios escolhidos no navegador foram retirados.

## Executar localmente

Requisitos: Node.js 22.14 ou superior e Java 21 para os emuladores. Nesta máquina foi baixado um Java portátil em `.java/`; o inicializador o encontra automaticamente. Essa pasta não é versionada. Em outra máquina, instale Java 21 ou configure JAVA_HOME.

```powershell
npm ci
Copy-Item .env.example .env
npm run emulators
```

Em outro terminal, dentro do projeto:

```powershell
npm run dev
```

Abra http://127.0.0.1:3000. A interface dos emuladores fica em http://127.0.0.1:4000. O servidor e os emuladores escutam apenas no loopback. O projeto local é sempre `demo-iatheos`; ele não usa os dados do projeto Google Cloud existente.

Ao entrar com Google, o emulador apresenta identidades de teste. O popup do SDK também depende do carregamento de scripts Google; se não abrir, confira a rede e as permissões de popup. Para conferir os fluxos sem depender do popup externo, a fixture `http://127.0.0.1:3000/tests/browser/session.html` autentica uma conta Google fictícia **somente no emulador**, sem conceder Pro ou admin. Ela não faz parte do build distribuível.

Os emuladores iniciam vazios e não preservam dados após reinício por padrão. Isso é diferente de recarregar o navegador: o Firestore em execução preserva os dados e permite testar novas sessões. Não há carga automática de exemplos na aplicação.

## Administrador e acesso anual

1. Entre uma vez no aplicativo com uma identidade de teste.
2. Consulte seu UID na aba Authentication da interface dos emuladores.
3. Execute `npm run admin:grant -- SEU_UID`.
4. Saia e entre novamente para atualizar o token.
5. No Painel Admin, selecione um usuário cadastrado, informe o motivo e conceda ou renove o acesso.

O comando de bootstrap recusa Firebase remoto. O papel vem de custom claim `admin`, não do documento do usuário ou de um botão de troca de perfil. O painel mantém histórico de concessões, renovações, suspensões e liberações individuais de material.

Renovação soma 365 dias a `max(agora, validade atual)`. Suspensão bloqueia a assinatura mesmo com saldo de dias. Concessões manuais não são vendas e não geram receita fictícia.

## Gemini

Preencha `GEMINI_API_KEY` apenas no `.env` do servidor. O modelo é configurável por `GEMINI_MODEL`; o padrão é `gemini-2.5-flash`. A chave nunca é enviada ao navegador. O uso real da API depende de credenciais, modelo disponível e cota do provedor e pode gerar custo.

Sem chave, as rotas de IA retornam indisponibilidade, sem gerar texto demonstrativo. Usuários precisam de acesso ativo; administradores têm acesso para gestão/teste. O limite é de cinco solicitações por usuário por minuto, mantido em transação no Firestore. Todas as respostas estruturadas passam por esquema Zod antes de serem exibidas.

## Dados e permissões

- `users/{uid}`: perfil; email e UID vêm do token. O nome pode ser editado sem alterar permissões.
- `users/{uid}/studies/{id}`: sermão, EBD ou exegese, com dados validados.
- `users/{uid}/notes/{id}`: notas pessoais.
- `users/{uid}/reading/{bookId:chapter}`: um documento por capítulo concluído; desmarcar remove esse documento.
- `users/{uid}/entitlements/{productId}`: direito individual a um material já concedido.
- `users/{uid}/events/{id}`: gerações concluídas, usadas nas métricas reais.
- `subscriptions/{uid}`: estado e validade, controlados pelo servidor.
- `products/{id}`: metadados e caminho privado do PDF.
- `adminAudit/{id}`: responsável, usuário-alvo, motivo e data da operação administrativa.
- `aiLimits/{uid}`: janela e contagem do limite de IA.

As operações de negócio passam pela API, que valida token, autorização e esquema. O Admin SDK ignora Security Rules, portanto cada rota implementa suas próprias verificações. As regras permitem leitura pessoal delimitada e edição limitada do perfil; negam escrita direta de assinaturas, produtos, estudos, notas, leitura, concessões e auditoria. Storage não aceita leitura/escrita direta de clientes. Os testes cobrem também tentativas de alteração de proprietário, papel, email, tipos e campos extras.

As regras são um protótipo validado localmente, que deve ser revisado novamente antes da publicação. I've set up prototype Security Rules to keep the data in Firestore safe. They are designed to be secure for owner-scoped data, immutable identities, and server-only access grants. However, you should review and verify them before broadly sharing your app. If you'd like, I can help you harden these rules.

## Catálogo e PDFs

Cadastre o produto no painel, anexe um PDF de até 25 MB e desmarque Arquivado/rascunho para disponibilizá-lo. Preço zero é permitido. O upload verifica tamanho e assinatura do arquivo; o Storage recebe o conteúdo, não um blob URL de sessão. O leitor exibe e baixa esse PDF real, através da API autenticada, sem URL pública de download.

Materiais gratuitos ou incluídos na assinatura concedem acesso individual quando abertos por um usuário elegível. Esse direito já concedido é preservado após arquivamento; produtos arquivados não permitem novas concessões. O administrador também pode conceder um material individualmente a um usuário cadastrado. Para substituir um PDF, edite o produto e envie o novo arquivo; arquivos antigos não são apagados automaticamente nesta fase.

Cobranças estão desativadas. `POST /api/webhooks/payment` retorna HTTP 410 sem alterar assinatura. Não há Pix simulado, processamento de cartão ou confirmação de pagamento pelo navegador.

## Principais contratos HTTP

Todas as rotas privadas recebem `Authorization: Bearer <Firebase ID token>`.

| Rotas                                                                        | Comportamento                                                  |
| ---------------------------------------------------------------------------- | -------------------------------------------------------------- |
| POST `/api/users/sync`, GET `/api/session`, PATCH `/api/profile`             | Sessão real, perfil e acesso atual                             |
| GET `/api/studies`, PUT/DELETE `/api/studies/:id`                            | Caderno do titular; PUT recebe `{type, data}`                  |
| GET `/api/notes`, PUT/DELETE `/api/notes/:id`                                | Notas com título, referência e conteúdo                        |
| GET `/api/reading`, PUT `/api/reading/:key`                                  | Chaves de capítulos; PUT recebe `{completed}`                  |
| GET `/api/products`, GET `/api/products/:id/file`                            | Catálogo permitido e PDF privado                               |
| POST/PATCH `/api/products`, `/api/products/:id`; PUT `/api/products/:id/pdf` | Administração; upload com Content-Type application/pdf         |
| GET `/api/admin/users`, POST `/api/admin/subscriptions/:uid`                 | Usuários paginados; ação grant/renew/suspend/activate e motivo |
| POST `/api/admin/entitlements`, GET `/api/admin/audit`                       | Concessão individual e auditoria                               |
| POST `/api/theology/sermon`, `/ebd`, `/verse-xray`, `/chat`                  | IA autenticada, autorizada e limitada                          |
| GET `/api/activity`                                                          | Atividade real recente do titular                              |

Respostas de validação usam HTTP 400; sessão ausente/inválida 401; falta de permissão 403; recurso ausente 404; conflito de estado 409; arquivo grande 413; cota 429; resposta inválida de IA 502; serviço indisponível 503. Não há fallback comercial em memória.

## Verificação

```powershell
npm run lint
npm test
npm run build
npm run test:emulators
npm audit
```

Pare os emuladores de desenvolvimento antes de executar `test:emulators`, pois os testes iniciam suas próprias instâncias nas mesmas portas. Os testes de integração usam exclusivamente o projeto demo, bloqueiam solicitações externas e simulam a resposta do Gemini; nenhuma cobrança ou chamada real ao provedor é feita. `tests/fixtures/` contém os exemplos usados nos testes.

A verificação manual de navegador utiliza a fixture local, grava nota e leitura pela interface, recarrega para conferir restauração, desmarca o capítulo até zero e encerra a sessão. Para repetir, abra a fixture após iniciar servidor e emuladores.

## Limites desta fase

Não foi feito deploy, migração, limpeza ou alteração de regras/recursos no projeto remoto. Firestore foi testado em edição Standard no emulador. A edição e o database ID do projeto existente precisam ser confirmados antes de habilitar conexões remotas. As flags remotas continuam desativadas; habilitá-las futuramente exige também credenciais Google Application Default no servidor e verificação do destino.

Login OAuth no Google real, chave Gemini e execução em infraestrutura Google Cloud não foram validados nesta fase. O teste de navegador local usou a identidade emulada porque o popup aguardou dependência externa. Cobranças, comunidade, aquisição de conteúdo bíblico completo e hospedagem ficam para etapas posteriores. Bíblia e Harpa indicam acervo parcial e não substituem um texto indisponível por outro capítulo/tradução. Modo púlpito permite tema e tamanho de fonte; não promete rolagem automática.

## Sincronização com GitHub e Firebase

Após as verificações, as alterações concluídas devem ser registradas no GitHub e as configurações Firebase afetadas devem ser sincronizadas, conforme AGENTS.md.

O destino remoto foi confirmado: projeto `possible-zephyr-zxctm`, banco `ai-studio-iatheosprointeli-6684e688-953f-4a8e-817e-4611e2daeff1`, edição **Enterprise Native**, região **us-east1**. O outro banco (Ecclesia) não pertence a esta aplicação.

- `firebase.json`: emuladores e configuração local Standard.
- `firebase.remote.json`: apenas o banco IATheos e seu bucket de PDFs; não inclui Hosting ou Cloud Run.
- `firestore.remote.indexes.json`: índices densos adequados à edição Enterprise, incluindo os campos de ordenação das consultas existentes. Esta sincronização preserva o contrato de consultas validado nos emuladores; não altera as consultas da aplicação nem introduz dependência de Pipelines na experiência local.
- `npm run firebase:check`: consulta o destino e valida as regras sem alterar recursos.
- `npm run firebase:sync -- --firestore-only`: sincroniza apenas regras e índices do banco IATheos, preservando índices adicionais existentes.
- `npm run firebase:sync`: inclui Storage se o bucket existir; retorna status parcial (código 2) quando o bucket ainda não estiver disponível.

O projeto remoto está no nível **Starter do AI Studio**. O Console informa que Storage não está disponível nesse nível e exige upgrade. O bucket configurado ainda não existe; as regras de Storage estão versionadas e testadas localmente, mas sua publicação depende dessa liberação. Nenhum upgrade, alteração de faturamento ou publicação de site foi realizado.

A CLI completa de deploy encontrou uma restrição `serviceusage.services.use` nesse projeto Starter. O script de sincronização usa os módulos das APIs oficiais da versão travada de firebase-tools para as operações específicas que a conta já pode executar: conferir o banco, validar/publicar regras e criar índices. Ele não amplia permissões IAM, não habilita APIs e não cria bancos ou buckets. As credenciais continuam no armazenamento oficial da CLI, fora do repositório.

Veja SINCRONIZACAO.md e docs/INVENTARIO-ALTERACOES.md para o estado remoto e o levantamento de arquivos.
