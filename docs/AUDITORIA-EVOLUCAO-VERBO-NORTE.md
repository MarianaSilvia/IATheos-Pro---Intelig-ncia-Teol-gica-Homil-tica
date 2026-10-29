# Auditoria da evolução do Verbo Norte

> A matriz atual de recursos, limites de acervo e próximos incrementos está em [MATRIZ-RECURSOS-ESTUDO.md](./MATRIZ-RECURSOS-ESTUDO.md).

## Concluído nesta fase

- Leitor bíblico com livro, capítulo, tradução e tamanho de fonte.
- Comparação entre traduções que existem no acervo local.
- Seleção de um ou vários versículos com passagem ativa persistente por usuário.
- Ações conectadas para notas, Raio-X, Sermão, EBD, Editor, Dicionário e Concordância.
- Referências do Editor com atalhos para Bíblia, Raio-X, Dicionário e Concordância.
- Referências relacionadas somente do acervo local de concordância parcial.
- Harpa Cristã com busca, cópia, salvamento em notas e abertura no Editor.
- Editor Ministerial com blocos reordenáveis, referências adicionais, painel de contexto e salvamento automático sem duplicação.
- Contexto de estudo com autor/público, histórico, literário, termos e personagens/lugares/eventos.
- PWA com cache seguro da interface e aviso de conexão offline.
- Leitura offline explícita: o usuário pode guardar a referência pública de um capítulo e sua tradução neste dispositivo.
- Rotas privadas sem cache global; dados pessoais permanecem dependentes da API autenticada.
- Progresso de leitura sem fallback em `localStorage`; a fonte de verdade é a API autenticada por usuário.
- CI do GitHub com lint, testes unitários, integração da API e build.
- Webhook InfinitePay exige assinatura HMAC válida; requisições sem segredo ou assinatura são rejeitadas.
- Política de privacidade, termos, aviso de IA e política de acesso estão acessíveis no rodapé da landing page.
- Loja, pesquisa, caderno e modais de uso eventual são carregados sob demanda para reduzir o JavaScript inicial.
- Falhas ao carregar chunks lazy exibem recuperação explícita com recarga da aplicação, evitando uma tela vazia após atualização do PWA.
- O servidor usa loopback no desenvolvimento e `0.0.0.0` por padrão em produção, com `HOST` configurável.
- Testes automatizados verificam o manifest instalável e impedem que o service worker faça cache das rotas privadas `/api/`.
- O preflight de produção exige URLs, chaves Supabase, Gemini e credenciais completas do InfinitePay antes de aprovar uma publicação.

## Evidências de validação

- `npm run lint` aprovado.
- `npm test` aprovado com 37 testes.
- `npm run test:integration` aprovado com 3 testes.
- `npm run build` aprovado.
- Commits publicados continuamente no branch `main`.

## Limitações intencionais

- Bíblia, Harpa e concordância continuam com acervo parcial.
- Comparação só aparece quando as duas versões estão disponíveis para o capítulo.
- Conteúdo gerado pelo Gemini exige revisão ministerial.
- O modo offline cobre interface, recursos estáticos e capítulos públicos marcados pelo usuário; não armazena notas, assinaturas, compras ou APIs privadas.
- O bundle inicial ainda supera 500 KB; a divisão por módulos reduziu o tamanho inicial, mas uma otimização adicional de dependências continua recomendada.
- Testes SQL do Supabase exigem Docker/Podman e `supabase start` localmente.
- Comunidade, gamificação, áudio, slides automáticos, geração de imagens e aplicativos nativos permanecem fora desta fase.

## Próximos critérios antes da publicação

1. Iniciar o Supabase local e executar `npm run supabase:test`.
2. Testar manualmente os fluxos de login, troca de conta, notas e logout em dois usuários.
3. Confirmar licença e origem de cada tradução, hino e trecho exibido.
4. Verificar o deploy automático do GitHub em ambiente de homologação.
5. Executar teste final de PWA em desktop e celular.
6. Só então definir hospedagem definitiva e publicar.

O roteiro detalhado para executar essa validação está em `docs/TESTE-MANUAL-PWA.md`.

