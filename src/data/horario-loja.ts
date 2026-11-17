/*
 * Horário de funcionamento da loja, em dados, para a página mostrar "Aberto agora" e destacar o dia de hoje.
 * Mesmo horário do texto em contato.ts (Seg a sex, 8h às 17h30 · Sáb, 9h às 12h).
 * TODO: dado real. Confirmar com a Multsystems (feriados e horário de almoço, se houver).
 */

export type FaixaHorario = {
  rotulo: string;
  /** 0 = domingo ... 6 = sábado. */
  dias: readonly number[];
  /** Minutos desde a meia-noite; sem abre/fecha a loja não abre nesses dias. */
  abre?: number;
  fecha?: number;
};

export const funcionamento: readonly FaixaHorario[] = [
  { rotulo: "Segunda a sexta", dias: [1, 2, 3, 4, 5], abre: 8 * 60, fecha: 17 * 60 + 30 },
  { rotulo: "Sábado", dias: [6], abre: 9 * 60, fecha: 12 * 60 },
  { rotulo: "Domingo e feriados", dias: [0] },
];

export const NOMES_DIAS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"] as const;

/** 510 → "8h30"; 480 → "8h". */
export function horaTexto(minutos: number) {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return m ? `${h}h${String(m).padStart(2, "0")}` : `${h}h`;
}

export function faixaDoDia(dia: number) {
  return funcionamento.find((f) => f.dias.includes(dia));
}
