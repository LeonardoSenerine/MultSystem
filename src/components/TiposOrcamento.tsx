import type { ReactNode } from "react";
import { FundoOndas } from "@/components/FundoOndas";
import { CartoesTipoOrcamento } from "@/components/orcamento/CartoesTipoOrcamento";
import { Reveal } from "@/components/Reveal";
import { getContato } from "@/lib/dados";

/**
 * Os tipos de orçamento em cards (ideia reaproveitada do site atual, que cotava por área).
 * Cada card abre um modal com o formulário daquele tipo, sem sair do lugar na página.
 * `children` entra no fim da mesma seção (em /empresas, o carrossel de marcas), para o fundo de ondas cobrir os dois.
 */
export function TiposOrcamento({ children }: { children?: ReactNode }) {
  const contato = getContato();

  return (
    // Mesmo fundo de ondas do Sobre da home e da assistência.
    <section id="tipos-orcamento" aria-labelledby="tipos-titulo" className="relative isolate overflow-hidden section-y">
      <FundoOndas />
      <Reveal className="container-site">
        <div className="max-w-[60ch]">
          <p className="text-eyebrow text-brand">Orçamento para empresa</p>
          <h2 id="tipos-titulo" className="mt-2 text-h2 text-ink text-balance">
            O que sua empresa precisa cotar?
          </h2>
          <p className="mt-4 text-body-lg text-muted">
            Escolha o tipo e peça a cotação aqui mesmo. Se for uma combinação, escolha &ldquo;Outro&rdquo; e descreva.
          </p>
        </div>

        <CartoesTipoOrcamento whatsapp={contato.whatsapp.replace(/\D/g, "")} />
      </Reveal>
      {children && <div className="container-site">{children}</div>}
    </section>
  );
}
