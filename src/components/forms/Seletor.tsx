"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { classeCampo } from "@/components/forms/campos";

export type OpcaoSeletor = { valor: string; rotulo: string };

/**
 * Campo que abre uma lista de opções e guarda só um resumo da escolha dentro do botão (no lugar de mostrar
 * todas as opções de uma vez). `multiplo` deixa marcar várias; sem ele, escolher uma já fecha a lista.
 *
 * A lista FLUTUA por cima do conteúdo (não empurra nem estica o formulário). Ao abrir, mede o espaço livre na
 * janela: abre para baixo se couber e, se não couber, para cima; a altura máxima é limitada ao espaço que sobra,
 * então a lista nunca fica cortada pela borda da tela.
 * Ao abrir, as opções já escolhidas sobem para o topo (com fundo destacado e uma linha separando das outras).
 * A ordem é fixada na hora de abrir, para os itens não pularem de lugar debaixo do dedo enquanto a pessoa marca.
 * Usa radios/checkboxes de verdade, então teclado (Tab, setas, espaço) e leitor de tela funcionam.
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
  // Ordem da lista, montada ao abrir: escolhidas primeiro (na ordem original), depois as demais.
  const [ordem, setOrdem] = useState<OpcaoSeletor[]>(opcoes);
  const [qtdNoTopo, setQtdNoTopo] = useState(0);
  // Para onde a lista abre e quanto ela pode crescer (em px), calculado na hora de abrir.
  const [posicao, setPosicao] = useState<{ paraCima: boolean; altura: number }>({ paraCima: false, altura: 280 });
  const raiz = useRef<HTMLDivElement>(null);
  const botao = useRef<HTMLButtonElement>(null);

  // Fecha ao clicar/tocar fora ou com Esc (devolvendo o foco ao botão).
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

  const abrirOuFechar = () => {
    if (!aberto) {
      const escolhidas = opcoes.filter((o) => valor.includes(o.valor));
      setOrdem([...escolhidas, ...opcoes.filter((o) => !valor.includes(o.valor))]);
      setQtdNoTopo(escolhidas.length);
      // Espaço livre abaixo e acima do botão (descontando o cabeçalho fixo, ~80 px, e uma folga de 12 px).
      const r = botao.current?.getBoundingClientRect();
      if (r) {
        const rodape = multiplo ? 52 : 0; // barra "Limpar / Pronto"
        const ideal = Math.min(280, opcoes.length * 46 + 12) + rodape;
        const abaixo = window.innerHeight - r.bottom - 12;
        const acima = r.top - 80 - 12;
        const paraCima = abaixo < Math.min(ideal, 240) && acima > abaixo;
        const livre = paraCima ? acima : abaixo;
        setPosicao({ paraCima, altura: Math.max(160, Math.min(280, livre - rodape)) });
      }
    }
    setAberto((v) => !v);
  };

  const escolhidas = opcoes.filter((o) => valor.includes(o.valor));
  const resumo = escolhidas.length === 0 ? null : escolhidas.map((o) => o.rotulo).join(", ");

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
      className="min-w-0"
      onBlur={(e) => {
        // Tab para fora do campo fecha a lista (relatedTarget nulo = clique, que o "pointerdown" já trata).
        if (e.relatedTarget && !raiz.current?.contains(e.relatedTarget as Node)) setAberto(false);
      }}
    >
      <div className="mb-2 flex w-full items-baseline justify-between gap-3 text-small font-semibold text-ink">
        <span id={`${id}-rotulo`}>{rotulo}</span>
        {extra && <span className="shrink-0 text-[12px] leading-4 font-medium text-muted">{extra}</span>}
      </div>

      {/* Âncora da lista: só o botão, para ela abrir colada nele (para baixo ou para cima). */}
      <div className="relative min-w-0">
      <button
        ref={botao}
        type="button"
        name={nome}
        onClick={abrirOuFechar}
        aria-expanded={aberto}
        aria-controls={`${id}-lista`}
        aria-labelledby={`${id}-rotulo ${id}-valor`}
        aria-describedby={erro ? idErro : undefined}
        // Grade com a 1ª coluna minmax(0,1fr): o texto (que não quebra linha) não "empurra" a largura mínima do
        // formulário. Com flex, numa tela estreita ele esticava a seção e criava rolagem lateral.
        className={`${classeCampo} grid h-12 min-w-0 cursor-pointer grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 text-left ${erro ? "border-red-600 bg-red-50/40" : ""} ${aberto ? "border-brand" : ""}`}
      >
        <span id={`${id}-valor`} className={`truncate ${resumo ? "font-semibold text-ink" : "text-[#7d89a6]"}`}>
          {resumo ?? vazio}
        </span>
        {multiplo && escolhidas.length > 1 && (
          <span className="grid h-6 min-w-6 shrink-0 place-items-center rounded-full bg-brand px-1.5 text-[12px] leading-none font-bold text-white tabular-nums">
            {escolhidas.length}
            <span className="sr-only"> escolhidos</span>
          </span>
        )}
        <ChevronDown aria-hidden className={`size-5 shrink-0 text-muted transition-transform duration-200 ${aberto ? "rotate-180" : ""}`} />
      </button>

      {aberto && (
        <div
          id={`${id}-lista`}
          role="group"
          aria-labelledby={`${id}-rotulo`}
          className={`absolute inset-x-0 z-40 overflow-hidden rounded-btn border border-[#cfd8ec] bg-white text-ink shadow-[0_16px_40px_rgb(28_47_92/0.22)] ${
            posicao.paraCima ? "bottom-full mb-1.5" : "top-full mt-1.5"
          }`}
        >
          <ul style={{ maxHeight: posicao.altura }} className="overflow-y-auto overscroll-contain p-1.5">
            {ordem.map((o, i) => {
              const marcado = valor.includes(o.valor);
              // Linha fina entre o grupo das escolhidas (no topo) e o resto da lista.
              const fimDoTopo = qtdNoTopo > 0 && i === qtdNoTopo - 1 && qtdNoTopo < ordem.length;
              return (
                <li key={o.valor} className={fimDoTopo ? "mb-1.5 border-b border-line pb-1.5" : "[&+li]:mt-0.5"}>
                  <label className="block cursor-pointer">
                    <input
                      type={multiplo ? "checkbox" : "radio"}
                      name={multiplo ? undefined : `${id}-opcao`}
                      checked={marcado}
                      onChange={() => alternar(o.valor)}
                      className="peer sr-only"
                    />
                    <span
                      className={`flex min-h-11 items-center gap-3 rounded-[10px] px-3 py-2 text-[14px] leading-5 select-none peer-focus-visible:outline-2 peer-focus-visible:-outline-offset-2 peer-focus-visible:outline-brand ${
                        marcado ? "bg-brand/[0.08] font-bold text-brand" : "font-medium text-ink hover:bg-tint"
                      }`}
                    >
                      {multiplo && (
                        <span
                          aria-hidden
                          className={`grid size-5 shrink-0 place-items-center rounded-[6px] border-[1.5px] ${
                            marcado ? "border-brand bg-brand text-white" : "border-[#b9c3dc] bg-white"
                          }`}
                        >
                          {marcado && <Check className="size-3.5" strokeWidth={3} />}
                        </span>
                      )}
                      <span className="min-w-0 flex-1">{o.rotulo}</span>
                      {!multiplo && marcado && <Check aria-hidden className="size-4 shrink-0" strokeWidth={3} />}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>

          {multiplo && (
            <div className="flex items-center justify-between gap-3 border-t border-line bg-white px-3 py-1">
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
    </div>
  );
}
