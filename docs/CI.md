# Integração contínua

O workflow `.github/workflows/ci.yml` executa a cada push na `main`, a cada pull request e também pode ser iniciado manualmente em **Actions → Verbo Norte CI → Run workflow**:

Execuções antigas da mesma referência são canceladas quando chega uma nova, para que o resultado mais recente seja o que permaneça como referência.

1. instalação limpa com `npm ci`;
2. preflight de segurança;
3. verificação TypeScript (`npm run lint`);
4. testes unitários;
5. testes de integração;
6. build de produção.

Para reproduzir localmente:

```bash
npm ci
npm run verify
```

O CI não usa credenciais de produção. As variáveis reais do Supabase, Gemini, InfinitePay e domínio devem permanecer nos ambientes protegidos da hospedagem e só serão exigidas por um preflight explicitamente marcado como produção.

Se a execução falhar, corrija o código e repita a verificação antes de publicar. O teste de integração abre uma porta loopback temporária; ele não altera recursos remotos.
