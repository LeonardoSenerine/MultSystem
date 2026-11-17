"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Linha de etiquetas que rola para o lado. No desktop, quando há etiquetas escondidas, abre-se
 * uma faixa de 52 px em cada ponta só para as setas (elas não ficam por cima das etiquetas);
 * as setas se apagam quando não há mais para onde rolar. No celular rola com o dedo.
 * As bordas somem suavemente.
 */
export function EtiquetasRolaveis({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  const trilho = useRef<HTMLUListElement>(null);
  const [esquerda, setEsquerda] = useState(false);
  const [direita, setDireita] = useState(false);
  const [rolavel, setRolavel] = useState(false);

  useEffect(() => {
    const el = trilho.current;
    if (!el) return;
    const medir = () => {
      const noInicio = el.scrollLeft <= 4;
      const noFim = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      setEsquerda(!noInicio);
      setDireita(!noFim);
      setRolavel(!(noInicio && noFim));
    };
    medir();
    el.addEventListener("scroll", medir, { passive: true });
    const observer = new ResizeObserver(medir);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", medir);
      observer.disconnect();
    };
  }, [children]);

  const rolar = (lado: 1 | -1) => trilho.current?.scrollBy({ left: lado * trilho.current.clientWidth * 0.7, behavior: "smooth" });

  const mascara =
    esquerda && direita
      ? "linear-gradient(to right, transparent, #000 40px, #000 calc(100% - 40px), transparent)"
      : direita
        ? "linear-gradient(to right, #000 calc(100% - 40px), transparent)"
        : esquerda
          ? "linear-gradient(to right, transparent, #000 40px)"
          : undefined;

  const seta =
    "absolute top-1/2 z-10 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-white text-ink ring-1 ring-line transition-[opacity,color,box-shadow,transform] duration-200 enabled:shadow-[0_2px_8px_rgb(28_47_92/0.14)] enabled:hover:text-brand enabled:hover:ring-brand enabled:active:scale-90 disabled:opacity-35 lg:grid";

  return (
    <div className={`relative ${rolavel ? "lg:px-[52px]" : ""}`}>
      <ul
        ref={trilho}
        aria-label={rotulo}
        className="-mx-4 flex gap-2 overflow-x-auto scroll-smooth px-4 py-1 [scrollbar-width:none] md:-mx-6 md:px-6 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
        style={{ maskImage: mascara, WebkitMaskImage: mascara }}
      >
        {children}
      </ul>
      {rolavel && (
        <>
          <button type="button" aria-label="Ver etiquetas anteriores" disabled={!esquerda} onClick={() => rolar(-1)} className={`${seta} left-0`}>
            <ChevronLeft aria-hidden className="size-4" />
          </button>
          <button type="button" aria-label="Ver mais etiquetas" disabled={!direita} onClick={() => rolar(1)} className={`${seta} right-0`}>
            <ChevronRight aria-hidden className="size-4" />
          </button>
        </>
      )}
    </div>
  );
}
