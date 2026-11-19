"use client";

import { useSyncExternalStore } from "react";
import { NOMES_DIAS, faixaDoDia, funcionamentoEm, horaTexto, sabadoAberto, type FaixaHorario } from "@/data/horario-loja";

/** Minuto atual (como número, estável dentro do minuto) para o React reler a cada 30 s. */
function assinar(avisar: () => void) {
  const t = window.setInterval(avisar, 30_000);
  return () => window.clearInterval(t);
}
const minutoAtual = () => Math.floor(Date.now() / 60_000);
const noServidor = () => 0;

/** Dia da semana (0 = domingo) e minutos desde a meia-noite, no horário de Brasília. */
function emBrasilia(minuto: number) {
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(minuto * 60_000));
  const pegar = (tipo: string) => partes.find((p) => p.type === tipo)?.value ?? "";
  const dia = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(pegar("weekday"));
  return { dia, minutos: Number(pegar("hour")) * 60 + Number(pegar("minute")) };
}

/** Tabela de horários válida no minuto dado (com sábado até 12/12/2026). Sem minuto (servidor): a padrão. */
const tabelaEm = (minuto: number) => funcionamentoEm(minuto ? sabadoAberto(minuto * 60_000) : false);

function proximaAbertura(dia: number, minutos: number, tabela: readonly FaixaHorario[]) {
  for (let i = 0; i < 7; i++) {
    const d = (dia + i) % 7;
    const faixa = faixaDoDia(d, tabela);
    if (faixa?.abre === undefined) continue;
    if (i === 0 && minutos >= faixa.abre) continue;
    const quando = i === 0 ? "hoje" : i === 1 ? "amanhã" : NOMES_DIAS[d];
    return `abre ${quando} às ${horaTexto(faixa.abre)}`;
  }
  return "";
}

/** Só a etiqueta "Aberto agora · fecha às 17h30" (ou "Fechado agora · abre amanhã às 8h"). */
export function StatusAgora({ className = "" }: { className?: string }) {
  const minuto = useSyncExternalStore(assinar, minutoAtual, noServidor);
  const agora = minuto ? emBrasilia(minuto) : null;
  const tabela = tabelaEm(minuto);
  const faixaHoje = agora ? faixaDoDia(agora.dia, tabela) : undefined;
  const aberto =
    agora && faixaHoje?.abre !== undefined && faixaHoje.fecha !== undefined && agora.minutos >= faixaHoje.abre && agora.minutos < faixaHoje.fecha;

  // No servidor (e antes da hidratação) a etiqueta não aparece, para não divergir.
  if (!agora) return <span className={`${className} invisible`} aria-hidden>Aberto agora</span>;

  return (
    <p
      role="status"
      className={`inline-flex min-h-8 items-center gap-2.5 rounded-full px-3.5 text-[13px] leading-4 font-bold ${
        aberto ? "bg-[#e6f6ef] text-[#00734c]" : "bg-[#fdecec] text-[#b42318]"
      } ${className}`}
    >
      <span aria-hidden className={`relative size-2 rounded-full ${aberto ? "ponto-aberto bg-[#00a86b]" : "bg-[#d92d20]"}`} />
      {aberto ? `Aberto agora · fecha às ${horaTexto(faixaHoje!.fecha!)}` : `Fechado agora · ${proximaAbertura(agora.dia, agora.minutos, tabela)}`}
    </p>
  );
}

/**
 * "Aberto agora / Fechado agora" e a tabela de horários, com o dia de hoje destacado.
 * No servidor (e na primeira pintura) mostra só a tabela, sem destaque, para não divergir da hidratação.
 */
export function QuadroHorarios() {
  const minuto = useSyncExternalStore(assinar, minutoAtual, noServidor);
  const agora = minuto ? emBrasilia(minuto) : null;
  const tabela = tabelaEm(minuto);

  const faixaHoje = agora ? faixaDoDia(agora.dia, tabela) : undefined;
  const aberto =
    agora && faixaHoje?.abre !== undefined && faixaHoje.fecha !== undefined && agora.minutos >= faixaHoje.abre && agora.minutos < faixaHoje.fecha;

  let status = "Confira os horários";
  if (agora) {
    status = aberto
      ? `Aberto agora · fecha às ${horaTexto(faixaHoje!.fecha!)}`
      : `Fechado agora · ${proximaAbertura(agora.dia, agora.minutos, tabela)}`;
  }

  return (
    <div>
      <p
        role="status"
        className={`inline-flex min-h-8 items-center gap-2.5 rounded-full px-3.5 text-[13px] leading-4 font-bold transition-colors duration-500 ${
          !agora ? "bg-tint text-muted" : aberto ? "bg-[#e6f6ef] text-[#00734c]" : "bg-[#fdecec] text-[#b42318]"
        }`}
      >
        {agora && (
          <span aria-hidden className={`relative size-2 rounded-full ${aberto ? "ponto-aberto bg-[#00a86b]" : "bg-[#d92d20]"}`} />
        )}
        {status}
      </p>

      {/* Sem fundo no dia de hoje: o destaque é o texto em negrito e a etiqueta, para tudo alinhar pela mesma margem. */}
      <table className="mt-3 w-full border-separate border-spacing-0 text-body">
        <caption className="sr-only">Horário de funcionamento da loja</caption>
        <tbody>
          {tabela.map((f) => {
            const hoje = agora !== null && f.dias.includes(agora.dia);
            return (
              <tr key={f.rotulo}>
                <th scope="row" className={`py-2 text-left font-semibold transition-colors ${hoje ? "text-ink" : "text-muted"}`}>
                  {f.rotulo}
                  {hoje && <span className="ml-2 rounded-full bg-brand px-2 py-0.5 align-middle text-[11px] leading-4 font-bold text-white">hoje</span>}
                </th>
                <td className={`py-2 text-right tabular-nums ${hoje ? "font-bold text-ink" : "text-ink"}`}>
                  {f.abre !== undefined && f.fecha !== undefined ? `${horaTexto(f.abre)} às ${horaTexto(f.fecha)}` : "Fechado"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
