"use client";

import { LoaderCircle, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { evento } from "@/lib/eventos";
import { useEffect, useRef, useState, useTransition } from "react";

/**
 * Busca do catálogo, junto dos produtos. Filtra enquanto digita (com uma pequena espera) e
 * mantém os outros filtros: dá para buscar "wifi" dentro de Redes, só Intelbras, até R$ 200.
 * `base` é a URL atual sem o `q` e sem a página; `local` é o nome do lugar ("em Redes e Wi-Fi").
 */
export function BuscaCatalogo({ valor, base, local }: { valor: string; base: string; local?: string }) {
  const router = useRouter();
  const [texto, setTexto] = useState(valor);
  const [buscando, iniciar] = useTransition();
  const campo = useRef<HTMLInputElement>(null);
  const ultimo = useRef(valor);

  // Veio de outra página (lupa do topo, link "#buscar"): já põe o cursor na busca.
  useEffect(() => {
    const focar = () => window.location.hash === "#buscar" && campo.current?.focus();
    focar();
    window.addEventListener("hashchange", focar);
    return () => window.removeEventListener("hashchange", focar);
  }, []);

  // A URL mudou por fora (limpar filtros, voltar do navegador): acompanha.
  useEffect(() => {
    if (valor !== ultimo.current) {
      ultimo.current = valor;
      setTexto(valor);
    }
  }, [valor]);

  const ir = (q: string) => {
    const termo = q.trim();
    if (termo === ultimo.current) return;
    ultimo.current = termo;
    if (termo) evento("busca", { termo: termo.slice(0, 80), origem: "catalogo" });
    const url = new URL(base, window.location.origin);
    if (termo) url.searchParams.set("q", termo);
    iniciar(() => router.replace(url.pathname + url.search, { scroll: false }));
  };

  useEffect(() => {
    const t = window.setTimeout(() => {
      if (texto.trim().length === 0 || texto.trim().length >= 2) ir(texto);
    }, 350);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texto]);

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        ir(texto);
        campo.current?.blur();
      }}
      className="relative w-full"
    >
      <label htmlFor="busca-catalogo" className="sr-only">
        Buscar produtos{local ? ` ${local}` : ""}
      </label>
      <span aria-hidden className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted">
        {buscando ? <LoaderCircle className="size-5 animate-spin text-brand" /> : <Search className="size-5" />}
      </span>
      <input
        ref={campo}
        id="busca-catalogo"
        type="search"
        enterKeyHint="search"
        autoComplete="off"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder={local ? `Buscar ${local}` : "Buscar por nome, marca ou código"}
        className="h-12 w-full rounded-btn border-[1.5px] border-[#cfd8ec] bg-white pr-12 pl-12 text-body text-ink shadow-[0_1px_2px_rgb(28_47_92/0.04)] transition-[border-color,box-shadow] duration-200 placeholder:text-[#7d89a6] hover:border-[#9fb0d6] focus:border-brand focus:ring-4 focus:ring-brand/12 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
      />
      {texto && (
        <button
          type="button"
          aria-label="Limpar busca"
          onClick={() => {
            setTexto("");
            ir("");
            campo.current?.focus();
          }}
          className="absolute top-1/2 right-0.5 grid size-11 -translate-y-1/2 place-items-center rounded-btn text-muted hover:text-ink"
        >
          <X aria-hidden className="size-5" />
        </button>
      )}
    </form>
  );
}
