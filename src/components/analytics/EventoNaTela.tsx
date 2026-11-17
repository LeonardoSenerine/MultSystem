"use client";

import { useEffect } from "react";
import { evento } from "@/lib/eventos";

/** Dispara um evento do funil quando a página (ou o trecho) aparece. Não desenha nada. */
export function EventoNaTela({
  nome,
  dados,
  servidor = true,
}: {
  nome: string;
  dados?: Record<string, string | number | boolean | undefined>;
  servidor?: boolean;
}) {
  const chave = JSON.stringify(dados ?? {});
  useEffect(() => {
    evento(nome, JSON.parse(chave) as Record<string, string | number | boolean | undefined>, servidor);
  }, [nome, chave, servidor]);
  return null;
}
