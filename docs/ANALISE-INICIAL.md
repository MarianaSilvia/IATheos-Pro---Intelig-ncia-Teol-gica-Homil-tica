# Análise inicial — IATheos Pro

Data: 27/10/2026.

Repositório: https://github.com/MarianaSilvia/IATheos-Pro---Intelig-ncia-Teol-gica-Homil-tica

Branch analisada: `main`. Commit: `17a08d216ae8b696ffedb7f1c405885f332635d3`.

## Resultado

O projeto reúne uma interface React já extensa e uma API Express, mas mistura recursos reais com simulações de autenticação, compra, assinaturas, estatísticas e conteúdo. Os principais problemas estão na autorização do servidor, confirmação de pagamento e persistência. Corrigir apenas mensagens ou botões não resolve esses fluxos.

A análise é estática, com execução dos testes utilitários existentes e uma reprodução isolada do erro de progresso de leitura. Não foram feitos pagamentos, alterações em serviços remotos, consultas ao banco de produção, publicação ou mudanças no código do projeto. O checkout local permaneceu sem alterações rastreadas.

## Arquitetura encontrada

| Parte | Implementação |
| --- | --- |
| Interface | React 19, TypeScript, Vite, Tailwind, Motion e Recharts |
| Servidor | Express em `server.ts`, executado com tsx |
| IA | SDK `@google/genai`, chamadas no servidor para sermão, EBD, exegese e chat |
| Identidade | Firebase Authentication com Google; entrada por e-mail também contém simulação |
| Dados | Firestore, PostgreSQL com Drizzle, localStorage e memória do processo |
| Loja | Catálogo SQL + catálogo local de exemplo; pedidos e compras no navegador |
| Assinaturas | PostgreSQL com fallback automático para memória e registros de exemplo |
| PDFs | Anexo convertido em URL temporária; leitor renderiza texto de amostra |

## Achados por prioridade

### 1. Crítico — administração de assinaturas sem autenticação

**Evidência:** `server.ts:659`, `670` e `691`: GET, POST e PATCH de `/api/admin/subscriptions` não usam `requireAuth` nem verificam administrador. `src/App.tsx:259` permite alternar o papel na interface por um botão.

**Impacto:** quem alcançar a API pode listar clientes, cadastrar, renovar ou suspender assinaturas. Esconder o botão no frontend não protege as rotas.

**Correção proposta:** autenticar todas as rotas administrativas e exigir permissão administrativa validada no servidor; derivar o papel da sessão, retirando a alternância pública.

### 2. Crítico — webhook ativa assinatura sem validar pagamento

**Evidência:** `server.ts:718`: `/api/webhooks/payment` aceita um corpo JSON com e-mail e chama `createOrRenewSubscription`. Não verifica assinatura do provedor, status pago, valor efetivamente recebido ou repetição de evento. A tabela não possui unicidade de `transactionId`.

**Impacto:** uma chamada fabricada pode ativar acesso; eventos repetidos criam registros adicionais. O código não implementa uma integração de pagamento validada.

**Correção proposta:** definir o provedor real, verificar autenticidade do evento e pagamento no servidor, conferir valor/produto e processar cada transação apenas uma vez.

### 3. Crítico — login por e-mail não comprova identidade

**Evidência:** `src/App.tsx:612` cria um objeto com e-mail e UID `client-*`, convertido com `as any`, sem autenticar no Firebase. `ClientAccessModal.tsx:50` e `ClientAccessSection.tsx:43` consultam apenas se o e-mail informado tem assinatura. Nos tratamentos de erro, ambos permitem entrada. `App.tsx:634` também libera Pro em erro de rede.

**Impacto:** conhecer o e-mail de um assinante basta para entrar na interface como ele. Esse objeto não tem `getIdToken()`, e não estabelece `auth.currentUser`, quebrando a sincronização real.

**Correção proposta:** autenticação Google ou link de acesso enviado e verificado pelo Firebase; consultar assinatura da identidade autenticada. Falhas de verificação devem resultar em estado de erro recuperável.

### 4. Alto — acesso Pro começa liberado e API de IA não exige assinatura

**Evidência:** `src/App.tsx:65` inicia `isProSubscriber` como `true`; `?view=app` e `onEnterApp` abrem a aplicação. As quatro rotas `/api/theology/*` de geração não exigem autenticação, assinatura ou limite de uso.

**Impacto:** a restrição da assinatura não é aplicada pelo servidor; chamadas diretas podem consumir a chave Gemini quando configurada.

**Correção proposta:** estado inicial de verificação, controle de assinatura no servidor e limites por usuário. Uma demonstração pública precisa de regras e limites próprios.

