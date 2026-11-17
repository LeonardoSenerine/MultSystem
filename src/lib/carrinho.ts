"use client";

import { criarLoja } from "@/lib/loja-local";

/** Dados do produto que o carrinho e os favoritos guardam (o suficiente para desenhar o item). */
export type ProdutoResumo = {
  codigo: string;
  slug: string;
  nome: string;
  marca: string;
  imagem: string;
  temFoto: boolean;
  preco: number;
  estoque: number;
};

export type ItemCarrinho = ProdutoResumo & { quantidade: number };

const VAZIO: ItemCarrinho[] = [];

const loja = criarLoja<ItemCarrinho[]>("multsystems:carrinho:v1", VAZIO, (bruto) =>
  Array.isArray(bruto) ? bruto.filter((i) => i && typeof i.codigo === "string" && i.quantidade > 0) : VAZIO,
);

/** Quantidade entre 1 e o estoque (sem estoque informado, até 99). */
export function limitar(quantidade: number, estoque: number) {
  const maximo = estoque > 0 ? estoque : 99;
  return Math.min(maximo, Math.max(1, Math.floor(quantidade) || 1));
}

export function quantidadeNoCarrinho(codigo: string) {
  return loja.atual().find((i) => i.codigo === codigo)?.quantidade ?? 0;
}

export function colocarNoCarrinho(produto: ProdutoResumo, quantidade = 1) {
  const lista = loja.atual();
  const existente = lista.find((i) => i.codigo === produto.codigo);
  loja.salvar(
    existente
      ? lista.map((i) =>
          i.codigo === produto.codigo ? { ...i, ...produto, quantidade: limitar(i.quantidade + quantidade, produto.estoque) } : i,
        )
      : [...lista, { ...produto, quantidade: limitar(quantidade, produto.estoque) }],
  );
}

/** Muda a quantidade; zero tira o item do carrinho. */
export function mudarQuantidade(codigo: string, quantidade: number) {
  const lista = loja.atual();
  loja.salvar(
    quantidade <= 0
      ? lista.filter((i) => i.codigo !== codigo)
      : lista.map((i) => (i.codigo === codigo ? { ...i, quantidade: limitar(quantidade, i.estoque) } : i)),
  );
}

export function tirarDoCarrinho(codigo: string) {
  loja.salvar(loja.atual().filter((i) => i.codigo !== codigo));
}

export function esvaziarCarrinho() {
  loja.salvar(VAZIO);
}

/** Atualiza preço e estoque com os dados de agora (a quantidade respeita o novo estoque). */
export function atualizarCarrinho(atuais: Map<string, { preco: number; estoque: number }>) {
  loja.salvar(
    loja.atual().map((i) => {
      const agora = atuais.get(i.codigo);
      return agora ? { ...i, ...agora, quantidade: limitar(i.quantidade, agora.estoque) } : i;
    }),
  );
}

export const useCarrinho = loja.usar;

/** Itens do carrinho agora (fora de componente, ex.: para preencher um formulário). */
export const itensDoCarrinho = loja.atual;

/** Lista em texto para a mensagem do WhatsApp e para o pedido de orçamento. */
export function textoDoCarrinho(itens: ItemCarrinho[]) {
  return itens.map((i) => `• ${i.quantidade}x ${i.nome} (cód. ${i.codigo})`).join("\n");
}

export function totalDoCarrinho(itens: ItemCarrinho[]) {
  return itens.reduce((s, i) => s + i.preco * i.quantidade, 0);
}

export function unidadesNoCarrinho(itens: ItemCarrinho[]) {
  return itens.reduce((s, i) => s + i.quantidade, 0);
}
