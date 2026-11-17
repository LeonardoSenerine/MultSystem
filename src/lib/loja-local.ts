"use client";

/*
 * Pequeno "banco" no navegador (localStorage) com aviso para os componentes React.
 * Usado pelo carrinho, pelos favoritos e pelo cadastro de contato. Abas abertas ao mesmo
 * tempo ficam em sincronia pelo evento "storage". Se o armazenamento estiver bloqueado
 * (aba anônima, por exemplo), os dados valem só enquanto a página está aberta.
 */
import { useSyncExternalStore } from "react";

const nada = () => () => {};

/** false no servidor e na primeira pintura; true depois que a página leu o navegador. */
export function useHidratado() {
  return useSyncExternalStore(nada, () => true, () => false);
}

export function criarLoja<T>(chave: string, inicial: T, validar: (bruto: unknown) => T) {
  let valor: T | null = null;
  const ouvintes = new Set<() => void>();

  function ler(): T {
    try {
      const bruto = window.localStorage.getItem(chave);
      return bruto === null ? inicial : validar(JSON.parse(bruto));
    } catch {
      return inicial;
    }
  }

  function atual(): T {
    if (valor === null) valor = ler();
    return valor;
  }

  function salvar(novo: T) {
    valor = novo;
    try {
      window.localStorage.setItem(chave, JSON.stringify(novo));
    } catch {
      // Armazenamento indisponível: vale só para esta página.
    }
    ouvintes.forEach((avisar) => avisar());
  }

  function inscrever(avisar: () => void) {
    ouvintes.add(avisar);
    const deOutraAba = (e: StorageEvent) => {
      if (e.key !== chave) return;
      valor = ler();
      avisar();
    };
    window.addEventListener("storage", deOutraAba);
    return () => {
      ouvintes.delete(avisar);
      window.removeEventListener("storage", deOutraAba);
    };
  }

  /** Valor atual. No servidor (e na primeira pintura) é o inicial; depois lê o que está salvo. */
  function useLoja(): T {
    return useSyncExternalStore(inscrever, atual, () => inicial);
  }

  return { atual, salvar, usar: useLoja };
}