### 5. Alto — checkout confirma sucesso sem cobrança validada

**Evidência:** `SubscriptionCheckoutModal.tsx:54` chama diretamente o webhook; em exceção também executa `onPaymentSuccess`. O Pix é identificado no código como simulação. `LandingPage/PricingSection.tsx:55` apenas aguarda 900 ms e declara sucesso. `LandingPage.tsx:62` ignora o e-mail do comprador e chama o login com um e-mail fixo. `App.tsx:272` libera produtos e grava pedido concluído localmente.

**Impacto:** a interface informa compra confirmada sem comprovação de pagamento; o comprador pode entrar com a identidade errada.

**Correção proposta:** criar cobrança no servidor e consultar seu estado até confirmação autêntica; unificar os checkouts e associar pedido, transação e usuário reais.

### 6. Alto — rotas SQL confundem usuário autenticado com administrador

**Evidência:** `server.ts:551` permite que qualquer usuário autenticado liste todos os usuários. `server.ts:573` permite que qualquer autenticado crie produtos.

**Impacto:** exposição de dados de usuários e alteração indevida do catálogo.

**Correção proposta:** middleware administrativo explícito e validação de dados de entrada.

### 7. Alto — consulta pública expõe dados da assinatura

**Evidência:** `server.ts:644` recebe qualquer e-mail sem sessão e retorna o resultado de `getSubscriptionByEmail`, incluindo registro com nome, pagamento, valor e identificador da transação.

**Impacto:** consulta indevida de informações de clientes por e-mail.

**Correção proposta:** retornar apenas o estado necessário para o titular autenticado; detalhes ficam restritos ao titular e ao administrador.

### 8. Alto — fallback de assinaturas pode confirmar gravações que se perdem

**Evidência:** `src/db/subscriptions.ts:26` contém assinaturas de exemplo. Os métodos retornam memória em falha SQL; `createOrRenewSubscription` modifica memória antes de tentar persistir. Há fallback para exemplos até quando uma consulta SQL não encontra registro.

**Impacto:** o sistema pode declarar uma assinatura salva, perdê-la após reinício e reconhecer assinaturas de exemplo em ambiente real. IDs SQL e de memória podem divergir.

**Correção proposta:** separar modo demonstrativo de produção. Em produção, falhas de gravação precisam ser informadas e tratadas, com banco como fonte de verdade.

### 9. Alto — renovação descarta saldo de dias e gera registros duplicados

**Evidência:** `src/db/subscriptions.ts:232` e `323` calculam validade como agora +365 dias. `createOrRenewSubscription` sempre insere outra linha SQL, enquanto a memória substitui por e-mail. A consulta escolhe a maior validade.

**Impacto:** uma renovação antecipada pode perder dias restantes. Suspender uma linha pode deixar outra assinatura ativa para o mesmo e-mail.

**Correção proposta:** definir registro vigente único e histórico de pagamentos separado; renovar a partir de `max(agora, validadeAtual)` quando a regra comercial for acrescentar 365 dias.

### 10. Alto — biblioteca salva na nuvem, mas não é restaurada dela

**Evidência:** `src/App.tsx:119` carrega biblioteca apenas do localStorage. Os handlers gravam no Firestore e SQL, porém a interface não chama GET `/api/saved-studies` nem consulta as coleções Firestore para restaurar estudos. Os erros de gravação são descartados, e os toasts anunciam sincronização.

**Impacto:** estudos podem não aparecer em outro dispositivo; uma falha de sincronização parece sucesso.

**Correção proposta:** escolher a fonte principal, carregar por usuário após login e acompanhar estado de sincronização. Mostrar sucesso remoto apenas após confirmação.

### 11. Alto — exclusões não chegam à nuvem e dados locais não são separados por conta

**Evidência:** `src/App.tsx:460` remove estudos apenas do estado local. Os fluxos de desfazer salvamento também não removem os dados remotos. Chaves `iatheos_saved_library`, `iatheos_orders` e `iatheos_owned_products` não incluem UID nem são limpas na troca de conta.

**Impacto:** dados excluídos continuam armazenados remotamente; pessoas que compartilham navegador podem ver biblioteca e compras locais de outra conta.

**Correção proposta:** implementar exclusão remota e cache por UID, com limpeza adequada na saída/troca de usuário.

### 12. Alto — PDFs anexados não têm armazenamento durável e leitor não abre PDF

**Evidência:** `AdminAdicionarPDF.tsx:56` usa `URL.createObjectURL(arquivoPdf)` e envia esse endereço como arquivo. `PdfReaderModal.tsx:30` gera um `.txt` com texto de amostra, sem ler `product.downloadUrl`.

