"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoaderCircle, Search } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { FotoProduto } from "@/components/catalogo/FotoProduto";
import { evento } from "@/lib/eventos";
import { formatarPreco, quebravel } from "@/lib/formato";
import type { ResultadoBusca } from "@/types";

type Resposta = { consulta: string; total: number; itens: ResultadoBusca[] };

/**
 * Campo de busca com sugestões ao vivo: a partir de 2 letras, os produtos aparecem logo abaixo
 * enquanto a pessoa digita (foto, nome, categoria e preço). Setas navegam, Enter abre o produto
 * escolhido (ou vai para todos os resultados), Esc fecha. Sem JavaScript continua sendo um
 * formulário comum que leva a /produtos?q=...
 */
export function BuscaComSugestoes({
  id,
  fundoBranco = false,
  placeholder = "Buscar produtos por nome, marca ou código",
}: {
  id: string;
  /** Campo com fundo branco (páginas de erro); por padrão tem o fundo azul-claro do topo. */
  fundoBranco?: boolean;
  placeholder?: string;
}) {
  const router = useRouter();
  const idLista = useId();
  const raiz = useRef<HTMLDivElement>(null);
  const [texto, setTexto] = useState("");
  const [resposta, setResposta] = useState<Resposta | null>(null);
  const [aberto, setAberto] = useState(false);
  const [ativo, setAtivo] = useState(-1);

  const consulta = texto.trim();
  const buscavel = consulta.length >= 2;
  // Mostra o resultado mais recente; enquanto chega o da consulta nova, o anterior continua na tela.
  const carregando = buscavel && resposta?.consulta !== consulta;
  const itens = buscavel && resposta ? resposta.itens : [];
  const mostrar = aberto && buscavel && resposta !== null;
  const opcoes = itens.length + 1; // os produtos mais "ver todos os resultados"

  // Busca com pequena espera: cada letra nova reinicia a contagem, e respostas antigas são descartadas.
  useEffect(() => {
    if (consulta.length < 2) return;
    const controle = new AbortController();
    const t = window.setTimeout(() => {
      fetch(`/api/busca?q=${encodeURIComponent(consulta)}`, { signal: controle.signal })
        .then((r) => (r.ok ? (r.json() as Promise<{ total: number; itens: ResultadoBusca[] }>) : { total: 0, itens: [] }))
        .then((d) => {
          setResposta({ consulta, total: d.total, itens: d.itens });
          setAtivo(-1);
        })
        .catch(() => {});
    }, 180);
    return () => {
      window.clearTimeout(t);
      controle.abort();
    };
  }, [consulta]);

  // Clicar fora fecha a lista.
  useEffect(() => {
    const fora = (e: PointerEvent) => {
      if (raiz.current && !raiz.current.contains(e.target as Node)) setAberto(false);
    };
    document.addEventListener("pointerdown", fora);
    return () => document.removeEventListener("pointerdown", fora);
  }, []);

  function aoTeclar(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setAberto(false);
      setAtivo(-1);
      return;
    }
    if (!mostrar) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setAtivo((a) => (a + 1) % opcoes);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setAtivo((a) => (a <= 0 ? opcoes - 1 : a - 1));
    } else if (e.key === "Enter" && ativo >= 0 && ativo < itens.length) {
      e.preventDefault();
      escolher(itens[ativo]);
    }
  }

  function escolher(item: ResultadoBusca) {
    evento("busca_sugestao", { termo: consulta.slice(0, 80), codigo: item.codigo });
    setAberto(false);
    router.push(`/produto/${item.slug}`);
  }

  const urlTodos = `/produtos?q=${encodeURIComponent(consulta)}`;

  return (
    <div ref={raiz} className="relative">
      <form
        action="/produtos"
        role="search"
        className="group/busca relative w-full"
        onSubmit={() => {
          if (consulta) evento("busca", { termo: consulta.slice(0, 80), origem: "topo" });
          setAberto(false);
        }}
      >
        <label htmlFor={id} className="sr-only">
          Buscar produtos
        </label>
        <span aria-hidden className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted transition-colors group-focus-within/busca:text-brand">
          {carregando ? <LoaderCircle className="size-5 animate-spin text-brand" /> : <Search className="size-5" />}
        </span>
        <input
          id={id}
          name="q"
          type="search"
          role="combobox"
          aria-expanded={mostrar}
          aria-controls={idLista}
          aria-autocomplete="list"
          aria-activedescendant={mostrar && ativo >= 0 ? `${idLista}-${ativo}` : undefined}
          enterKeyHint="search"
          autoComplete="off"
          value={texto}
          onChange={(e) => {
            setTexto(e.target.value);
            setAberto(true);
          }}
          onFocus={() => setAberto(true)}
          onKeyDown={aoTeclar}
          placeholder={placeholder}
          className={`h-12 w-full rounded-full border-[1.5px] border-[#cfd8ec] pr-28 pl-12 text-[15px] text-ink transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-[#7d89a6] hover:border-[#9fb0d6] focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/12 focus:outline-none [&::-webkit-search-cancel-button]:hidden ${
            fundoBranco ? "bg-white" : "bg-tint/50"
          }`}
        />
        <button
          type="submit"
          className="absolute top-1/2 right-1.5 inline-flex h-9 -translate-y-1/2 items-center rounded-full bg-brand px-4 text-[14px] font-bold text-white transition-[background-color,transform] hover:bg-[#263b73] active:scale-95"
        >
          Buscar
        </button>
      </form>

      {mostrar && (
        <div className="sugestoes-busca absolute top-full right-0 left-0 z-40 mt-2 overflow-hidden rounded-card bg-white shadow-[0_16px_48px_rgb(28_47_92/0.2)] ring-1 ring-line">
          {itens.length > 0 ? (
            <>
              <ul id={idLista} role="listbox" aria-label="Produtos encontrados" className="max-h-[min(60vh,440px)] divide-y divide-line/70 overflow-y-auto overscroll-contain">
                {itens.map((p, i) => (
                  <li key={p.codigo} id={`${idLista}-${i}`} role="option" aria-selected={ativo === i}>
                    <Link
                      href={`/produto/${p.slug}`}
                      onClick={() => {
                        evento("busca_sugestao", { termo: consulta.slice(0, 80), codigo: p.codigo });
                        setAberto(false);
                      }}
                      className={`flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-tint ${ativo === i ? "bg-tint" : ""}`}
                    >
                      <span className="relative size-14 shrink-0 overflow-hidden rounded-btn bg-white ring-1 ring-line">
                        <FotoProduto src={p.imagem} alt="" temFoto={Boolean(p.imagem)} compacto sizes="56px" className="p-1.5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="line-clamp-2 block text-[14px] leading-5 font-semibold text-ink">{quebravel(p.nome)}</span>
                        {p.categoria && <span className="block truncate text-[12px] leading-4 text-muted">{p.categoria}</span>}
                      </span>
                      <span className="shrink-0 text-right text-[14px] leading-5 font-extrabold text-ink tabular-nums">{formatarPreco(p.preco)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={urlTodos}
                id={`${idLista}-${itens.length}`}
                onClick={() => setAberto(false)}
                className={`flex min-h-12 items-center justify-between gap-3 border-t border-line px-4 text-[14px] font-bold text-brand transition-colors hover:bg-tint ${ativo === itens.length ? "bg-tint" : ""}`}
              >
                <span className="min-w-0 [overflow-wrap:anywhere]">
                  Ver {resposta && resposta.total > itens.length ? `os ${resposta.total.toLocaleString("pt-BR")} resultados` : "todos os resultados"} para “{consulta}”
                </span>
                <span aria-hidden>→</span>
              </Link>
            </>
          ) : (
            <div id={idLista} role="listbox" aria-label="Nenhum produto encontrado" className="px-4 py-5">
              <p className="text-body font-bold [overflow-wrap:anywhere] text-ink">Nenhum produto para “{consulta}”.</p>
              <p className="mt-1 text-small text-muted">Confira a escrita ou peça por encomenda: a gente procura o produto para você.</p>
              <Link
                href={`/orcamento?encomenda=${encodeURIComponent(consulta)}#orcamento`}
                onClick={() => setAberto(false)}
                className="mt-3 inline-flex min-h-11 items-center rounded-btn bg-brand px-4 text-[14px] font-bold text-white transition-[background-color,transform] hover:bg-[#263b73] active:scale-[0.98]"
              >
                Pedir por encomenda
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
