"use client";

import Link from "next/link";
import { SlidersHorizontal, X } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * No celular os filtros ficam numa gaveta que sobe de baixo, aberta pelo botão "Filtrar".
 * O conteúdo é o mesmo painel da coluna do desktop, renderizado no servidor.
 */
export function FiltrosCelular({
  ativos,
  total,
  limpar,
  children,
}: {
  ativos: number;
  total: number;
  /** URL sem filtros, quando há algum filtro aplicado. */
  limpar?: string;
  children: ReactNode;
}) {
  const [aberto, setAberto] = useState(false);
  const fecharRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const busca = useSearchParams();

  // Escolheu um filtro (a URL mudou): fecha a gaveta para mostrar o resultado.
  // (Ajuste durante a renderização, o jeito recomendado pelo React no lugar de um efeito.)
  const chaveDaUrl = `${pathname}?${busca.toString()}`;
  const [urlAnterior, setUrlAnterior] = useState(chaveDaUrl);
  if (urlAnterior !== chaveDaUrl) {
    setUrlAnterior(chaveDaUrl);
    setAberto(false);
  }

  useEffect(() => {
    if (!aberto) return;
    const html = document.documentElement;
    const anterior = html.style.overflow;
    html.style.overflow = "hidden";
    const t = window.setTimeout(() => fecharRef.current?.focus(), 50);
    const aoTeclar = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    window.addEventListener("keydown", aoTeclar);
    return () => {
      html.style.overflow = anterior;
      window.clearTimeout(t);
      window.removeEventListener("keydown", aoTeclar);
    };
  }, [aberto]);

  return (
    <>
      <button
        type="button"
        onClick={() => setAberto(true)}
        aria-haspopup="dialog"
        aria-expanded={aberto}
        aria-controls="gaveta-filtros"
        className={`flex min-h-11 w-full items-center justify-center gap-2 rounded-btn px-4 text-[14px] font-bold whitespace-nowrap ring-1 transition-[background-color,transform] duration-200 active:scale-[0.98] lg:hidden ${
          ativos > 0 ? "bg-[#e3e9f8] text-brand ring-brand/40" : "bg-white text-ink ring-line"
        }`}
      >
        <SlidersHorizontal aria-hidden className="size-4" />
        Filtrar
        {ativos > 0 && (
          <span key={ativos} className="contador-pula grid size-5 place-items-center rounded-full bg-brand text-[12px] leading-none font-bold text-white">
            {ativos}
          </span>
        )}
      </button>

      <div
        data-open={aberto}
        aria-hidden
        onClick={() => setAberto(false)}
        className="gaveta-fundo fixed inset-0 z-50 bg-navy/40 lg:hidden"
      />
      <div
        id="gaveta-filtros"
        role="dialog"
        aria-modal="true"
        aria-label="Filtros"
        data-open={aberto}
        inert={!aberto}
        className="gaveta fixed inset-x-0 bottom-0 z-50 flex max-h-[88dvh] flex-col rounded-t-[20px] bg-white lg:hidden"
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-line px-4">
          <p className="text-[17px] font-extrabold text-ink">Filtros</p>
          <button
            ref={fecharRef}
            type="button"
            onClick={() => setAberto(false)}
            aria-label="Fechar filtros"
            className="grid size-11 place-items-center rounded-btn text-ink hover:bg-tint"
          >
            <X aria-hidden className="size-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-3">{children}</div>
        <div
          className="flex shrink-0 gap-3 border-t border-line p-4 shadow-[0_-8px_24px_rgb(28_47_92/0.06)]"
          style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
        >
          {limpar && (
            <Link
              href={limpar}
              scroll={false}
              className="inline-flex min-h-12 shrink-0 items-center rounded-btn border border-line px-5 text-body font-bold text-ink"
            >
              Limpar
            </Link>
          )}
          <button
            type="button"
            onClick={() => setAberto(false)}
            className="min-h-12 flex-1 rounded-btn bg-brand px-5 text-body font-bold text-white hover:bg-[#263b73]"
          >
            Ver {total.toLocaleString("pt-BR")} {total === 1 ? "produto" : "produtos"}
          </button>
        </div>
      </div>
    </>
  );
}
