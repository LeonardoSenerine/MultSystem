"use client";

import { reabrirPreferenciasCookies } from "@/lib/cookies";

/** "Preferências de cookies" no rodapé: reabre o aviso para mudar a escolha. */
export function BotaoCookies({ className = "" }: { className?: string }) {
  return (
    <button type="button" onClick={reabrirPreferenciasCookies} className={className}>
      Preferências de cookies
    </button>
  );
}
