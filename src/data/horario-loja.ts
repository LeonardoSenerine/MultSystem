/*
 * Horário de funcionamento da loja, em dados, para a página mostrar "Aberto agora" e destacar o dia de hoje.
 *
 * Mudança programada (pedido do cliente, 19/11/2026): até sábado 12/12/2026 a loja abre aos sábados, das 9h às 12h.
 * A partir de segunda 14/12/2026 abre só de segunda a sexta, das 8h às 17h30.
 *
 * Como o site é gerado antes (build), o PADRÃO aqui já é o horário novo (sem sábado), e o navegador de quem visita
 * acrescenta o sábado enquanto a data for anterior ao corte (ver HorarioTexto e QuadroHorarios). Assim, no dia 13/12
 * o sábado some sozinho, sem precisar publicar o site de novo.
 * TODO: dado real. Confirmar com a Multsystems feriados e horário de almoço, se houver. Depois de 13/12/2026 dá para
 * apagar SABADO_ATE e a faixa de sábado.
 */

export type FaixaHorario = {
  rotulo: string;
  /** 0 = domingo ... 6 = sábado. */
  dias: readonly number[];
  /** Minutos desde a meia-noite; sem abre/fecha a loja não abre nesses dias. */
  abre?: number;
  fecha?: number;
};

/** Fim do último sábado aberto: 13/12/2026 às 00:00 no horário de Brasília (UTC-3). */
export const SABADO_ATE = Date.UTC(2026, 11, 13, 3, 0);
/** O mesmo corte em texto, para os dados do Google (schema.org "validThrough"). */
export const ULTIMO_SABADO_ISO = "2026-12-12";

/** A loja ainda abre aos sábados neste instante? */
export const sabadoAberto = (instante: number) => instante < SABADO_ATE;

const semana: FaixaHorario = { rotulo: "Segunda a sexta", dias: [1, 2, 3, 4, 5], abre: 8 * 60, fecha: 17 * 60 + 30 };
export const sabado: FaixaHorario = { rotulo: "Sábado", dias: [6], abre: 9 * 60, fecha: 12 * 60 };

/** Tabela de horários. Com `comSabado` falso (o padrão a partir de 14/12/2026), sábado aparece como fechado. */
export function funcionamentoEm(comSabado: boolean): readonly FaixaHorario[] {
  return comSabado
    ? [semana, sabado, { rotulo: "Domingo e feriados", dias: [0] }]
    : [semana, { rotulo: "Sábado, domingo e feriados", dias: [6, 0] }];
}

/** Horário padrão (o novo, sem sábado). */
export const funcionamento = funcionamentoEm(false);

/** Texto curto do horário, para o topo, o rodapé e o contato. */
export const horarioTexto = (comSabado: boolean) => (comSabado ? "Seg a sex, 8h às 17h30 · Sáb, 9h às 12h" : "Seg a sex, 8h às 17h30");

export const NOMES_DIAS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"] as const;

/** 510 → "8h30"; 480 → "8h". */
export function horaTexto(minutos: number) {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return m ? `${h}h${String(m).padStart(2, "0")}` : `${h}h`;
}

export function faixaDoDia(dia: number, tabela: readonly FaixaHorario[] = funcionamento) {
  return tabela.find((f) => f.dias.includes(dia));
}
