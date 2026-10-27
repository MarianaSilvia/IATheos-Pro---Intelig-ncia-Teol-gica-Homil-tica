# Inventário de alterações

Data: 27/10/2026. Comparação com o commit 17a08d216ae8b696ffedb7f1c405885f332635d3.

## Resumo funcional

- Retirada de PostgreSQL/Drizzle e gravações duplicadas.
- API modular com identidade Firebase real, autorização administrativa, assinatura no servidor e validação de esquemas.
- Firestore para biblioteca, notas, leitura por capítulo, catálogo, direitos de acesso e auditoria.
- PDFs privados via Storage/API, sem blob URLs persistidos ou downloads simulados.
- Compras e webhook simulados retirados; acesso anual concedido manualmente pelo administrador.
- Chat com envio controlado, Markdown seguro e resultados de IA validados.
- Conteúdo bíblico parcial identificado, sem troca silenciosa de livro/capítulo/tradução.
- Métricas baseadas em eventos e exemplos restritos a fixtures de testes.
- Dependências travadas, npm lockfile, modo TypeScript estrito, testes, emuladores, documentação e procedimento de sincronização.
- Configuração remota separada para o banco Enterprise Native existente; regras publicadas e cinco índices READY. Storage permanece dependente de upgrade do projeto Starter.

## Arquivos

98 arquivos nesta entrega: 37 adicionados, 40 modificados e 21 removidos. Mudanças de formatação também aparecem na lista.

| Estado     | Arquivo                                               |
| ---------- | ----------------------------------------------------- |
| Modificado | .env.example                                          |
| Modificado | .gitignore                                            |
| Adicionado | .npmrc                                                |
| Adicionado | AGENTS.md                                             |
| Removido   | bun.lock                                              |
| Adicionado | docs/ANALISE-INICIAL.md                               |
| Adicionado | docs/auditoria-inicial-firestore.json                 |
| Adicionado | docs/INVENTARIO-ALTERACOES.md                         |
| Modificado | firebase-blueprint.json                               |
| Adicionado | firebase.json                                         |
| Adicionado | firebase.remote.json                                  |
| Adicionado | firestore.indexes.json                                |
| Adicionado | firestore.remote.indexes.json                         |
| Modificado | firestore.rules                                       |
| Modificado | index.html                                            |
| Adicionado | package-lock.json                                     |
| Modificado | package.json                                          |
| Adicionado | README.md                                             |
| Adicionado | scripts/emulators.mjs                                 |
| Adicionado | scripts/grant-admin.ts                                |
| Adicionado | scripts/sync-firebase.mjs                             |
| Modificado | server.ts                                             |
| Adicionado | SINCRONIZACAO.md                                      |
| Modificado | src/App.tsx                                           |
| Modificado | src/components/ActivitySummaryChart.tsx               |
| Removido   | src/components/AdminAdicionarPDF.tsx                  |
| Modificado | src/components/AdminPanelView.tsx                     |
| Modificado | src/components/BibleAndHarpView.tsx                   |
| Modificado | src/components/BibleReadingProgress.tsx               |
| Modificado | src/components/DashboardModals.tsx                    |
| Modificado | src/components/DashboardView.tsx                      |
| Modificado | src/components/EbdView.tsx                            |
| Removido   | src/components/LandingPage/ClientAccessModal.tsx      |
| Removido   | src/components/LandingPage/ClientAccessSection.tsx    |
| Removido   | src/components/LandingPage/FeaturesSection.tsx        |
| Removido   | src/components/LandingPage/Footer.tsx                 |
| Removido   | src/components/LandingPage/HeroSection.tsx            |
| Removido   | src/components/LandingPage/InteractiveDemoSection.tsx |
| Modificado | src/components/LandingPage/LandingPage.tsx            |
| Removido   | src/components/LandingPage/Navbar.tsx                 |
| Removido   | src/components/LandingPage/PricingSection.tsx         |
| Modificado | src/components/Navbar.tsx                             |
| Modificado | src/components/PdfReaderModal.tsx                     |
| Modificado | src/components/PulpitModeModal.tsx                    |
| Modificado | src/components/SavedLibraryView.tsx                   |
| Modificado | src/components/SermonView.tsx                         |
| Modificado | src/components/StoreView.tsx                          |
| Removido   | src/components/SubscriptionCheckoutModal.tsx          |
| Modificado | src/components/TheologicalChatView.tsx                |
| Modificado | src/components/VerseXrayView.tsx                      |
| Removido   | src/db/drizzle.config.ts                              |
| Removido   | src/db/index.ts                                       |
| Removido   | src/db/products.ts                                    |
| Removido   | src/db/schema.ts                                      |
| Removido   | src/db/studies.ts                                     |
| Removido   | src/db/subscriptions.ts                               |
| Removido   | src/db/users.ts                                       |
| Adicionado | src/hooks/useLibrary.ts                               |
| Adicionado | src/hooks/useResource.ts                              |
| Adicionado | src/hooks/useSession.ts                               |
| Modificado | src/index.css                                         |
| Adicionado | src/lib/api.ts                                        |
| Removido   | src/lib/firebase-admin.ts                             |
| Modificado | src/lib/firebase.ts                                   |
| Removido   | src/lib/firestoreService.ts                           |
| Modificado | src/main.tsx                                          |
| Removido   | src/middleware/auth.ts                                |
| Adicionado | src/server/ai.ts                                      |
| Adicionado | src/server/app.ts                                     |
| Adicionado | src/server/config.ts                                  |
| Adicionado | src/server/firebase.ts                                |
| Adicionado | src/server/http.ts                                    |
| Adicionado | src/server/routes.ts                                  |
| Adicionado | src/server/services.ts                                |
| Adicionado | src/shared/contracts.ts                               |
| Modificado | src/utils/activityMetrics.test.ts                     |
| Modificado | src/utils/activityMetrics.ts                          |
| Adicionado | src/utils/bibleContent.ts                             |
| Modificado | src/utils/bibleProgress.test.ts                       |
| Modificado | src/utils/bibleProgress.ts                            |
| Modificado | src/utils/dashboard.test.ts                           |
| Modificado | src/utils/dashboard.ts                                |
| Modificado | src/utils/ecosystem.test.ts                           |
| Modificado | src/utils/ecosystem.ts                                |
| Modificado | src/utils/subscriptions.test.ts                       |
| Modificado | src/utils/theology.test.ts                            |
| Modificado | src/utils/theology.ts                                 |
| Adicionado | storage.rules                                         |
| Adicionado | tests/browser/session.html                            |
| Adicionado | tests/fixtures/dashboard.ts                           |
| Adicionado | tests/fixtures/ecosystem.ts                           |
| Adicionado | tests/fixtures/reading.ts                             |
| Adicionado | tests/fixtures/theology.ts                            |
| Adicionado | tests/integration/firebase.test.ts                    |
| Adicionado | tests/unit/structure.test.ts                          |
| Modificado | tsconfig.json                                         |
| Adicionado | VALIDACAO.md                                          |
| Modificado | vite.config.ts                                        |

Não versionados: credenciais, .env, logs, arquivos dos emuladores, Java portátil, node_modules e dist.
