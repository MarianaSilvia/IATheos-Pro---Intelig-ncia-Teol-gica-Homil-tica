# Checklist de liberação — Verbo Norte

Este checklist separa evidência automatizada de validação manual. Nenhum item manual deve ser marcado por inferência.

## Comprovado no commit informado pelo comando `git rev-parse --short HEAD`

- [x] Preflight local sem exibir segredos.
- [x] TypeScript (`npm run lint`).
- [x] 42 testes unitários.
- [x] 3 testes de integração de API.
- [x] Build de produção (`npm run build`).
- [x] PWA com manifest, ícones e service worker sem cache de APIs privadas.
- [x] Busca de temas com acervo local e expansão opcional pelo Gemini.
- [x] Dicionário bíblico/geral com fallback local e origem identificada.
- [x] Concordância parcial com normalização, plural e busca em trechos.
- [x] Passagem ativa conectada à Bíblia, Sermão, EBD, Raio-X, Editor, Dicionário e Concordância.

## Validar manualmente antes da publicação

- [ ] Instalar o PWA no Chrome ou Edge e confirmar que o botão desaparece após instalar.
- [ ] Guardar um capítulo offline, desligar a rede e reabrir o texto.
- [ ] Confirmar que notas, IA, loja, assinatura e APIs privadas não liberam dados offline.
- [ ] Selecionar versículos e navegar entre todos os módulos conectados.
- [ ] Pesquisar `graça`, `GRACA`, `graças`, `habitar`, `superação` e `âncora`.
- [ ] Salvar uma nota e confirmar a restauração após recarregar.
- [ ] Trocar de conta e confirmar isolamento de notas, estudos e cache.
- [ ] Testar usuário sem acesso Pro e administrador com permissões distintas.

## Configurações externas ainda pendentes

- [ ] Confirmar domínio e HTTPS da hospedagem.
- [ ] Confirmar SMTP de produção e links de autenticação com domínio publicado.
- [ ] Confirmar chave Gemini somente no ambiente de servidor.
- [ ] Confirmar credenciais, webhook e retorno da InfinitePay em ambiente de produção.
- [ ] Registrar licenças das traduções, hinos e textos antes de ampliar o acervo.

## Regra de decisão

Só considerar a versão pronta para publicação quando todos os itens manuais e externos acima tiverem evidência registrada, sem alterar regras remotas ou ativar cobrança real durante a homologação.
