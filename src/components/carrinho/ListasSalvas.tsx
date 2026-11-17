"use client";

import Link from "next/link";
import { ArrowRight, ListChecks, Trash2 } from "lucide-react";
import { useState } from "react";
import { totalDoCarrinho, unidadesNoCarrinho } from "@/lib/carrinho";
import { evento } from "@/lib/eventos";
import { formatarPreco } from "@/lib/formato";
import { apagarLista, colocarListaNoCarrinho, useListas } from "@/lib/listas";

const data = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" });

/**
 * Listas de compra recorrente: "Repetir pedido" devolve tudo ao carrinho (com os preços de hoje) e
 * "Pedir orçamento" leva a lista para o formulário. Para empresas que compram sempre as mesmas coisas.
 */
export function ListasSalvas() {
  const listas = useListas();
  const [repetida, setRepetida] = useState<string | null>(null);

  if (listas.length === 0) return null;

  return (
    <section aria-labelledby="listas-titulo" className="erro-campo mt-8 lg:mt-10">
      <h2 id="listas-titulo" className="flex items-center gap-2 text-h3 text-ink lg:text-[22px] lg:leading-7">
        <ListChecks aria-hidden className="size-5 text-brand" />
        Suas listas de compra
      </h2>
      <p className="mt-1 text-small text-muted">Para repetir o pedido sem escolher tudo de novo.</p>

      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {listas.map((l) => (
          <li key={l.id} className="flex flex-col rounded-card bg-white p-4 ring-1 ring-line">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-body font-bold text-ink">{l.nome}</p>
                <p className="text-small text-muted">
                  {unidadesNoCarrinho(l.itens)} {unidadesNoCarrinho(l.itens) === 1 ? "unidade" : "unidades"} · {l.itens.length}{" "}
                  {l.itens.length === 1 ? "produto" : "produtos"} · {data.format(new Date(l.criadaEm))}
                </p>
              </div>
              <button
                type="button"
                onClick={() => apagarLista(l.id)}
                aria-label={`Apagar a lista ${l.nome}`}
                className="grid size-11 shrink-0 place-items-center rounded-btn text-muted transition-colors hover:bg-tint hover:text-red-700"
              >
                <Trash2 aria-hidden className="size-4" />
              </button>
            </div>
            <p className="mt-2 text-small text-muted">Valor quando foi salva: {formatarPreco(totalDoCarrinho(l.itens))}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  colocarListaNoCarrinho(l.id);
                  evento("usar_lista", { itens: l.itens.length }, true);
                  setRepetida(l.id);
                  window.setTimeout(() => setRepetida(null), 2500);
                }}
                className="inline-flex min-h-11 items-center rounded-btn bg-brand px-4 text-[14px] font-bold text-white transition-[background-color,transform] hover:bg-[#263b73] active:scale-[0.98]"
              >
                {repetida === l.id ? "Itens no carrinho" : "Repetir pedido"}
              </button>
              <Link
                href={`/orcamento?lista=${l.id}#orcamento`}
                className="group inline-flex min-h-11 items-center gap-1.5 rounded-btn border border-line px-4 text-[14px] font-bold text-ink transition-colors hover:border-brand hover:text-brand"
              >
                Pedir orçamento
                <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
