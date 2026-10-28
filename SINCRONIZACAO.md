# Sincronização

GitHub continua sendo a fonte do código. Supabase QI Store Pro (`idrumlpdobiackcnhdas`) é o único destino atual das migrações.

1. Verificar branch e alterações remotas, sem force-push.
2. Executar TypeScript, testes relevantes e build.
3. Conferir alvo Supabase e criar migrações pela CLI. Não editar uma migração já aplicada.
4. Aplicar migrações e verificar resultados, políticas RLS e advisors. Não enviar fixtures permanentes.
5. Salvar código, SQL e documentação no GitHub. Não enviar `.env`, chaves privadas, tokens ou cache local.

A CLI pode ser vinculada com `supabase link --project-ref idrumlpdobiackcnhdas`, após login próprio. Conferir as opções com `--help` antes de sincronizar. Não usar reset remoto. Arquivos de migração têm versões alinhadas ao histórico real do projeto; sincronização não deve reaplicar essas versões.

As ferramentas conectadas foram usadas para criar o projeto e aplicar/validar as migrações desta entrega. Não há credencial da conta Supabase embutida em scripts. O Firebase anterior é histórico e não recebe as novas atualizações. Não publicar frontend/backend, modificar faturamento ou excluir projetos ao sincronizar.
