"use client";

import { ArrowRight, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

const campo =
  "flex h-11 min-w-0 items-center gap-1.5 rounded-btn border-[1.5px] border-[#cfd8ec] bg-white px-3 transition-[border-color,box-shadow] duration-200 focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/12 hover:border-[#9fb0d6]";

/**
 * "Ou digite o valor": faixa de preço livre. É um formulário GET comum (funciona sem JavaScript),
 * mas com JavaScript o envio vira uma navegação do Next: só a lista troca, a página não recarrega,
 * a rolagem fica onde está e os outros filtros (que vão em campos ocultos) são mantidos.
 */
export function FormularioFaixaPreco({
  action,
  ocultos,
  prefixo,
  min,
  max,
}: {
  action: string;
  /** Filtros que já estão ligados (busca, categoria, marca, ordem), repetidos para não se perderem. */
  ocultos: [string, string][];
  prefixo: string;
  min?: number;
  max?: number;
}) {
  const router = useRouter();
  const [aplicando, iniciar] = useTransition();

  return (
    <form
      action={action}
      className="mt-4"
      aria-busy={aplicando}
      onSubmit={(e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        for (const [nome, valor] of new FormData(e.currentTarget).entries()) {
          const texto = String(valor).trim();
          if (texto) params.set(nome, texto);
        }
        const consulta = params.toString();
        iniciar(() => router.push(consulta ? `${action}?${consulta}` : action, { scroll: false }));
      }}
    >
      <p className="text-[13px] font-semibold text-muted">Ou digite o valor</p>
      {ocultos.map(([nome, valor]) => (
        <input key={nome} type="hidden" name={nome} value={valor} />
      ))}
      {/* Mínimo e máximo lado a lado; o botão fica embaixo, com a largura toda, para nada espremer. */}
      <div className="mt-2 grid grid-cols-2 gap-2">
        <label className={campo}>
          <span aria-hidden className="text-[13px] font-semibold text-muted">
            R$
          </span>
          <input
            id={`${prefixo}-preco-min`}
            name="min"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Mínimo"
            aria-label="Preço mínimo em reais"
            defaultValue={min ?? ""}
            className="w-full min-w-0 bg-transparent text-[14px] font-semibold text-ink placeholder:font-normal placeholder:text-muted focus:outline-none"
          />
        </label>
        <label className={campo}>
          <span aria-hidden className="text-[13px] font-semibold text-muted">
            R$
          </span>
          <input
            id={`${prefixo}-preco-max`}
            name="max"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Máximo"
            aria-label="Preço máximo em reais"
            defaultValue={max ?? ""}
            className="w-full min-w-0 bg-transparent text-[14px] font-semibold text-ink placeholder:font-normal placeholder:text-muted focus:outline-none"
          />
        </label>
      </div>
      <button
        type="submit"
        className="group/aplicar mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-btn bg-brand px-4 text-[14px] font-bold text-white transition-[background-color,transform] hover:bg-[#263b73] active:scale-[0.98]"
      >
        {aplicando ? (
          <>
            Aplicando
            <LoaderCircle aria-hidden className="size-4 animate-spin" />
          </>
        ) : (
          <>
            Aplicar faixa de preço
            <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover/aplicar:translate-x-0.5" />
          </>
        )}
      </button>
    </form>
  );
}
