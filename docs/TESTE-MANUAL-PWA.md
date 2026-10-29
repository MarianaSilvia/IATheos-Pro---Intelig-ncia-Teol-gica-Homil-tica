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
- [ ] Fechar uma ferramenta, voltar ao leitor e confirmar que a seleção de versículos continua destacada como intervalo ou lista.
- [ ] Em uma referência relacionada, usar **Editor** e confirmar que ela é aberta como nova referência do estudo sem redigitação; quando o trecho estiver no acervo, o texto também deve ser preenchido.
- [ ] Confirmar que a referência é preservada e que nenhuma ferramenta inventa texto ausente.
- [ ] Comparar duas traduções quando ambas estiverem disponíveis.
- [ ] Selecionar versículos, abrir **Comparar versões** e confirmar que somente o trecho selecionado aparece nas duas traduções; sem seleção, confirmar o capítulo completo.
- [ ] Na comparação, usar **Copiar comparação** e confirmar que o texto contém as duas traduções e somente o trecho ativo.
- [ ] Na comparação, usar **Salvar nas notas** e confirmar que a comparação reaparece em **Minhas notas** após recarregar.
- [ ] Salvar o versículo como nota e confirmar a mensagem de sucesso.
- [ ] Abrir o Editor e confirmar que referência e texto são preenchidos.
- [ ] No Editor, inserir uma passagem, uma referência adicional e uma **Nota pessoal**.
- [ ] Aguardar o salvamento automático, recarregar a aplicação e abrir o filtro **Editados** no Caderno.
- [ ] Reabrir o estudo editado e confirmar que blocos, referências e campos de contexto foram restaurados.
- [ ] Confirmar com outra conta que o estudo editado não aparece.
- [ ] Marcar o capítulo como **Disponibilizar offline**, sair e reabrir o PWA sem rede.
- [ ] Confirmar que o texto dos versículos marcados continua disponível offline e que o cache não inclui notas ou dados privados.
- [ ] Reabrir o capítulo pela lista de capítulos offline e removê-lo depois do teste.
- [ ] Marcar mais de um capítulo, usar **Limpar cache** e confirmar que a lista fica vazia.

### 2.1 Pesquisa bíblica e geral

- [ ] Pesquisar um termo no **Dicionário bíblico** e confirmar a origem “Acervo Verbo Norte”.
- [ ] Alternar para **Dicionário geral** e testar “contexto”, “discernimento” ou “resiliência”, conferindo categoria e sinônimos.
- [ ] Pesquisar um termo geral ausente e confirmar que a consulta ao Gemini aparece identificada como IA e sujeita a revisão.
- [ ] Pesquisar “graça”, “GRACA” e “graças” na Concordância e confirmar a mesma entrada quando disponível.
- [ ] Em uma referência do Dicionário/Concordância, testar os atalhos **Bíblia** e **Raio-X**.
- [ ] No resultado do Dicionário, abrir a Concordância e confirmar que o termo já aparece preenchido.
- [ ] Salvar uma definição do Dicionário e uma ocorrência da Concordância diretamente nas notas e confirmar a sincronização em **Minhas notas**.
- [ ] Clicar duas vezes rapidamente em salvar e confirmar que apenas uma nota é criada e o botão mostra estado de salvamento.

## 3. Integridade e segurança

- [ ] Trocar de conta e confirmar que notas e histórico não aparecem misturados.
- [ ] Fazer logout e confirmar que as telas privadas não permanecem acessíveis.
- [ ] Testar uma conta sem acesso Pro: IA e materiais protegidos devem permanecer bloqueados.
- [ ] Confirmar que o DevTools não mostra chave Gemini ou segredo de servidor no bundle.
- [ ] Testar uma falha de rede durante salvar nota e confirmar botão/mensagem de nova tentativa.
- [ ] Na loja, confirmar que **Minha biblioteca** mostra somente materiais com direito concedido.
- [ ] Abrir um produto sem acesso e confirmar a mensagem de solicitação ao administrador.
- [ ] Abrir um produto concedido sem link e confirmar a mensagem de link ainda não cadastrado.
- [ ] Abrir um produto concedido com link e confirmar a conferência de acesso antes de abrir a nuvem externa.
- [ ] Simular falha na consulta do link e confirmar mensagem de erro e nova tentativa sem liberar acesso indevido.

## 4. Evidência

Registrar data, navegador, versão do commit, conta de teste (sem senha), resultado e screenshot de cada falha. Falhas devem virar issue antes de qualquer publicação.

## Limitações conhecidas

- O acervo bíblico, hinos e concordância são parciais e dependem de conteúdo autorizado.
- O modo offline armazena somente até 30 capítulos públicos por dispositivo e não substitui sincronização de dados privados.
- Os testes SQL do Supabase exigem Docker/Podman e `supabase start` local.
- Após iniciar o emulador, executar `npm run supabase:test` e registrar o resultado no relatório de homologação.
