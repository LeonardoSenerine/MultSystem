"use client";

import { Check, Link2 } from "lucide-react";
import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/icones-marca";

const botao =
  "inline-flex min-h-11 items-center gap-2 rounded-btn px-3 text-[14px] font-bold text-brand transition-[background-color,transform] hover:bg-tint active:scale-95";

/** "Copiar link" e "Enviar pelo WhatsApp": para mandar o produto para um colega ou para quem aprova a compra. */
export function CompartilharProduto({ nome }: { nome: string }) {
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (!copiado) return;
    const t = window.setTimeout(() => setCopiado(false), 2000);
    return () => window.clearTimeout(t);
  }, [copiado]);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiado(true);
    } catch {
      // Sem acesso à área de transferência: o endereço continua na barra do navegador.
    }
  }

  return (
    <div className="-ml-3 flex flex-wrap items-center gap-1">
      <button type="button" onClick={copiar} className={`${botao} ${copiado ? "text-[#00734c]" : ""}`}>
        {copiado ? <Check aria-hidden className="erro-campo size-4" strokeWidth={3} /> : <Link2 aria-hidden className="size-4" />}
        <span aria-live="polite">{copiado ? "Link copiado" : "Copiar link"}</span>
      </button>
      <button
        type="button"
        onClick={() => {
          const texto = `${nome}\n${window.location.href}`;
          window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, "_blank", "noopener,noreferrer");
        }}
        className={botao}
      >
        <WhatsAppIcon className="size-4" />
        Enviar pelo WhatsApp
      </button>
    </div>
  );
}
