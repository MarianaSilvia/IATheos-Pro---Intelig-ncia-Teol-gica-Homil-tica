# Sincronização — IATheos Pro

Data: 27/10/2026. Base do levantamento: 17a08d216ae8b696ffedb7f1c405885f332635d3.

## Código

Repositório de destino: https://github.com/MarianaSilvia/IATheos-Pro---Intelig-ncia-Teol-gica-Homil-tica, branch main.

Esta entrega reúne a reestruturação Firebase, testes, documentação, relatório de análise inicial e inventário dos arquivos. O commit desta entrega é o registro da sincronização de código. Não inclui segredos, dados dos emuladores, binários, node_modules ou o build gerado.

## Firestore — atualizado e conferido

- Projeto: possible-zephyr-zxctm (número 616747257260).
- Banco: ai-studio-iatheosprointeli-6684e688-953f-4a8e-817e-4611e2daeff1.
- Edição: ENTERPRISE; modo: FIRESTORE_NATIVE; região: us-east1.
- Regras publicadas: projects/possible-zephyr-zxctm/rulesets/925b6055-e4c2-4e54-a45a-c129f6a095d1.
- Versão anterior preservada: projects/possible-zephyr-zxctm/rulesets/42b7c193-8ea7-4f48-9ebc-cec2e386a769.
- Cinco índices densos confirmados em estado READY: studies(updatedAt DESC), studies(type ASC, updatedAt DESC), notes(updatedAt DESC), events(createdAt ASC) e adminAudit(createdAt DESC).
- Validação remota: regras idênticas ao arquivo local, cinco índices existentes e zero índices pendentes de criação.
- O banco do Ecclesia foi preservado. Nenhum documento de usuário foi migrado, criado ou excluído na sincronização.

Os arquivos de regras foram validados pelo serviço Firebase Rules antes da publicação. Há cópia local da configuração anterior em .emulator-data/cloud-backups/, ignorada pelo Git.

## Storage — pendência externa

O bucket possible-zephyr-zxctm.firebasestorage.app ainda não existe. O Console do Firebase confirmou que Storage não está disponível no projeto nível Starter do AI Studio e exige upgrade. O bucket Cloud Run de código-fonte já existente não foi alterado.

storage.rules permanece versionado e testado nos emuladores. Sua aplicação e a criação do bucket dependem da liberação do produto no projeto. Não foi alterado faturamento, contratado plano ou criado bucket alternativo.

## Verificações e limites

- Etapa local: instalação limpa, TypeScript, build, 23 testes unitários e 8 testes/subtestes de integração aprovados; npm audit sem vulnerabilidades reportadas.
- Sincronização: banco e edição conferidos, regras compiladas e versão ativa confirmada, cinco índices READY, execução de firebase:check reconhecendo zero mudanças Firestore pendentes.
- Não foi publicado site ou backend em hospedagem. O código fica no GitHub; os arquivos React/Express não são armazenados como documentos Firestore.
- OAuth Google real, Gemini real e execução remota do backend continuam fora da validação de runtime desta fase.

## Próximas alterações

Concluir a implementação, executar as verificações pertinentes, verificar concorrência no GitHub e sincronizar o código. Aplicar somente configurações Firebase afetadas, com o destino explícito e sem remover recursos de outras aplicações. Informar impedimentos reais em vez de declarar uma sincronização completa quando houver pendência.
