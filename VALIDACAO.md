# Validação da migração Supabase

- TypeScript estrito: aprovado.
- Testes unitários: 23 aprovados.
- Testes HTTP e validação de links/erros: 3 aprovados.
- Build Vite: aprovado.
- npm audit: zero vulnerabilidades.
- SQL no QI Store Pro: aprovado dentro de transação revertida, cobrindo isolamento A/B, propriedade, perfil, impossibilidade de autoatribuir administração/assinatura, links privados, concessões, renovação antecipada, suspensão, assinatura, limite da IA, arquivamento e preservação de direitos, valor do pagamento, idempotência e bloqueio de visitante.
- Auditoria de segurança Supabase: sem apontamentos após as migrações. Avisos informativos de índices ainda sem uso são esperados no banco novo e vazio.
- Nenhum usuário, perfil, produto ou arquivo artificial persistiu após os testes. Nenhum objeto no Storage.

## Limitações verificadas

O ambiente completo local não iniciou porque Docker/Podman não estão instalados. Os testes de banco foram executados na transação revertida do novo projeto remoto autorizado; o comando local permanece documentado para uso após instalar o runtime.

Login Google de ponta a ponta aguarda configuração do provedor no novo projeto e autenticação real. Primeiro administrador depende do UID desse login. Não foram testadas chamadas pagas reais do Gemini; faltam as chaves do servidor. Pagamentos reais não foram integrados porque o provedor ainda não foi escolhido. Downloads externos precisam de links reais cadastrados; nenhuma nuvem de arquivos foi escolhida ou criada.

A versão anterior do relatório, com testes Firebase/emuladores, está no histórico Git e não comprova o funcionamento desta integração Supabase.
