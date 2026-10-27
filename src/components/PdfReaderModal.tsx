import React, { useEffect, useState } from "react";
import type { DigitalProduct } from "../utils/ecosystem";
import { pdfFile } from "../lib/api";
export function PdfReaderModal({
  product,
  onClose,
}: {
  product: DigitalProduct;
  onClose: () => void;
}) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    let objectUrl = "";
    setUrl("");
    setError("");
    pdfFile(product.id)
      .then((blob) => {
        if (active) {
          objectUrl = URL.createObjectURL(blob);
          setUrl(objectUrl);
        }
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [product.id, attempt]);
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={product.title}
      className="fixed inset-0 z-50 bg-slate-950 p-4 flex flex-col"
    >
      <div className="text-white flex justify-between gap-3 pb-4">
        <h2>{product.title}</h2>
        <div className="flex gap-5">
          {url && (
            <a href={url} download={product.title + ".pdf"}>
              Baixar PDF
            </a>
          )}
          <button autoFocus onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
      {error ? (
        <p role="alert" className="text-white">
          {error}{" "}
          <button onClick={() => setAttempt((a) => a + 1)}>
            Tentar novamente
          </button>
        </p>
      ) : url ? (
        <iframe
          title={product.title}
          className="flex-1 w-full bg-white"
          src={url}
        />
      ) : (
        <p role="status" className="text-white">
          Carregando PDF…
        </p>
      )}
    </div>
  );
}
