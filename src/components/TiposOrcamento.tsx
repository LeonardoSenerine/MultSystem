import { CartoesTipoOrcamento } from "@/components/orcamento/CartoesTipoOrcamento";
import { Reveal } from "@/components/Reveal";
import { getContato } from "@/lib/dados";

/**
 * Os tipos de orçamento em cards (ideia reaproveitada do site atual, que cotava por área).
 * Cada card abre um modal com o formulário daquele tipo, sem sair do lugar na página.
 */
export function TiposOrcamento() {
  const contato = getContato();

  return (
    <section id="tipos-orcamento" aria-labelledby="tipos-titulo" className="section-y">
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
    </section>
  );
}
