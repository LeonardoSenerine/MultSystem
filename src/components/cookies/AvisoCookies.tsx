"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import {
  fecharPreferenciasCookies,
  salvarEscolhaCookies,
  useEscolhaCookies,
  usePedidoCookies,
} from "@/lib/cookies";
import { useHidratado } from "@/lib/loja-local";

/**
 * Aviso de cookies (LGPD). Aparece na primeira visita e quando o visitante abre "Preferências de
 * cookies" no rodapé. Três saídas: aceitar tudo, ficar só com os necessários ou escolher.
 * Os necessários (carrinho, favoritos e contato salvo no navegador) não são opcionais.
 */
export function AvisoCookies() {
  const hidratado = useHidratado();
  const escolha = useEscolhaCookies();
  const { aberto: reaberto } = usePedidoCookies();
  const [detalhes, setDetalhes] = useState(false);
  const [estatisticas, setEstatisticas] = useState(false);
  const id = useId();

  // Na primeira visita o aviso espera alguns segundos: a pessoa vê a página e os botões principais antes.
  const [pronto, setPronto] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setPronto(true), 2500);
    return () => window.clearTimeout(t);
  }, []);

  const visivel = hidratado && (reaberto || (escolha === null && pronto));

  // Ao reabrir, os botões já mostram o que está salvo.
  const abrirDetalhes = () => {
    setEstatisticas(escolha?.analytics ?? false);
    setDetalhes(true);
  };

  return (
    <div
      role="dialog"
      aria-labelledby={`${id}-titulo`}
      aria-describedby={`${id}-texto`}
      data-aberto={visivel}
      inert={!visivel}
      className="cookie-aviso cookie-direita fixed inset-x-3 bottom-3 z-[55] rounded-card bg-white p-4 shadow-[0_12px_40px_rgb(28_47_92/0.22)] ring-1 ring-line sm:right-auto sm:bottom-4 sm:left-4 sm:max-w-[420px] lg:bottom-6"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <p id={`${id}-titulo`} className="sr-only">
        Cookies e privacidade
      </p>
      <p id={`${id}-texto`} className="text-[13px] leading-[18px] text-muted">
        <strong className="text-ink">Cookies:</strong> usamos os necessários para o carrinho e os favoritos funcionarem e, se você deixar,
        estatísticas. Veja a{" "}
        <Link href="/privacidade" className="font-bold text-brand hover:underline">
          Privacidade
        </Link>{" "}
        e os{" "}
        <Link href="/cookies" className="font-bold text-brand hover:underline">
          Cookies
        </Link>
        .
      </p>

      {detalhes && (
        <div className="erro-campo mt-4 divide-y divide-line rounded-btn border border-line">
          <div className="flex items-center justify-between gap-4 p-3">
            <div>
              <p className="text-small font-bold text-ink">Necessários</p>
              <p className="text-[13px] leading-[18px] text-muted">Carrinho, favoritos, contato salvo e esta escolha.</p>
            </div>
            <span className="shrink-0 rounded-full bg-tint px-2.5 py-1 text-[12px] leading-4 font-bold text-muted">Sempre ativos</span>
          </div>
          <label className="flex cursor-pointer items-center justify-between gap-4 p-3">
            <span>
              <span className="block text-small font-bold text-ink">Estatísticas</span>
              <span className="block text-[13px] leading-[18px] text-muted">Quantas pessoas visitam cada página (Google Analytics).</span>
            </span>
            <input
              type="checkbox"
              role="switch"
              checked={estatisticas}
              onChange={(e) => setEstatisticas(e.target.checked)}
              className="peer sr-only"
            />
            <span
              aria-hidden
              className="relative h-7 w-12 shrink-0 rounded-full bg-[#b9c3dc] transition-colors duration-200 after:absolute after:top-1 after:left-1 after:size-5 after:rounded-full after:bg-white after:shadow-sm after:transition-transform after:duration-200 peer-checked:bg-brand peer-checked:after:translate-x-5 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand"
            />
          </label>
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {detalhes ? (
          <button
            type="button"
            onClick={() => salvarEscolhaCookies(estatisticas)}
            className="inline-flex min-h-11 items-center justify-center rounded-btn bg-brand px-4 text-[13px] font-bold text-white transition-[background-color,transform] hover:bg-[#263b73] active:scale-[0.98]"
          >
            Salvar minha escolha
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => salvarEscolhaCookies(true)}
              className="inline-flex min-h-11 items-center justify-center rounded-btn bg-brand px-4 text-[13px] font-bold text-white transition-[background-color,transform] hover:bg-[#263b73] active:scale-[0.98]"
            >
              Aceitar todos
            </button>
            <button
              type="button"
              onClick={() => salvarEscolhaCookies(false)}
              className="inline-flex min-h-11 items-center justify-center rounded-btn border border-line px-4 text-[13px] font-bold text-ink transition-[border-color,color,transform] hover:border-brand hover:text-brand active:scale-[0.98]"
            >
              Só os necessários
            </button>
            <button
              type="button"
              onClick={abrirDetalhes}
              className="inline-flex min-h-11 items-center justify-center px-2 text-[13px] font-bold text-brand hover:underline"
            >
              Escolher
            </button>
          </>
        )}
        {/* Reaberto pelo rodapé: dá para fechar sem mudar a escolha. */}
        {escolha !== null && (
          <button
            type="button"
            onClick={() => {
              setDetalhes(false);
              fecharPreferenciasCookies();
            }}
            className="inline-flex min-h-11 items-center justify-center px-2 text-[13px] font-bold text-muted hover:text-ink"
          >
            Fechar
          </button>
        )}
      </div>
    </div>
  );
}