**Impacto:** o anexo não funciona em outros dispositivos e perde validade após descarregar o documento; o leitor e o download não entregam o PDF cadastrado.

**Correção proposta:** upload persistente, referência estável do arquivo, leitura/download do PDF real e autorização do acesso no servidor.

### 13. Alto — catálogo local diverge do SQL

**Evidência:** `src/App.tsx:298` adiciona produto local antes da resposta SQL e usa ID diferente do ID `prod-sql-*` criado ao carregar a API. `src/App.tsx:339` exclui apenas localmente. A carga inicial só acrescenta IDs desconhecidos, sem atualizar produtos existentes. O POST recusa preço zero por `!price`; o banco nem armazena `isFreeForSubscribers`, e a carga assume `true` para todos os produtos SQL.

**Impacto:** duplicação, itens excluídos reaparecendo, preços desatualizados e permissões de assinatura alteradas no recarregamento.

**Correção proposta:** CRUD persistente completo, IDs canônicos e reconciliação com a resposta do servidor; persistir as regras comerciais de cada produto.

### 14. Alto — regras Firestore permitem alterar campos sensíveis do próprio perfil

**Evidência:** `firestore.rules:23` permite ao titular escrever qualquer campo de `/users/{uid}`. `saveUserProfile` grava `role` e `isProSubscriber` enviados pela interface. `isAdmin` usa e-mail fixo sem exigir `email_verified`.

**Impacto:** papel e assinatura gravados no perfil não são confiáveis. Isso não cria automaticamente um custom claim administrativo, mas permite falsificar os dados do perfil. O risco do e-mail sem verificação depende dos provedores habilitados.

**Correção proposta:** proteger campos administrativos/comerciais no servidor e usar claims confiáveis. Se houver administrador por e-mail, exigir também e-mail verificado.

Outras fragilidades: regras não validam tipos/tamanhos; updates de estudos e notas não preservam `userId`. Um titular pode transferir o próprio documento para outro UID. Isso não permite ler diretamente o documento de outra pessoa, mas quebra a integridade de propriedade.

### 15. Alto — leitor bíblico mostra conteúdo incompatível com a seleção

**Evidência:** `BibleAndHarpView.tsx:50` escolhe apenas `ROM-5` ou `JHN-3`, ignorando `selectedChapter`; outros livros voltam a Romanos 5. Tradução ausente também retorna Romanos 5 NAA. Ao copiar, a referência usa o livro/capítulo selecionado, independentemente do texto exibido. `DashboardView.tsx:153` descarta livro e capítulo ao navegar para a Bíblia.

**Impacto:** texto e referência podem não corresponder, inclusive na cópia e no envio ao Raio-X.

**Correção proposta:** consultar livro, capítulo e tradução reais; indicar conteúdo indisponível quando faltar; preservar seleção entre telas.

### 16. Médio — progresso de leitura vazio é substituído por 104 capítulos

**Evidência:** `src/utils/bibleProgress.ts:224` aceita o valor salvo somente se a lista tiver itens. Foi reproduzido com localStorage contendo `[]`: a função retornou 104 capítulos de exemplo.

**Impacto:** ao desmarcar tudo e recarregar, o progresso reaparece. Novos usuários também começam com leituras fictícias.

**Correção proposta:** aceitar lista vazia como válida e iniciar usuários reais sem capítulos concluídos.

### 17. Alto — sincronização de leitura pode sobrescrever o progresso remoto

**Evidência:** `BibleReadingProgress.tsx:66` começa salvando o estado local antes de carregar o remoto, cujo efeito vem depois. A carga depende de `auth.currentUser` no mount, sem observar mudanças de autenticação, e ignora lista remota vazia.

**Impacto:** risco de substituir o progresso de outro dispositivo pelo cache local; login posterior ao mount pode não carregar o histórico.

**Correção proposta:** aguardar sessão e leitura inicial antes de gravar; separar cache por usuário e tratar conflitos/vazio explicitamente.

### 18. Médio — chat permite requisições concorrentes e pode perder respostas

**Evidência:** `TheologicalChatView.tsx:47` depende de `isLoading`, mas `App.tsx:591` não altera esse estado no chat. Cada resposta faz `setMessages([...newHistory, assistantMsg])` com histórico capturado. A mensagem atual também é enviada no histórico e novamente no corpo principal.

**Impacto:** indicador de carregamento não aparece; envios rápidos podem sobrescrever mensagens. Markdown é exibido como texto simples em `TheologicalChatView.tsx:158`.

**Correção proposta:** estado de envio próprio, atualização funcional de mensagens, histórico sem duplicação e renderização segura de Markdown.

### 19. Médio — IA pode retornar conteúdo de exemplo ou estrutura que quebra a tela

