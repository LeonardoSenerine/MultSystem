"use client";

import { useSyncExternalStore } from "react";
import { horarioTexto, sabadoAberto } from "@/data/horario-loja";

/** Relê a data a cada minuto (a troca acontece à meia-noite de 13/12/2026, horário de Brasília). */
function assinar(avisar: () => void) {
  const t = window.setInterval(avisar, 60_000);
  return () => window.clearInterval(t);
}

/**
 * Hook: a loja ainda abre aos sábados? No servidor (e antes da hidratação) responde "não", que é o horário
 * padrão gerado no build; no navegador confere a data de verdade.
 */
export function useSabadoAberto() {
  return useSyncExternalStore(
    assinar,
    () => sabadoAberto(Date.now()),
    () => false,
  );
}

/** Texto curto do horário ("Seg a sex, 8h às 17h30", com "· Sáb, 9h às 12h" até 12/12/2026). */
export function HorarioTexto() {
  return <>{horarioTexto(useSabadoAberto())}</>;
}
