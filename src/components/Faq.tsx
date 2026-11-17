"use client";

import { Plus } from "lucide-react";
import { useId, useState } from "react";
import type { Pergunta } from "@/types";

/**
 * Perguntas frequentes em sanfona. A abertura é animada com grid-template-rows (0fr → 1fr),
 * que anima altura automática sem JavaScript medindo nada. Uma pergunta aberta por vez.
 */
export function Faq({ perguntas }: { perguntas: Pergunta[] }) {
  const [aberta, setAberta] = useState<number>(0);
  const id = useId();

  // Perguntas e respostas também em dados estruturados (FAQ), para o Google poder exibi-las.
  const dados = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: perguntas.map((p) => ({
      "@type": "Question",
      name: p.pergunta,
      acceptedAnswer: { "@type": "Answer", text: p.resposta },
    })),
  };

  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(dados).replace(/</g, "\\u003c") }} />
    <ul className="divide-y divide-line rounded-card border border-line bg-white">
      {perguntas.map((p, i) => {
        const estaAberta = aberta === i;
        return (
          <li key={p.pergunta}>
            <h3>
              <button
                type="button"
                id={`${id}-p${i}`}
                aria-expanded={estaAberta}
                aria-controls={`${id}-r${i}`}
                onClick={() => setAberta(estaAberta ? -1 : i)}
                className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-h3 text-ink transition-colors hover:text-brand lg:px-6 lg:py-5"
              >
                {p.pergunta}
                <span
                  aria-hidden
                  className="grid size-8 shrink-0 place-items-center rounded-full bg-tint text-brand transition-transform duration-300 ease-out group-aria-expanded:rotate-45"
                >
                  <Plus className="size-4" />
                </span>
              </button>
            </h3>
            <div
              id={`${id}-r${i}`}
              role="region"
              aria-labelledby={`${id}-p${i}`}
              className="faq-resposta grid transition-[grid-template-rows] duration-300 ease-out"
              data-aberta={estaAberta}
            >
              <div className="overflow-hidden">
                <p
                  className={`px-5 pb-5 text-body text-muted transition-[opacity,transform] duration-300 ease-out lg:px-6 lg:pb-6 ${
                    estaAberta ? "opacity-100" : "-translate-y-1 opacity-0"
                  }`}
                >
                  {p.resposta}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
    </>
  );
}
