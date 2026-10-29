# Auditoria da evolução do Verbo Norte

## Concluído nesta fase

- Leitor bíblico com livro, capítulo, tradução e tamanho de fonte.
- Comparação entre traduções que existem no acervo local.
- Seleção de versículo com passagem ativa persistente no workspace.
- Ações conectadas para notas, Raio-X, Sermão, EBD, Editor, Dicionário e Concordância.
- Referências relacionadas somente do acervo local de concordância parcial.
- Harpa Cristã com busca, cópia, salvamento em notas e abertura no Editor.
- Editor Ministerial com blocos reordenáveis, referências adicionais e painel de contexto.
- Contexto de estudo com autor/público, histórico, literário, termos e personagens/lugares/eventos.
- PWA com cache seguro da interface e aviso de conexão offline.
- Leitura offline explícita: o usuário pode guardar a referência pública de um capítulo e sua tradução neste dispositivo.
- Rotas privadas sem cache global; dados pessoais permanecem dependentes da API autenticada.
- CI do GitHub com lint, testes unitários, integração da API e build.

## Evidências de validação

- `npm run lint` aprovado.
- `npm test` aprovado com 26 testes.
- `npm run test:integration` aprovado com 3 testes.
- `npm run build` aprovado.
- Commits publicados continuamente no branch `main`.

## Limitações intencionais

- Bíblia, Harpa e concordância continuam com acervo parcial.
- Comparação só aparece quando as duas versões estão disponíveis para o capítulo.
- Conteúdo gerado pelo Gemini exige revisão ministerial.
- O modo offline cobre interface, recursos estáticos e capítulos públicos marcados pelo usuário; não armazena notas, assinaturas, compras ou APIs privadas.
- Testes SQL do Supabase exigem Docker/Podman e `supabase start` localmente.
- Comunidade, gamificação, áudio, slides automáticos, geração de imagens e aplicativos nativos permanecem fora desta fase.

## Próximos critérios antes da publicação

1. Iniciar o Supabase local e executar `npm run supabase:test`.
2. Testar manualmente os fluxos de login, troca de conta, notas e logout em dois usuários.
3. Confirmar licença e origem de cada tradução, hino e trecho exibido.
4. Verificar o deploy automático do GitHub em ambiente de homologação.
5. Executar teste final de PWA em desktop e celular.
6. Só então definir hospedagem definitiva e publicar.

