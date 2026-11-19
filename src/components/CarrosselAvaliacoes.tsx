"use client";

import { Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Avaliacao } from "@/types";

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
    <figure className="flex h-full flex-col rounded-card border border-line bg-white p-3.5 lg:p-4">
      <div className="flex items-center justify-between gap-3">
        <Estrelas />
        <span className="text-[11px] leading-4 text-muted">
          <span className="sr-only">Avaliação no {a.origem}, </span>
          {a.quando}
        </span>
      </div>
      <blockquote ref={citacao} className={`mt-2 text-[13px] leading-[19px] text-ink ${aberto ? "" : "line-clamp-3"}`}>
        &ldquo;{a.texto}&rdquo;
      </blockquote>
      {(cortado || aberto) && (
        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          aria-expanded={aberto}
          className="inline-flex min-h-9 items-center self-start text-[12px] font-bold text-brand hover:underline"
        >
          {aberto ? "Ler menos" : "Ler mais"}
        </button>
      )}
      <figcaption className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-2.5 text-[13px] leading-[18px]">
        <span className="font-bold text-ink">{a.nome}</span>
        {a.localGuide && <span className="rounded-full bg-tint px-2 py-0.5 text-[11px] leading-4 font-semibold text-brand">Local Guide</span>}
      </figcaption>
    </figure>
  );
}

/** Uma cópia da fila de cartões. A segunda cópia (oculta e inerte) só existe para o loop não dar salto. */
function Fila({ avaliacoes, oculta = false }: { avaliacoes: Avaliacao[]; oculta?: boolean }) {
  return (
    <ul
      aria-hidden={oculta || undefined}
      inert={oculta || undefined}
      aria-label={oculta ? undefined : "Avaliações de clientes no Google"}
      className="marquee-copia flex shrink-0 items-stretch gap-3 pr-3 lg:gap-4 lg:pr-4"
    >
      {avaliacoes.map((a) => (
        <li key={a.nome} className="w-[260px] shrink-0 lg:w-[290px]">
          <Cartao a={a} />
        </li>
      ))}
    </ul>
  );
}

/**
 * Avaliações rodando sozinhas em faixa contínua, como o carrossel de marcas, só que bem mais devagar.
 * A fila é renderizada duas vezes e anda de 0 a -50%, então o loop não dá salto.
 * Para com o mouse em cima ou com o foco dentro (para ler e clicar em "Ler mais"). Com "reduzir movimento"
 * ligado no sistema vira uma fila com rolagem normal (regras .marquee no globals.css).
 */
export function CarrosselAvaliacoes({ avaliacoes }: { avaliacoes: Avaliacao[] }) {
  return (
    <div className="marquee marquee-pausa -mx-4 overflow-hidden py-1 md:-mx-6 lg:mx-0">
      <div className="marquee-track marquee-lento flex w-max">
        <Fila avaliacoes={avaliacoes} />
        <Fila avaliacoes={avaliacoes} oculta />
      </div>
    </div>
  );
}
