"use client";

import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Avaliacao } from "@/types";

/** Tempo entre um cartão e o próximo, quando o carrossel roda sozinho. */
const INTERVALO = 4500;

function Estrelas() {
  return (
    <span className="flex gap-0.5" role="img" aria-label="5 de 5 estrelas">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} aria-hidden className="size-3.5 fill-amber text-amber" />
      ))}
    </span>
  );
}

/** Cartão compacto: estrelas e tempo na primeira linha, texto em até 3 linhas ("Ler mais" só se foi cortado) e o nome embaixo. */
function Cartao({ a }: { a: Avaliacao }) {
  const citacao = useRef<HTMLQuoteElement>(null);
  const [aberto, setAberto] = useState(false);
  const [cortado, setCortado] = useState(false);

  // Descobre se o texto passou de 3 linhas (depende da largura do cartão, por isso mede e acompanha o redimensionamento).
  useEffect(() => {
    const el = citacao.current;
    if (!el) return;
    const observador = new ResizeObserver(() => {
      if (!el.classList.contains("line-clamp-3")) return;
      setCortado(el.scrollHeight > el.clientHeight + 1);
    });
    observador.observe(el);
    return () => observador.disconnect();
  }, [aberto]);

  return (
    <figure className="flex h-full flex-col rounded-card border border-line bg-white p-4 lg:p-5">
      <div className="flex items-center justify-between gap-3">
        <Estrelas />
        <span className="text-[12px] leading-4 text-muted">
          <span className="sr-only">Avaliação no {a.origem}, </span>
          {a.quando}
        </span>
      </div>
      <blockquote ref={citacao} className={`mt-2.5 text-small text-ink ${aberto ? "" : "line-clamp-3"}`}>
        &ldquo;{a.texto}&rdquo;
      </blockquote>
      {(cortado || aberto) && (
        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          aria-expanded={aberto}
          className="inline-flex min-h-11 items-center self-start text-[13px] font-bold text-brand hover:underline"
        >
          {aberto ? "Ler menos" : "Ler mais"}
        </button>
      )}
      <figcaption className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-3 text-small">
        <span className="font-bold text-ink">{a.nome}</span>
        {a.localGuide && <span className="rounded-full bg-tint px-2 py-0.5 text-[11px] leading-4 font-semibold text-brand">Local Guide</span>}
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

  // Roda sozinho: a cada INTERVALO avança um cartão e, no fim, volta ao começo. Para quando o mouse está em cima,
  // o foco está dentro, a pessoa toca/rola, a fila está fora da tela ou a aba está escondida. Com "reduzir
  // movimento" ligado no sistema, não roda.
  const parado = useRef(false);
  const visivel = useRef(false);
  const retomarEm = useRef(0);

  useEffect(() => {
    const el = trilha.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observador = new IntersectionObserver(([e]) => (visivel.current = e.isIntersecting), { threshold: 0.3 });
    observador.observe(el);

    const pausar = (ms = 0) => {
      parado.current = true;
      retomarEm.current = ms ? Date.now() + ms : 0;
    };
    const liberar = () => {
      parado.current = false;
    };
    // Mouse e teclado: parado enquanto estiver em cima ou com foco. Toque e rolagem manual: pausa por alguns segundos.
    const aoEntrar = () => pausar();
    const aoToque = () => pausar(8000);
    el.addEventListener("mouseenter", aoEntrar);
    el.addEventListener("mouseleave", liberar);
    el.addEventListener("focusin", aoEntrar);
    el.addEventListener("focusout", liberar);
    el.addEventListener("touchstart", aoToque, { passive: true });
    el.addEventListener("wheel", aoToque, { passive: true });

    const relogio = window.setInterval(() => {
      if (document.hidden || !visivel.current) return;
      if (retomarEm.current && Date.now() >= retomarEm.current) {
        retomarEm.current = 0;
        parado.current = false;
      }
      if (parado.current) return;
      const cartoes = el.children;
      if (cartoes.length < 2) return;
      const passo = (cartoes[1] as HTMLElement).offsetLeft - (cartoes[0] as HTMLElement).offsetLeft;
      const noFim = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      el.scrollTo({ left: noFim ? 0 : el.scrollLeft + passo, behavior: "smooth" });
    }, INTERVALO);

    return () => {
      window.clearInterval(relogio);
      observador.disconnect();
      el.removeEventListener("mouseenter", aoEntrar);
      el.removeEventListener("mouseleave", liberar);
      el.removeEventListener("focusin", aoEntrar);
      el.removeEventListener("focusout", liberar);
      el.removeEventListener("touchstart", aoToque);
      el.removeEventListener("wheel", aoToque);
    };
  }, []);

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
