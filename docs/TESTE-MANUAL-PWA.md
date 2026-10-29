# Roteiro de validação manual — Verbo Norte

Use este roteiro em uma janela anônima e em uma conta autenticada de teste. Não use dados reais de compradores durante a homologação.

## 1. Instalação e conexão

- [ ] Abrir a aplicação em Chrome ou Edge com HTTPS ou `localhost`.
- [ ] Confirmar que o botão **Instalar Verbo Norte** aparece apenas quando o navegador oferece instalação.
- [ ] Instalar o PWA e abrir a janela instalada.
- [ ] Desligar a rede e confirmar o aviso de modo offline.
- [ ] Confirmar que a landing page, a navegação local e a Bíblia disponível no acervo continuam abrindo.
- [ ] Confirmar que login, notas, IA, loja, assinatura e APIs privadas exibem indisponibilidade sem liberar acesso.
- [ ] Religar a rede e confirmar que a aplicação volta a sincronizar sem recarregar dados de outra conta.

## 2. Fluxo Bíblia → estudo

- [ ] Escolher livro, capítulo e tradução disponíveis.
- [ ] Selecionar um ou vários versículos e confirmar a passagem ativa como intervalo/lista.
- [ ] Abrir Raio-X, Sermão, EBD, Dicionário e Concordância a partir da passagem.
- [ ] Confirmar que a referência é preservada e que nenhuma ferramenta inventa texto ausente.
- [ ] Comparar duas traduções quando ambas estiverem disponíveis.
- [ ] Salvar o versículo como nota e confirmar a mensagem de sucesso.
- [ ] Abrir o Editor e confirmar que referência e texto são preenchidos.
- [ ] Marcar o capítulo como **Disponibilizar offline**, sair e reabrir o PWA sem rede.
- [ ] Confirmar que o texto dos versículos marcados continua disponível offline e que o cache não inclui notas ou dados privados.
- [ ] Reabrir o capítulo pela lista de capítulos offline e removê-lo depois do teste.

## 3. Integridade e segurança

- [ ] Trocar de conta e confirmar que notas e histórico não aparecem misturados.
- [ ] Fazer logout e confirmar que as telas privadas não permanecem acessíveis.
- [ ] Testar uma conta sem acesso Pro: IA e materiais protegidos devem permanecer bloqueados.
- [ ] Confirmar que o DevTools não mostra chave Gemini ou segredo de servidor no bundle.
- [ ] Testar uma falha de rede durante salvar nota e confirmar botão/mensagem de nova tentativa.

## 4. Evidência

Registrar data, navegador, versão do commit, conta de teste (sem senha), resultado e screenshot de cada falha. Falhas devem virar issue antes de qualquer publicação.

## Limitações conhecidas

- O acervo bíblico, hinos e concordância são parciais e dependem de conteúdo autorizado.
- O modo offline armazena somente até 30 capítulos públicos por dispositivo e não substitui sincronização de dados privados.
- Os testes SQL do Supabase exigem Docker/Podman e `supabase start` local.