**Evidência:** sem chave Gemini, `server.ts` devolve textos estáticos como sucesso. Com chave, o retorno passa apenas por `JSON.parse`, que usa `{}` quando o texto está vazio. Os validadores de `src/utils/theology.ts` só são usados em testes; componentes acessam campos aninhados diretamente.

**Impacto:** resultados genéricos parecem geração real; respostas incompletas podem causar falha de renderização.

**Correção proposta:** modo demonstrativo explícito, configuração de produção validada e verificação de esquema antes de entregar dados à interface. O modelo está fixado em `gemini-3.8-flash`; sua disponibilidade para a chave/ambiente não foi testada nesta análise.

### 20. Médio — notas, comunidade e métricas são demonstrativas

**Evidência:** `DashboardModals.tsx` mantém notas/posts apenas em `useState`. `activityMetrics.ts:28` gera distribuição fixa de atividades. Dashboard contém nome, data e leituras fixos. O painel soma `subscriptions.length * 297` à receita, sem considerar valor pago e estado real. Harpa contém poucos hinos de exemplo, embora a página de preços anuncie a coletânea completa.

**Impacto:** notas somem ao recarregar; atividade e receita não representam uso real; recursos anunciados não estão integralmente implementados.

**Correção proposta:** persistir notas e eventos reais, calcular métricas a partir de transações e delimitar claramente os recursos de demonstração. O modo púlpito possui tamanho de fonte/tema, mas não implementa a rolagem automática anunciada como teleprompter.

### 21. Alto para instalação — dependências e preparação do ambiente

**Evidência executada:** `npm install --ignore-scripts --package-lock=false` falhou com `ERESOLVE`: a resolução atual de Vite 8.3.5 exige peer opcional esbuild `^0.27.0 || ^0.28.0`, enquanto o projeto declara `^0.25.0`. Existe `bun.lock`, mas Bun não estava disponível neste ambiente.

**Impacto:** a instalação padrão via npm não conclui. Isso não comprova que a instalação com Bun falhe.

Outros pontos: `.env.example` documenta apenas Gemini e APP_URL, omitindo SQL e credenciais administrativas; não há migrações versionadas para preparar todas as tabelas. O startup cria apenas a tabela de assinaturas. O pool SQL é construído por imports antes de `dotenv.config()` em `server.ts`, podendo ignorar variáveis SQL disponíveis apenas em `.env`. Esse último ponto não afeta variáveis já injetadas pelo ambiente.

**Correção proposta:** fixar gerenciador e versões compatíveis, preparar instalação reproduzível, documentar variáveis e executar migrações antes do servidor; carregar `.env` antes da criação do pool.

## Verificações realizadas e limites

- Clone local do commit indicado; nenhuma alteração rastreada no repositório ao final da análise.
- Revisão da estrutura, rotas Express, middleware de autenticação, persistência SQL/Firestore/local, componentes e funções centrais dos módulos.
- 21 testes utilitários existentes passaram. Comando: `node --experimental-strip-types --import ../analise/resolver-testes.mjs --test src/utils/*.test.ts`.
- O adaptador fica fora do repositório e apenas resolve imports TypeScript sem extensão para o Node. A execução nativa sem ele passou em 15 testes e falhou ao carregar dois arquivos por resolução de imports; não eram falhas de asserção.
- `npm test` está configurado para executar apenas `theology.test.ts`, deixando os outros arquivos fora do comando padrão.
- Os testes de assinatura reproduzem cálculos/parsers no próprio teste; não exercitam as funções SQL nem a rota de webhook. Não há cobertura de autorização, pagamentos ou sincronização.
- Reprodução adicional: localStorage com `[]` retorna 104 capítulos, confirmando o achado 16.
- Build e TypeScript não executados: instalação bloqueada pelo conflito de dependências.
- Sem acesso ao ambiente implantado, banco real, provedores Firebase habilitados, regras efetivamente publicadas ou cobrança real. Os achados remotos são conclusões sobre o código deste commit, sem exploração em produção.

## Ordem sugerida para as correções

1. Login verdadeiro, autorização administrativa e verificação de assinatura no servidor.
2. Integração real de pagamento, webhook autenticado e idempotência.
3. Banco como fonte de verdade, renovação sem perda de saldo e migrações.
4. Biblioteca, leitura e catálogo com sincronização e isolamento por usuário.
5. Upload/leitura de PDFs e conteúdo bíblico correto.
6. Chat, validação dos retornos de IA e substituição dos dados demonstrativos.
7. Dependências reproduzíveis e testes de regressão dos fluxos corrigidos; resolver a instalação antes de implementar para permitir validação contínua.
