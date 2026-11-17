"use client";

import Link from "next/link";
import { Check, Search } from "lucide-react";
import { useId, useState } from "react";
import { normalizar } from "@/lib/formato";

export type OpcaoMarca = { slug: string; nome: string; quantidade: number; href: string; marcada: boolean };

const VISIVEIS = 6;

/** Lista de marcas com caixinhas, busca dentro da lista e "ver todas". */
export function ListaMarcas({ opcoes, prefixo }: { opcoes: OpcaoMarca[]; prefixo: string }) {
  const [busca, setBusca] = useState("");
  const [todas, setTodas] = useState(false);
  const id = `${prefixo}-${useId()}-marca`;

  const termo = normalizar(busca.trim());
  const filtradas = termo ? opcoes.filter((o) => normalizar(o.nome).includes(termo)) : opcoes;
  // Marcadas sempre no topo; o resto por quantidade.
  const ordenadas = [...filtradas.filter((o) => o.marcada), ...filtradas.filter((o) => !o.marcada)];
  const mostradas = todas || termo ? ordenadas : ordenadas.slice(0, Math.max(VISIVEIS, opcoes.filter((o) => o.marcada).length));

  return (
    <div>
      {opcoes.length > VISIVEIS && (
        <div className="relative mb-2">
          <label htmlFor={id} className="sr-only">
            Buscar marca
          </label>
          <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
          <input
            id={id}
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar marca"
            autoComplete="off"
            className="h-11 w-full rounded-btn border-[1.5px] border-[#cfd8ec] bg-tint/60 pr-3 pl-9 text-[14px] text-ink transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-[#7d89a6] hover:border-[#9fb0d6] focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/12 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
        </div>
      )}

      <ul className={todas && !termo ? "max-h-72 overflow-y-auto overscroll-contain pr-1 [scrollbar-width:thin]" : ""}>
        {mostradas.map((o) => (
          <li key={o.slug} className="chip-entra">
            <Link
              href={o.href}
              scroll={false}
              aria-current={o.marcada || undefined}
              className="group/opcao flex min-h-11 items-center justify-between gap-3 rounded-[10px] px-2 text-[14px] text-ink/85 transition-[background-color,color,transform] duration-200 hover:bg-tint hover:text-ink active:scale-[0.98]"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span
                  aria-hidden
                  className={`grid size-5 shrink-0 place-items-center rounded-[6px] border-[1.5px] transition-[background-color,border-color,box-shadow] duration-200 ${
                    o.marcada
                      ? "border-brand bg-brand text-white shadow-[0_0_0_3px_rgb(46_70_134/0.14)]"
                      : "border-[#b9c3dc] bg-white group-hover/opcao:border-brand"
                  }`}
                >
                  <Check
                    className={`size-3.5 transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                      o.marcada ? "scale-100 rotate-0 opacity-100" : "scale-50 -rotate-12 opacity-0"
                    }`}
                    strokeWidth={3}
                  />
                </span>
                <span className={`truncate transition-colors ${o.marcada ? "font-bold text-ink" : ""}`}>{o.nome}</span>
              </span>
              <span className="shrink-0 text-[13px] text-muted tabular-nums">{o.quantidade}</span>
            </Link>
          </li>
        ))}
        {termo && mostradas.length === 0 && <li className="px-2 py-3 text-[14px] text-muted">Nenhuma marca com esse nome.</li>}
      </ul>

      {!termo && opcoes.length > VISIVEIS && (
        <button
          type="button"
          onClick={() => setTodas((t) => !t)}
          className="mt-1 inline-flex min-h-11 items-center px-2 text-[14px] font-bold text-brand hover:underline"
        >
          {todas ? "Mostrar menos" : `Ver todas as ${opcoes.length} marcas`}
        </button>
      )}
    </div>
  );
}
