import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { POR_PAGINA, urlFiltros, type Filtros } from "@/lib/filtros";

/** Páginas numeradas: 1 … 4 5 6 … 20. */
function numeros(atual: number, total: number): (number | "…")[] {
  const set = new Set([1, total, atual - 1, atual, atual + 1].filter((n) => n >= 1 && n <= total));
  const lista = [...set].sort((a, b) => a - b);
  return lista.flatMap((n, i) => (i > 0 && n - lista[i - 1] > 1 ? ["…" as const, n] : [n]));
}

const seta =
  "group/seta inline-flex min-h-11 items-center gap-1.5 rounded-full bg-white px-4 text-[14px] font-bold text-ink ring-1 ring-line transition-[color,box-shadow,transform] duration-200 hover:text-brand hover:ring-brand active:scale-95";
const setaDesligada = "inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-[14px] font-bold text-muted/50";

export function Paginacao({
  filtros,
  pagina,
  totalPaginas,
  total,
}: {
  filtros: Filtros;
  pagina: number;
  totalPaginas: number;
  total: number;
}) {
  if (totalPaginas <= 1) return null;
  const url = (n: number) => urlFiltros(filtros, { pagina: n });
  const de = (pagina - 1) * POR_PAGINA + 1;
  const ate = Math.min(pagina * POR_PAGINA, total);

  return (
    <nav aria-label="Páginas" className="mt-10 flex flex-col items-center gap-4 lg:mt-14">
      <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-center">
        {pagina > 1 ? (
          <Link href={url(pagina - 1)} className={seta} rel="prev">
            <ChevronLeft aria-hidden className="size-4 transition-transform duration-200 group-hover/seta:-translate-x-0.5" />
            <span>Anterior</span>
          </Link>
        ) : (
          <span className={setaDesligada} aria-hidden>
            <ChevronLeft className="size-4" />
            Anterior
          </span>
        )}

        {/* Números: no celular só o "3 de 73", que cabe na linha. */}
        <ol className="hidden items-center gap-1 rounded-full bg-white p-1 ring-1 ring-line sm:flex">
          {numeros(pagina, totalPaginas).map((n, i) =>
            n === "…" ? (
              <li key={`r${i}`} aria-hidden className="grid w-7 place-items-center text-muted">
                …
              </li>
            ) : (
              <li key={n}>
                <Link
                  href={url(n)}
                  aria-current={n === pagina ? "page" : undefined}
                  aria-label={`Página ${n}`}
                  className={`grid size-11 place-items-center rounded-full text-[14px] font-bold tabular-nums transition-[background-color,color,transform] duration-200 active:scale-90 ${
                    n === pagina ? "chip-entra bg-brand text-white" : "text-ink hover:bg-tint hover:text-brand"
                  }`}
                >
                  {n}
                </Link>
              </li>
            ),
          )}
        </ol>
        <p className="text-[14px] font-semibold text-ink tabular-nums sm:hidden">
          {pagina} <span className="font-normal text-muted">de</span> {totalPaginas}
        </p>

        {pagina < totalPaginas ? (
          <Link href={url(pagina + 1)} className={seta} rel="next">
            <span>Próxima</span>
            <ChevronRight aria-hidden className="size-4 transition-transform duration-200 group-hover/seta:translate-x-0.5" />
          </Link>
        ) : (
          <span className={setaDesligada} aria-hidden>
            Próxima
            <ChevronRight className="size-4" />
          </span>
        )}
      </div>
      <p className="text-[13px] text-muted tabular-nums">
        Mostrando {de.toLocaleString("pt-BR")}–{ate.toLocaleString("pt-BR")} de {total.toLocaleString("pt-BR")} produtos
      </p>
    </nav>
  );
}
