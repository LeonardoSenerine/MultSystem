"use client";

import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Avaliacao } from "@/types";

const LIMITE_RESUMO = 140;

function Estrelas() {
  return (
    <span className="flex gap-0.5" role="img" aria-label="5 de 5 estrelas">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} aria-hidden className="size-4 fill-amber text-amber" />
      ))}
    </span>
  );
}

function Cartao({ a }: { a: Avaliacao }) {
  const [aberto, setAberto] = useState(false);
  const longo = a.texto.length > LIMITE_RESUMO;
  const texto = longo && !aberto ? `${a.texto.slice(0, LIMITE_RESUMO).trimEnd()}…` : a.texto;

  return (
    <figure className="flex h-full flex-col rounded-card border border-line bg-white p-5 lg:p-6">
      <Estrelas />
      <blockquote className="mt-3 flex-1 text-body text-ink">&ldquo;{texto}&rdquo;</blockquote>
      {longo && (
        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          aria-expanded={aberto}
          className="mt-1 inline-flex min-h-11 items-center self-start text-[14px] font-bold text-brand hover:underline"
        >
          {aberto ? "Ler menos" : "Ler mais"}
        </button>
      )}
      <figcaption className="mt-3 text-small text-muted">
        <span className="font-bold text-ink">{a.nome}</span>
        {a.localGuide && <span className="ml-1.5 rounded-full bg-tint px-2 py-0.5 text-[12px] font-semibold text-brand">Local Guide</span>}
        <span className="mt-0.5 block text-[13px]">
          <span className="sr-only">Avaliação no </span>
          {a.origem}
          {a.quando ? ` · ${a.quando}` : ""}
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * Avaliações em fila que desliza para o lado (com a mão, no celular; com as setas ou a roda do mouse, no
 * computador). Mostra 1 cartão e meio no celular, 2 no tablet e 3 no desktop.
 */
export function CarrosselAvaliacoes({ avaliacoes }: { avaliacoes: Avaliacao[] }) {
  const trilha = useRef<HTMLUListElement>(null);
  const [podeVoltar, setPodeVoltar] = useState(false);
  const [podeAvancar, setPodeAvancar] = useState(true);

  const medir = useCallback(() => {
    const el = trilha.current;
    if (!el) return;
    setPodeVoltar(el.scrollLeft > 4);
    setPodeAvancar(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, [medir]);

  const mover = (direcao: 1 | -1) => {
    const el = trilha.current;
    if (!el) return;
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direcao * el.clientWidth * 0.9, behavior: reduzido ? "auto" : "smooth" });
  };

  const seta =
    "grid size-11 place-items-center rounded-full bg-white ring-1 ring-line transition-[background-color,color,opacity,transform] duration-200 hover:text-brand hover:ring-brand active:scale-95 disabled:pointer-events-none disabled:opacity-40";

  return (
    <div>
      <ul
        ref={trilha}
        onScroll={medir}
        tabIndex={0}
        aria-label="Avaliações de clientes no Google"
        className="-mx-4 flex snap-x snap-mandatory scroll-pl-4 items-stretch gap-3 overflow-x-auto px-4 pb-2 md:scroll-pl-6 lg:scroll-pl-0 [scrollbar-width:none] md:-mx-6 md:px-6 lg:mx-0 lg:gap-6 lg:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {avaliacoes.map((a) => (
          <li key={a.nome} className="w-[84%] shrink-0 snap-start sm:w-[calc(50%-6px)] lg:w-[calc((100%-48px)/3)]">
            <Cartao a={a} />
          </li>
        ))}
      </ul>

      <div className="mt-3 flex items-center justify-end gap-2">
        <button type="button" onClick={() => mover(-1)} disabled={!podeVoltar} aria-label="Avaliações anteriores" className={seta}>
          <ChevronLeft aria-hidden className="size-5" />
        </button>
        <button type="button" onClick={() => mover(1)} disabled={!podeAvancar} aria-label="Próximas avaliações" className={seta}>
          <ChevronRight aria-hidden className="size-5" />
        </button>
      </div>
    </div>
  );
}
