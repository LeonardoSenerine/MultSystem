"use client";

import type { ProdutoResumo } from "@/lib/carrinho";
import { criarLoja } from "@/lib/loja-local";

/** Favorito: o produto e o preço do dia em que foi salvo, para mostrar se baixou ou subiu. */
export type Favorito = ProdutoResumo & { precoSalvo: number; salvoEm: string };

const VAZIO: Favorito[] = [];

const loja = criarLoja<Favorito[]>("multsystems:favoritos:v1", VAZIO, (bruto) =>
  Array.isArray(bruto) ? bruto.filter((f) => f && typeof f.codigo === "string") : VAZIO,
);

export function alternarFavorito(produto: ProdutoResumo) {
  const lista = loja.atual();
  loja.salvar(
    lista.some((f) => f.codigo === produto.codigo)
      ? lista.filter((f) => f.codigo !== produto.codigo)
      : [{ ...produto, precoSalvo: produto.preco, salvoEm: new Date().toISOString() }, ...lista],
  );
}

/** Esvazia a lista de favoritos de uma vez. */
export function limparFavoritos() {
  loja.salvar(VAZIO);
}

export function tirarDosFavoritos(codigo: string) {
  loja.salvar(loja.atual().filter((f) => f.codigo !== codigo));
}

/** Atualiza preço e estoque de agora, mantendo o preço salvo para a comparação. */
export function atualizarFavoritos(atuais: Map<string, { preco: number; estoque: number }>) {
  loja.salvar(loja.atual().map((f) => ({ ...f, ...(atuais.get(f.codigo) ?? {}) })));
}

export const useFavoritos = loja.usar;
