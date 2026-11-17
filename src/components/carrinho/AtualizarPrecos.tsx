"use client";

import { useEffect, useRef } from "react";

/**
 * Busca preço e estoque de agora para os códigos informados (uma vez por montagem) e
 * entrega o resultado. Usado pelas páginas de carrinho e de favoritos.
 */
export function useAtualizarPrecos(codigos: string[], aoReceber: (atuais: Map<string, { preco: number; estoque: number }>) => void) {
  const feito = useRef(false);
  const chave = [...codigos].sort().join(",");

  useEffect(() => {
    if (feito.current || !chave) return;
    feito.current = true;
    const controle = new AbortController();
    fetch(`/api/produtos?codigos=${encodeURIComponent(chave)}`, { signal: controle.signal })
      .then((r) => r.json() as Promise<{ itens: { codigo: string; preco: number; estoque: number }[] }>)
      .then(({ itens }) => aoReceber(new Map(itens.map((i) => [i.codigo, { preco: i.preco, estoque: i.estoque }]))))
      .catch(() => {});
    return () => controle.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chave]);
}
