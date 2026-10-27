# Validação da reestruturação local

Data: 27/10/2026. Base original: commit 17a08d216ae8b696ffedb7f1c405885f332635d3.

## Resultado dos comandos

- Instalação limpa: `npm ci --ignore-scripts --no-audit` concluída (948 pacotes).
- TypeScript: `npm run lint` aprovado, com `strict: true`.
- Testes unitários: `npm test`, 23 aprovados e zero falhas.
- Integração: `npm run test:emulators`, 8 testes/subtestes aprovados e zero falhas, com Authentication, Firestore Standard e Storage no projeto `demo-iatheos`.
- Build: `npm run build` aprovado; entrada inicial de aproximadamente 361 KB (111 KB gzip), com módulos carregados sob demanda.
- Auditoria npm após overrides compatíveis: zero vulnerabilidades reportadas.
- `git diff --check`: aprovado.

As negações de permissão impressas pelos testes de regras são esperadas: os testes tentam elevar papel, alterar propriedade, inserir campos extras e escrever diretamente nos recursos protegidos, e verificam a rejeição.

## Fluxos cobertos pela integração

Autenticação ausente/inválida; usuário comum sem administração; webhook aposentado sem ativação; perfil editado preservado após sincronização; concessão anual, renovação com saldo, suspensão e expiração; isolamento entre usuários; criação, edição e exclusão de notas e estudos; leitura concorrente por capítulo e retorno a zero; upload PDF inválido/acima de 25 MB; entrega privada do arquivo real; arquivamento preservando concessões anteriores; Gemini sem chave, retorno inválido, resposta estruturada válida, limite de uso e eventos de atividade; regras de Firestore e Storage contra acessos e alterações indevidos.

Gemini foi simulado nos testes. Não foram feitas chamadas pagas ao provedor.

## Verificação no navegador

Foi utilizada a fixture de identidade Google do emulador em `tests/browser/session.html`, sem Pro ou admin. Confirmados:

1. Sessão reconhecida pela API e dashboard vazio, sem dados de exemplo.
2. Ausência de painel administrativo para usuário comum e indicação de acesso inativo.
3. Nota criada pela interface e restaurada após recarregar a página.
4. Capítulo marcado, depois desmarcado; zero continuou zero após recarregar.
5. Escolha de Salmos exibindo texto indisponível, sem substituir por Romanos.
6. Saída retornando à página de entrada.

A captura de evidência foi salva fora do repositório em `../analise/validacao-local.png`.

## Limites e pendências deliberadas

- Login OAuth com Google real e chamadas com chave Gemini real não foram validados. No teste local, o popup do SDK aguardou uma dependência externa; o app agora informa falha recuperável após timeout. A fixture autentica via Firebase Auth emulado e não substitui a implementação Google do aplicativo.
- Não houve deploy, push, migração, exclusão ou alteração de recursos/regras remotas. Os processos locais de verificação foram encerrados.
- A edição e as configurações do projeto Firestore remoto precisam ser verificadas antes de uma futura conexão.
- Regras locais são um protótipo testado e devem passar por revisão antes da publicação.
- Cobrança, comunidade e acervo bíblico completo permanecem fora desta etapa, conforme o plano.
- Os emuladores não preservam dados após reinício sem exportação explícita; recarregar o navegador preserva dados enquanto o emulador está em execução.

Consulte README.md para os comandos locais, contratos HTTP e estrutura de dados.

## Atualização posterior

Este relatório preserva os resultados da etapa local. A sincronização remota autorizada posteriormente está registrada em SINCRONIZACAO.md. O banco remoto foi confirmado como Enterprise Native em us-east1; a atualização não envolve deploy do aplicativo.
