# Fluxo de trabalho deste projeto

- Após concluir as alterações e verificações pertinentes, sincronizar o código com o repositório GitHub existente e aplicar as configurações Firebase afetadas, conforme solicitado pela proprietária.
- Verificar o estado remoto antes de atualizar; preservar alterações concorrentes e não usar force-push.
- Firebase de destino: possible-zephyr-zxctm. Banco exclusivo do IATheos Pro: ai-studio-iatheosprointeli-6684e688-953f-4a8e-817e-4611e2daeff1 (Enterprise Native, us-east1). Não alterar o banco Ecclesia ou outros recursos sem relação com esta aplicação.
- Para regras/índices remotos usar firebase.remote.json; firebase.json permanece destinado aos emuladores locais. Conferir o destino antes de aplicar.
- Não publicar site, escolher hospedagem, migrar/excluir dados ou alterar faturamento apenas por sincronizar código e regras. Não enviar credenciais, .env, logs, binários Java ou dados dos emuladores ao GitHub. As fixtures versionadas pertencem apenas aos testes e não devem ser enviadas ao Firebase remoto.
- Se houver impedimento de autenticação ou permissão, concluir a parte independente e informar exatamente o que ficou pendente. Não declarar uma atualização remota concluída sem conferir seu resultado.
