import React from "react";

/** Compatibility shell for legacy landing components. Real checkout is created
 * by the server-side /api/subscription-interest route. */
export function SubscriptionCheckoutModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; customerEmail?: string; onPaymentSuccess?: (email: string) => void }) {
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"><div className="bg-slate-950 text-white rounded-2xl p-6 max-w-sm w-full"><p className="text-sm">O checkout é iniciado pela página de planos.</p><button onClick={onClose} className="mt-4 bg-amber-500 text-slate-950 rounded-xl px-4 py-2">Fechar</button></div></div>;
}
