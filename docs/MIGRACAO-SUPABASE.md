# Migração para Supabase — 27/10/2026

Destino criado: **QI Store Pro**, ref `idrumlpdobiackcnhdas`, organização **MarianaSilvia's Org**, região `sa-east-1`. EcclesiaOS e o Firebase antigo não foram alterados nesta migração.

## Alterações

- Firebase Auth substituído por Supabase Auth, Google OAuth e PKCE. Estados de carregamento, erro, logout e troca de conta mantidos. A API valida o token por `getUser` e consulta o papel no banco, sem confiar em metadados editáveis.
- Firestore substituído por tabelas PostgreSQL: perfis, estudos, notas, progresso por capítulo, catálogo, assinaturas, direitos, auditoria, eventos de geração e pedidos. Tabelas expostas possuem RLS e privilégios mínimos.
- Rotinas transacionais cuidam de renovação, concessão, arquivamento e limite da IA. Concessão/renovação anual acrescenta 365 dias à maior data entre agora e a validade atual.
- PDFs não são armazenados. A tabela privada `product_links` contém apenas endereços HTTPS. Catálogo e logs administrativos não retornam os links. Após autorização, `/api/products/:id/link` entrega o endereço sem cache compartilhado. A interface abre a nuvem externa com `noopener noreferrer` e sem referenciador.
- Painel de upload substituído por cadastro/edição de link. Nenhum bucket Supabase foi criado. Storage está desativado no ambiente local.
- Pedidos e confirmação idempotente preparados para a futura plataforma de pagamentos. O cliente não pode marcar pedido como pago nem conceder acesso. O endpoint antigo permanece 410. Acesso manual continua disponível, sem ser tratado como receita.
- SDKs, CLI, regras, índices, scripts e testes Firebase removidos da versão ativa. A versão anterior permanece no histórico Git e os recursos remotos permanecem preservados.
- Configuração, documentação, lockfile e fluxo AGENTS.md atualizados para Supabase. A interface continua IATheos Pro; não houve solicitação de renomear a marca ou o repositório.

## Limites e pendências

A migração não copia dados nem identidades do Firebase automaticamente. O novo projeto foi iniciado vazio. Testes SQL foram revertidos e não deixaram contas ou produtos artificiais. Usuários entrarão pelo novo Auth e receberão novos UUIDs.

Login real depende de configurar o provedor Google e redirects no painel e concluir um login real. A primeira permissão administrativa depende desse UUID. Gemini depende de chave privada no servidor e da chave do Gemini. Segredos não foram criados artificialmente nem publicados.

Escolher o provedor de pagamento e a nuvem externa é uma etapa seguinte. O adaptador deverá validar assinatura do webhook, consultar o pagamento no provedor, comparar pedido/valor/moeda e somente então chamar a rotina de confirmação no servidor. O pedido deve nascer no servidor com valor do catálogo. Estornos e revogações precisarão de política definida antes da ativação da cobrança. Não há webhook genérico que aceite `paid` do navegador.

Links estáticos podem ser compartilhados após a liberação. Para restringir a validade, integrar a assinatura de URLs do provedor externo. O Supabase guarda apenas referências e permissões.

Não houve deploy da aplicação nem escolha de hospedagem. O Node/Express continua executado localmente.
