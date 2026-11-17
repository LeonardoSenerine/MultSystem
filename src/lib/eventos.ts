"use client";

/*
 * Eventos do funil de vendas. Cada evento vai para o Google Analytics (se NEXT_PUBLIC_GA_ID estiver
 * configurado) e, quando `servidor` é verdadeiro, também para POST /api/eventos, que registra uma
 * linha no log. Assim dá para contar o funil mesmo sem o GA ou sem o aceite de cookies.
 *
 * Eventos usados no site:
 *   ver_produto, adicionar_carrinho, remover_carrinho, favoritar, busca, busca_sem_resultado,
 *   clique_whatsapp, clique_telefone, clique_como_chegar, finalizar_carrinho,
 *   enviar_orcamento, enviar_assistencia, enviar_contato, salvar_lista, usar_lista, inscrever_promocoes,
 *   adicionar_todos_favoritos
 */

type Dados = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function evento(nome: string, dados: Dados = {}, servidor = false) {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", nome, dados);
    if (servidor) {
      const corpo = new Blob([JSON.stringify({ nome, dados, pagina: window.location.pathname })], { type: "application/json" });
      navigator.sendBeacon?.("/api/eventos", corpo);
    }
  } catch {
    // Rastrear nunca pode quebrar a página.
  }
}
