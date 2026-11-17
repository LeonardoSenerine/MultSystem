"use client";

/*
 * Listas de compra recorrente (para empresas): o cliente salva o carrinho com um nome
 * ("Toner do escritório") e depois repete o pedido com um clique ou pede orçamento da lista.
 * Ficam no navegador, como o carrinho. Preços e estoque são atualizados quando a lista volta
 * para o carrinho.
 */
import { colocarNoCarrinho, itensDoCarrinho, type ItemCarrinho } from "@/lib/carrinho";
import { criarLoja } from "@/lib/loja-local";

export type Lista = { id: string; nome: string; criadaEm: string; itens: ItemCarrinho[] };

const VAZIO: Lista[] = [];
const MAXIMO = 10;

const loja = criarLoja<Lista[]>("multsystems:listas:v1", VAZIO, (bruto) =>
  Array.isArray(bruto) ? bruto.filter((l) => l && typeof l.id === "string" && Array.isArray(l.itens)) : VAZIO,
);

export const useListas = loja.usar;
export const listaPorId = (id: string) => loja.atual().find((l) => l.id === id);

/** Guarda o carrinho de agora como uma lista. Devolve false se o carrinho está vazio. */
export function salvarListaDoCarrinho(nome: string) {
  const itens = itensDoCarrinho();
  if (itens.length === 0) return false;
  const lista: Lista = {
    id: `l${Date.now().toString(36)}`,
    nome: nome.trim().slice(0, 60) || "Minha lista",
    criadaEm: new Date().toISOString(),
    itens,
  };
  loja.salvar([lista, ...loja.atual()].slice(0, MAXIMO));
  return true;
}

export function apagarLista(id: string) {
  loja.salvar(loja.atual().filter((l) => l.id !== id));
}

/** Repete o pedido: põe todos os itens da lista no carrinho (somando ao que já está lá). */
export function colocarListaNoCarrinho(id: string) {
  const lista = listaPorId(id);
  if (!lista) return;
  for (const { quantidade, ...produto } of lista.itens) colocarNoCarrinho(produto, quantidade);
}
