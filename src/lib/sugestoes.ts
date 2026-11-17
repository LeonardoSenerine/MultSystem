import { complementares } from "@/data/sugestoes";
import type { ProdutoCatalogo } from "@/types";

/**
 * Escolhe, para cada categoria complementar (na ordem), um produto com foto e estoque cujo preço
 * seja de acessório: no máximo metade do preço de referência (e pelo menos R$ 200), o mais
 * perto de ~8% dele, entre R$ 40 e R$ 250 (mouse para notebook, toner para impressora). Uma por
 * categoria, para a lista não virar só cabos.
 */
function escolher(todos: ProdutoCatalogo[], subs: string[], precoRef: number, excluir: Set<string>, max: number) {
  const alvo = Math.min(250, Math.max(40, precoRef * 0.08));
  const teto = Math.max(200, precoRef * 0.5);
  const escolhidos: ProdutoCatalogo[] = [];
  for (const sub of subs) {
    if (escolhidos.length >= max) break;
    const candidatos = todos
      .filter((p) => p.subcategoria === sub && p.temFoto && p.estoque > 0 && p.preco > 0 && p.preco <= teto && !excluir.has(p.codigo))
      .sort((a, b) => Math.abs(a.preco - alvo) - Math.abs(b.preco - alvo));
    if (candidatos[0]) escolhidos.push(candidatos[0]);
  }
  return escolhidos;
}

/** Sugestões para a página de um produto. */
export function sugerirComplementares(produto: ProdutoCatalogo, todos: ProdutoCatalogo[], max = 4) {
  return escolher(todos, complementares[produto.subcategoria] ?? [], produto.preco, new Set([produto.codigo]), max);
}

/**
 * Sugestões para o carrinho: as categorias complementares dos itens (intercaladas, começando pelo
 * item mais caro), sem repetir o que já está no carrinho.
 */
export function sugerirParaCarrinho(noCarrinho: ProdutoCatalogo[], todos: ProdutoCatalogo[], max = 4) {
  if (noCarrinho.length === 0) return [];
  const ordenados = [...noCarrinho].sort((a, b) => b.preco - a.preco);
  const jaTem = new Set(noCarrinho.map((p) => p.subcategoria));
  const subs: string[] = [];
  const rodadas = Math.max(...ordenados.map((p) => (complementares[p.subcategoria] ?? []).length));
  for (let i = 0; i < rodadas; i++) {
    for (const p of ordenados) {
      const sub = (complementares[p.subcategoria] ?? [])[i];
      if (sub && !jaTem.has(sub) && !subs.includes(sub)) subs.push(sub);
    }
  }
  return escolher(todos, subs, ordenados[0].preco, new Set(noCarrinho.map((p) => p.codigo)), max);
}
