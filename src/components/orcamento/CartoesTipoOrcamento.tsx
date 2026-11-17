"use client";

import { ArrowRight } from "lucide-react";
import { useCallback, useState } from "react";
import { ModalTipoOrcamento } from "@/components/orcamento/ModalTipoOrcamento";
import { Reveal } from "@/components/Reveal";
import { tiposOrcamento, type TipoOrcamento } from "@/data/orcamento";

/**
 * Os tipos de orçamento em cards. Cada card abre um modal com o formulário daquele tipo,
 * sem rolar a página até o formulário lá embaixo.
 */
export function CartoesTipoOrcamento({ whatsapp }: { whatsapp: string }) {
  const [aberto, setAberto] = useState<TipoOrcamento | null>(null);
  const fechar = useCallback(() => setAberto(null), []);

  return (
    <>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4 lg:gap-6">
        {tiposOrcamento.map((t, i) => (
          <Reveal as="li" key={t.valor} atraso={(i % 4) * 80}>
            <button
              type="button"
              onClick={() => setAberto(t.valor)}
              aria-haspopup="dialog"
              className="group flex h-full w-full flex-col rounded-card border border-line bg-white p-5 text-left transition-[transform,box-shadow,border-color] duration-300 ease-out hover:border-brand active:scale-[0.99] lg:p-6 lg:hover:-translate-y-0.5 lg:hover:shadow-card"
            >
              <h3 className="text-h3 text-ink">{t.rotulo}</h3>
              <p className="mt-1.5 text-small text-muted">{t.detalhe}</p>
              <ul className="mt-4 flex-1 space-y-1.5 border-t border-line pt-4 text-small text-ink">
                {t.exemplos.map((ex) => (
                  <li key={ex} className="flex gap-2">
                    <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-brand/60" />
                    {ex}
                  </li>
                ))}
              </ul>
              <span className="mt-5 inline-flex min-h-11 items-center gap-2 text-[15px] leading-5 font-bold text-brand">
                Solicitar cotação
                <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          </Reveal>
        ))}
      </ul>

      <ModalTipoOrcamento tipo={aberto} whatsapp={whatsapp} aoFechar={fechar} />
    </>
  );
}
