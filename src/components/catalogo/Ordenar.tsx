"use client";

import { ArrowUpDown, Check, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, useTransition } from "react";
import { ORDENS, type Ordem } from "@/lib/filtros";

/**
 * "Ordenar por" desenhado (no lugar do <select> do sistema): botão que abre uma lista.
 * Teclado: setas sobem e descem, Enter escolhe, Esc fecha.
 * `compacto` é a versão de etiqueta usada na barra do celular.
 */
export function Ordenar({ atual, urls, compacto = false }: { atual: Ordem; urls: Record<Ordem, string>; compacto?: boolean }) {
  const router = useRouter();
  const [aberto, setAberto] = useState(false);
  const [ativo, setAtivo] = useState(() => ORDENS.findIndex((o) => o.valor === atual));
  const [carregando, iniciar] = useTransition();
  const caixa = useRef<HTMLDivElement>(null);
  const botao = useRef<HTMLButtonElement>(null);
  const lista = useRef<HTMLUListElement>(null);
  const id = useId();
  const nomeAtual = ORDENS.find((o) => o.valor === atual)?.nome;

  useEffect(() => {
    if (!aberto) return;
    lista.current?.focus();
    const fora = (e: PointerEvent) => !caixa.current?.contains(e.target as Node) && setAberto(false);
    document.addEventListener("pointerdown", fora);
    return () => document.removeEventListener("pointerdown", fora);
  }, [aberto]);

  const escolher = (valor: Ordem) => {
    setAberto(false);
    botao.current?.focus();
    if (valor !== atual) iniciar(() => router.push(urls[valor], { scroll: false }));
  };

  const aoTeclar = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setAberto(false);
      botao.current?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setAtivo((i) => (i + 1) % ORDENS.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setAtivo((i) => (i - 1 + ORDENS.length) % ORDENS.length);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      escolher(ORDENS[ativo].valor);
    } else if (e.key === "Tab") {
      setAberto(false);
    }
  };

  return (
    // No desktop a caixa tem largura fixa: o botão não cresce com o nome escolhido e o menu abre
    // exatamente da mesma largura dele.
    <div ref={caixa} className={compacto ? "relative" : "relative w-[272px]"}>
      {/* No celular a lista sobe de baixo, com fundo escurecido. */}
      {compacto && (
        <div
          aria-hidden
          data-open={aberto}
          onClick={() => setAberto(false)}
          className="gaveta-fundo fixed inset-0 z-50 bg-navy/40"
        />
      )}
      <button
        ref={botao}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={aberto}
        aria-controls={id}
        aria-busy={carregando}
        onClick={() => setAberto((a) => !a)}
        className={
          compacto
            ? "flex min-h-11 w-full items-center justify-center gap-2 rounded-btn bg-white px-4 text-[14px] font-bold whitespace-nowrap text-ink ring-1 ring-line"
            : "flex min-h-11 w-full items-center gap-2 rounded-btn bg-white pr-3 pl-4 text-[14px] whitespace-nowrap text-muted ring-1 ring-line transition-shadow hover:ring-brand data-[aberto=true]:ring-2 data-[aberto=true]:ring-brand"
        }
        data-aberto={aberto}
      >
        {compacto ? (
          <>
            <ArrowUpDown aria-hidden className="size-4" />
            {nomeAtual}
          </>
        ) : (
          <>
            <span className="min-w-0 flex-1 truncate text-left">
              Ordenar por <span className="font-bold text-ink">{nomeAtual}</span>
            </span>
            <ChevronDown aria-hidden className={`size-4 shrink-0 text-ink transition-transform ${aberto ? "rotate-180" : ""}`} />
          </>
        )}
      </button>

      <ul
        ref={lista}
        id={id}
        role="listbox"
        tabIndex={-1}
        aria-label="Ordenar por"
        aria-activedescendant={`${id}-${ativo}`}
        onKeyDown={aoTeclar}
        data-aberto={aberto}
        className={`menu-ordenar z-50 overflow-hidden bg-white p-1.5 shadow-[0_12px_32px_rgb(28_47_92/0.16)] ring-1 ring-line focus:outline-none ${
          compacto
            ? "fixed inset-x-3 bottom-3 rounded-[20px] p-2 pt-0 before:block before:px-3 before:pt-4 before:pb-2 before:text-[13px] before:font-bold before:text-muted before:content-['Ordenar_por']"
            : "absolute inset-x-0 mt-2 rounded-card"
        }`}
      >
        {ORDENS.map((o, i) => {
          const escolhida = o.valor === atual;
          return (
            <li
              key={o.valor}
              id={`${id}-${i}`}
              role="option"
              aria-selected={escolhida}
              onClick={() => escolher(o.valor)}
              onMouseEnter={() => setAtivo(i)}
              className={`flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-[10px] px-3 text-[14px] ${
                i === ativo ? "bg-tint" : ""
              } ${escolhida ? "font-bold text-brand" : "text-ink"}`}
            >
              {o.nome}
              {escolhida && <Check aria-hidden className="size-4" strokeWidth={2.5} />}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
