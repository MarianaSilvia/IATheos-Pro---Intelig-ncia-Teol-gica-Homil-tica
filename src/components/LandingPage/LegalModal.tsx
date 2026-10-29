import React from "react";

export type LegalPage = "privacy" | "terms" | "ai" | "access";

const CONTENT: Record<LegalPage, { title: string; paragraphs: string[] }> = {
  privacy: {
    title: "Política de privacidade",
    paragraphs: [
      "O Verbo Norte trata e-mail, identificadores de conta, estudos, notas, progresso de leitura, pedidos e registros técnicos para autenticar usuários, entregar materiais, manter a segurança e prestar o serviço.",
      "Os dados são armazenados no Supabase. Os materiais são mantidos em links externos do Google Drive. Dados não são vendidos. Solicitações de acesso, correção ou exclusão devem ser encaminhadas ao canal de suporte informado pelo responsável pelo serviço.",
      "Antes da publicação, o responsável deverá preencher nome legal, responsável pelo tratamento, e-mail de suporte e prazos de retenção definitivos.",
    ],
  },
  terms: {
    title: "Termos de uso",
    paragraphs: [
      "O uso do Verbo Norte é pessoal e não transfere a propriedade dos materiais. O usuário deve utilizar o sistema e os links externos conforme a legislação e as condições do produto adquirido.",
      "Pedidos são processados pela InfinitePay. Confirmação, cancelamento e eventual estorno seguem o status validado pelo provedor. Um estorno, fraude ou violação dos termos pode revogar o direito de acesso.",
      "As regras comerciais definitivas, foro e dados do responsável deverão ser preenchidos antes da publicação.",
    ],
  },
  ai: {
    title: "Aviso sobre conteúdo gerado por IA",
    paragraphs: [
      "O Gemini é uma ferramenta de apoio. Conteúdo gerado pode estar incompleto ou incorreto e deve ser revisado antes de uso em ensino, pregação ou publicação.",
      "Referências bíblicas, contexto histórico, termos originais e aplicações devem ser conferidos pelo responsável. A geração não substitui estudo, discernimento ministerial ou revisão editorial.",
    ],
  },
  access: {
    title: "Política de acesso, estorno e revogação",
    paragraphs: [
      "O acesso a materiais depende de autenticação, confirmação do pedido e concessão do direito ao usuário correto. Produtos arquivados não recebem novas concessões, mas direitos já concedidos permanecem até revogação explícita.",
      "Em caso de estorno, cancelamento, fraude ou violação dos termos, o direito correspondente pode ser suspenso ou revogado. Links externos do Google Drive podem ser compartilhados por quem os receber; essa é uma limitação do modelo de entrega adotado.",
      "Valores, prazos e canais de suporte devem ser preenchidos pelo responsável antes da publicação.",
    ],
  },
};

export function LegalModal({ page, onClose }: { page: LegalPage; onClose: () => void }) {
  const content = CONTENT[page];
  return <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/80 p-4" role="dialog" aria-modal="true" aria-labelledby="legal-title">
    <article className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 text-slate-900 shadow-2xl sm:p-8">
      <div className="flex items-start justify-between gap-4"><h2 id="legal-title" className="text-2xl font-bold font-serif">{content.title}</h2><button type="button" onClick={onClose} className="text-2xl text-slate-500" aria-label="Fechar">×</button></div>
      <div className="mt-6 space-y-4 text-sm leading-relaxed">{content.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      <p className="mt-6 rounded-xl bg-amber-50 p-3 text-xs text-amber-900">Documento informativo em revisão. Os dados legais e comerciais definitivos devem ser preenchidos antes da publicação.</p>
      <button type="button" onClick={onClose} className="mt-6 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white">Fechar</button>
    </article>
  </div>;
}

