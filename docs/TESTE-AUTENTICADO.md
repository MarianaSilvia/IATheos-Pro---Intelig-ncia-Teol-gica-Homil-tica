# Teste autenticado — Verbo Norte

Use este roteiro na implantação publicada. Não registre senhas, tokens ou links privados em screenshots ou no GitHub.

## Preparação

- Tenha um e-mail de administrador e um e-mail de comprador aprovado.
- Use uma janela anônima para o comprador, separada da sessão administrativa.
- Confirme que a aplicação mostra a versão esperada em `/api/health`.

## Administrador

1. Abra **Acessar Painel** e entre com e-mail e senha administrativos.
2. Confirme que o painel administrativo aparece e que a saudação usa o primeiro nome.
3. Abra **Administração → Assinantes** e localize o comprador aprovado.
4. Edite nome e telefone; salve e recarregue a página.
5. Gere uma senha provisória. Confirme que o sistema abre o WhatsApp ou copia a mensagem sem expor a senha na interface pública.
6. Abra **Materiais da loja** e confirme os números de vendas e a distribuição mensal/anual.
7. Gere uma mensagem de atendimento, revise o texto e confirme que o botão abre o WhatsApp com a mensagem preenchida.

## Comprador

1. Abra a aplicação em janela anônima.
2. Entre com o e-mail e a senha provisória recebidos.
3. Confirme que a tela de primeiro acesso exige uma senha pessoal com pelo menos oito caracteres.
4. Saia e entre novamente usando a senha pessoal.
5. Crie um estudo, salve uma nota e recarregue a página; os dados devem reaparecer.
6. Abra Bíblia, seleção de versículos, Raio-X, Sermão, EBD, Editor, Dicionário e Concordância.
7. No EBD, anexe um PDF ou imagem de até 3 MB e gere a aula. Teste também um arquivo maior ou formato inválido; o botão deve permanecer bloqueado e explicar o erro.
8. Abra um material concedido e confirme que o link externo só aparece após autorização.
9. Tente abrir um material sem direito; o acesso deve ser recusado.
10. Faça logout, troque de conta e confirme que estudos, notas e cache não vazam entre usuários.

## Evidências

Registre somente resultados e mensagens, nunca credenciais. O teste é aprovado quando cada item retorna o comportamento esperado e o smoke test público continua passando.
