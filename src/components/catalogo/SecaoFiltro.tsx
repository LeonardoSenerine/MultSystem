"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useId, useState, type ReactNode } from "react";

/**
 * Bloco do painel de filtros que abre e fecha com altura animada.
 * Mesmo fechado, mostra embaixo do título o que está escolhido ("Intelbras, TP-Link"),
 * e tem um "Limpar" só daquele filtro.
 */
export function SecaoFiltro({
  nome,
  escolhido,
  limpar,
  aberta = true,
  children,
}: {
  nome: string;
  /** O que está escolhido neste filtro, em texto curto. */
  escolhido?: string;
  /** URL sem este filtro (aparece o "Limpar" quando há algo escolhido). */
  limpar?: string;
  aberta?: boolean;
  children: ReactNode;
}) {
  const [aberto, setAberto] = useState(aberta);
  const id = useId();

  return (
    <section className="filtro-secao border-t border-line first:border-t-0" data-open={aberto}>
      <div className="flex items-center gap-2">
        <h3 className="min-w-0 flex-1">
          <button
            type="button"
            aria-expanded={aberto}
            aria-controls={id}
            onClick={() => setAberto((a) => !a)}
            className="group/titulo flex min-h-14 w-full items-center gap-3 py-2 text-left"
          >
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] leading-5 font-bold text-ink">{nome}</span>
              {escolhido && (
                <span key={escolhido} className="erro-campo mt-0.5 block truncate text-[13px] leading-[18px] font-semibold text-brand">
                  {escolhido}
                </span>
              )}
            </span>
            <span
              aria-hidden
              className="grid size-8 shrink-0 place-items-center rounded-full text-muted transition-colors group-hover/titulo:bg-tint group-hover/titulo:text-ink"
            >
              <ChevronDown className={`size-[18px] transition-transform duration-300 ${aberto ? "rotate-180" : ""}`} />
            </span>
          </button>
        </h3>
        {escolhido && limpar && (
          <Link
            href={limpar}
            scroll={false}
            aria-label={`Limpar filtro de ${nome.toLowerCase()}`}
            className="inline-flex min-h-11 shrink-0 items-center px-1 text-[13px] font-bold text-muted hover:text-brand hover:underline"
          >
            Limpar
          </Link>
        )}
      </div>

      <div id={id} className="filtro-corpo" inert={!aberto}>
        {/* `relative` prende aqui dentro os textos só para leitor de tela (position: absolute),
            senão eles continuam ocupando rolagem no painel mesmo com o bloco fechado. */}
        {/* A folga de 4 px (margem negativa + padding) evita cortar o anel dos botões nas bordas. */}
        <div className="relative -mx-1 -mt-1 overflow-hidden">
          <div className="px-1 pt-1 pb-5">{children}</div>
        </div>
      </div>
    </section>
  );
}
