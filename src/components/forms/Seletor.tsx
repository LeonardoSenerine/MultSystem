"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { classeCampo } from "@/components/forms/campos";

export type OpcaoSeletor = { valor: string; rotulo: string };

/**
 * Campo que abre uma lista de opções e guarda só um resumo da escolha dentro do botão (no lugar de mostrar
 * todas as opções de uma vez). `multiplo` deixa marcar várias; sem ele, escolher uma já fecha a lista.
 * Usa radios/checkboxes de verdade dentro da lista, então teclado (Tab, setas, espaço) e leitor de tela funcionam.
 */
export function Seletor({
  rotulo,
  extra,
  opcoes,
  valor,
  aoMudar,
  multiplo = false,
  vazio,
  nome,
  erro,
  idErro,
}: {
  rotulo: string;
  /** Texto pequeno à direita do rótulo (ex.: "opcional"). */
  extra?: ReactNode;
  opcoes: OpcaoSeletor[];
  valor: string[];
  aoMudar: (valores: string[]) => void;
  multiplo?: boolean;
  /** Texto do botão quando nada foi escolhido. */
  vazio: string;
  /** Atributo `name` do botão: é por ele que o formulário devolve o foco quando há erro. */
  nome?: string;
  erro?: string;
  idErro?: string;
}) {
  const id = useId();
  const [aberto, setAberto] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);
  const botao = useRef<HTMLButtonElement>(null);

  // Fecha ao clicar/tocar fora, com Esc (devolvendo o foco ao botão) ou quando o foco sai do campo.
  useEffect(() => {
    if (!aberto) return;
    const fora = (e: PointerEvent) => {
      if (!raiz.current?.contains(e.target as Node)) setAberto(false);
    };
    const tecla = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setAberto(false);
      botao.current?.focus();
    };
    document.addEventListener("pointerdown", fora);
    document.addEventListener("keydown", tecla);
    return () => {
      document.removeEventListener("pointerdown", fora);
      document.removeEventListener("keydown", tecla);
    };
  }, [aberto]);

  const escolhidas = opcoes.filter((o) => valor.includes(o.valor));
  const resumo =
    escolhidas.length === 0 ? null : multiplo && escolhidas.length > 1 ? `${escolhidas.length} assuntos escolhidos` : escolhidas[0].rotulo;

  const alternar = (v: string) => {
    if (!multiplo) {
      aoMudar([v]);
      setAberto(false);
      botao.current?.focus();
      return;
    }
    aoMudar(valor.includes(v) ? valor.filter((x) => x !== v) : [...valor, v]);
  };

  return (
    <div
      ref={raiz}
      className="relative"
      onBlur={(e) => {
        // Tab para fora do campo fecha a lista (relatedTarget nulo = clique, que o "pointerdown" já trata).
        if (e.relatedTarget && !raiz.current?.contains(e.relatedTarget as Node)) setAberto(false);
      }}
    >
      <div className="mb-2 flex w-full items-baseline justify-between text-small font-semibold text-ink">
        <span id={`${id}-rotulo`}>{rotulo}</span>
        {extra && <span className="text-[12px] leading-4 font-medium text-muted">{extra}</span>}
      </div>

      <button
        ref={botao}
        type="button"
        name={nome}
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        aria-controls={`${id}-lista`}
        aria-labelledby={`${id}-rotulo ${id}-valor`}
        aria-describedby={erro ? idErro : undefined}
        className={`${classeCampo} flex h-12 cursor-pointer items-center justify-between gap-3 text-left ${erro ? "border-red-600 bg-red-50/40" : ""}`}
      >
        <span id={`${id}-valor`} className={`min-w-0 truncate ${resumo ? "font-semibold text-ink" : "text-[#7d89a6]"}`}>
          {resumo ?? vazio}
        </span>
        <ChevronDown aria-hidden className={`size-5 shrink-0 text-muted transition-transform duration-200 ${aberto ? "rotate-180" : ""}`} />
      </button>

      {aberto && (
        <div
          id={`${id}-lista`}
          role="group"
          aria-labelledby={`${id}-rotulo`}
          className="absolute inset-x-0 top-full z-30 mt-1.5 overflow-hidden rounded-btn border border-[#cfd8ec] bg-white text-ink shadow-[0_12px_32px_rgb(28_47_92/0.18)]"
        >
          <ul className="max-h-[17.5rem] overflow-y-auto overscroll-contain p-1.5">
            {opcoes.map((o) => {
              const marcado = valor.includes(o.valor);
              return (
                <li key={o.valor}>
                  <label className="cursor-pointer">
                    <input
                      type={multiplo ? "checkbox" : "radio"}
                      name={multiplo ? undefined : `${id}-opcao`}
                      checked={marcado}
                      onChange={() => alternar(o.valor)}
                      className="peer sr-only"
                    />
                    <span className="flex min-h-11 items-center justify-between gap-3 rounded-[10px] px-3 text-[14px] font-semibold select-none hover:bg-tint peer-checked:text-brand peer-focus-visible:outline-2 peer-focus-visible:-outline-offset-2 peer-focus-visible:outline-brand">
                      {o.rotulo}
                      {marcado && <Check aria-hidden className="size-4 shrink-0 text-brand" strokeWidth={3} />}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>

          {multiplo && (
            <div className="flex items-center justify-between gap-3 border-t border-line bg-white px-3 py-1.5">
              <button
                type="button"
                onClick={() => aoMudar([])}
                disabled={valor.length === 0}
                className="min-h-11 text-[13px] font-bold text-muted hover:text-brand disabled:pointer-events-none disabled:opacity-40"
              >
                Limpar
              </button>
              <button
                type="button"
                onClick={() => {
                  setAberto(false);
                  botao.current?.focus();
                }}
                className="min-h-11 rounded-btn px-4 text-[13px] font-bold text-brand hover:underline"
              >
                Pronto
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
