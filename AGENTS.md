# Fluxo de trabalho deste projeto

- Após concluir as alterações e verificações pertinentes, sincronizar o código com o repositório GitHub existente e aplicar as migrações Supabase afetadas, conforme solicitado pela proprietária.
- Verificar o estado remoto antes de atualizar; preservar alterações concorrentes e não usar force-push.
- Supabase de destino: QI Store Pro, ref idrumlpdobiackcnhdas, organização MarianaSilvia's Org, região sa-east-1. Não alterar EcclesiaOS nem outros projetos.
- Firebase anterior permanece preservado. Não sincronizar novas alterações com ele nem excluir seus recursos. A migração autorizada substitui a integração da aplicação, sem importar dados antigos automaticamente.
- Materiais são links HTTPS externos, nunca arquivos no Supabase Storage. Links não pertencem ao catálogo público; liberar somente após autorização no servidor. Cobrança permanece desativada até escolha e integração de um provedor com confirmação verificável.
- Não publicar site, escolher hospedagem, migrar/excluir dados ou alterar faturamento apenas por sincronizar código e regras. Não enviar credenciais, .env, logs, binários Java ou dados dos emuladores ao GitHub. As fixtures versionadas pertencem apenas aos testes e não devem ser enviadas ao Firebase remoto.
- Se houver impedimento de autenticação ou permissão, concluir a parte independente e informar exatamente o que ficou pendente. Não declarar uma atualização remota concluída sem conferir seu resultado.
