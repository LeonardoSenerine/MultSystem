"use client";

/*
 * Escolha de cookies do visitante (LGPD). Há duas categorias:
 *  - necessários: sempre ativos. O carrinho, os favoritos, o contato salvo e esta própria escolha
 *    ficam no armazenamento do navegador (localStorage) e servem só para o site funcionar;
 *  - estatísticas: Google Analytics, só se o visitante aceitar (e só se o site tiver um ID configurado).
 * A escolha fica em "multsystems:cookies:v1". O script do Analytics (GoogleAnalytics.tsx) lê essa
 * mesma chave para já começar com o consentimento certo.
 */
import { criarLoja } from "@/lib/loja-local";

export type EscolhaCookies = { analytics: boolean; em: string };

const loja = criarLoja<EscolhaCookies | null>("multsystems:cookies:v1", null, (bruto) => {
  const c = bruto as EscolhaCookies | null;
  return c && typeof c.analytics === "boolean" ? c : null;
});

/** Pedido para reabrir o aviso ("Preferências de cookies" no rodapé). */
const pedido = criarLoja<{ aberto: boolean }>("multsystems:cookies-pedido:v0", { aberto: false }, () => ({ aberto: false }));

export const useEscolhaCookies = loja.usar;
export const usePedidoCookies = pedido.usar;

export function salvarEscolhaCookies(analytics: boolean) {
  loja.salvar({ analytics, em: new Date().toISOString() });
  pedido.salvar({ aberto: false });
  try {
    window.gtag?.("consent", "update", { analytics_storage: analytics ? "granted" : "denied" });
  } catch {
    // Sem Analytics na página: nada a atualizar.
  }
}

export function reabrirPreferenciasCookies() {
  pedido.salvar({ aberto: true });
}

export function fecharPreferenciasCookies() {
  pedido.salvar({ aberto: false });
}
