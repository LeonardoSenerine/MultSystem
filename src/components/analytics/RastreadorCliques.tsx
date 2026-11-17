"use client";

import { useEffect } from "react";
import { evento } from "@/lib/eventos";

/**
 * Conta os cliques que levam a pessoa até a loja: WhatsApp, telefone e "Como chegar".
 * Um só ouvinte no documento, então cada botão novo do site já entra na contagem.
 * Não desenha nada.
 */
export function RastreadorCliques() {
  useEffect(() => {
    const aoClicar = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;
      const href = link.href;
      const pagina = window.location.pathname;
      if (href.includes("wa.me/")) {
        const numero = href.match(/wa\.me\/(\d+)/)?.[1] ?? "";
        evento("clique_whatsapp", { pagina, numero }, true);
      } else if (href.startsWith("tel:")) {
        evento("clique_telefone", { pagina }, true);
      } else if (href.includes("google.com/maps")) {
        evento("clique_como_chegar", { pagina }, true);
      }
    };
    document.addEventListener("click", aoClicar, true);
    return () => document.removeEventListener("click", aoClicar, true);
  }, []);

  return null;
}
