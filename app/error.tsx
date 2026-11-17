"use client";

import Link from "next/link";
import { useEffect } from "react";

/** Algo quebrou ao montar a página: mostra uma saída em vez de uma tela em branco. */
export default function Erro({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[erro de página]", error.digest ?? "", error.message);
  }, [error]);

  return (
    <section aria-labelledby="erro-pagina-titulo" className="bg-tint">
      <div className="container-site py-16 lg:py-28">
        <p className="text-eyebrow text-brand">Algo deu errado</p>
        <h1 id="erro-pagina-titulo" className="mt-2 max-w-[18ch] text-display text-balance text-ink">
          Não conseguimos abrir esta página agora.
        </h1>
        <p className="mt-4 max-w-[48ch] text-body-lg text-muted">
          Foi um problema do nosso lado. Tente de novo; se continuar, chame a gente no WhatsApp ou ligue para a loja.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-13 items-center justify-center rounded-btn bg-brand px-6 text-body font-bold text-white transition-[background-color,transform] hover:bg-[#263b73] active:scale-[0.98]"
          >
            Tentar de novo
          </button>
          <Link
            href="/"
            className="inline-flex min-h-13 items-center justify-center rounded-btn border border-line bg-white px-6 text-body font-bold text-ink transition-[border-color,color] hover:border-brand hover:text-brand"
          >
            Ir para o início
          </Link>
        </div>
      </div>
    </section>
  );
}
