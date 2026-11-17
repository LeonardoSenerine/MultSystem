"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { OrcamentoForm } from "@/components/OrcamentoForm";
import { tiposOrcamento, type TipoOrcamento } from "@/data/orcamento";

/**
 * Modal do orçamento de um tipo só: o título é o nome do tipo e o formulário já vem com ele
 * escolhido, então a pessoa pede a cotação sem sair do lugar em que está na página.
 * `tipo` é null com o modal fechado. O formulário só existe com o modal aberto (cada abertura começa limpa).
 */
export function ModalTipoOrcamento({
  tipo,
  whatsapp,
  aoFechar,
}: {
  tipo: TipoOrcamento | null;
  whatsapp: string;
  aoFechar: () => void;
}) {
  const id = useId();
  const caixa = useRef<HTMLDivElement>(null);
  const aberto = tipo !== null;
  const info = tiposOrcamento.find((t) => t.valor === tipo);

  useEffect(() => {
    if (!aberto) return;
    const html = document.documentElement;
    const anterior = html.style.overflow;
    html.style.overflow = "hidden";
    const t = window.setTimeout(() => caixa.current?.querySelector<HTMLElement>("input[name=nome]")?.focus(), 80);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && aoFechar();
    window.addEventListener("keydown", esc);
    return () => {
      html.style.overflow = anterior;
      window.clearTimeout(t);
      window.removeEventListener("keydown", esc);
    };
  }, [aberto, aoFechar]);

  return (
    <div
      data-open={aberto}
      inert={!aberto}
      className="modal-fundo fixed inset-0 z-[60] flex items-end justify-center bg-navy/50 p-0 sm:items-center sm:p-6"
      onClick={(e) => e.target === e.currentTarget && aoFechar()}
    >
      <div
        ref={caixa}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-titulo`}
        className="modal-caixa relative max-h-[92dvh] w-full overflow-y-auto rounded-t-[24px] bg-white p-6 sm:max-w-[560px] sm:rounded-[24px] sm:p-8"
        style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
      >
        <button
          type="button"
          onClick={aoFechar}
          aria-label="Fechar"
          className="absolute top-3 right-3 grid size-11 place-items-center rounded-full text-muted transition-colors hover:bg-tint hover:text-ink"
        >
          <X aria-hidden className="size-5" />
        </button>

        {info && tipo && (
          <>
            <p className="text-eyebrow text-brand">Orçamento</p>
            <h2 id={`${id}-titulo`} className="mt-1 pr-10 text-[24px] leading-8 font-extrabold tracking-tight text-balance text-ink">
              {info.rotulo}
            </h2>
            <p className="mt-2 text-body text-muted">{info.detalhe}</p>
            <div className="mt-6">
              <OrcamentoForm key={tipo} whatsapp={whatsapp} tipoFixo={tipo} aoFechar={aoFechar} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
