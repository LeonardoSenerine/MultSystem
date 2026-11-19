import { WhatsAppIcon } from "@/components/icones-marca";
import { OrcamentoForm } from "@/components/OrcamentoForm";
import { Reveal } from "@/components/Reveal";
import { getContato } from "@/lib/dados";
import { mensagens, whatsappLink } from "@/lib/whatsapp";

/** CTA principal da página: a cotação específica, com o formulário. */
export function CtaOrcamento() {
  const contato = getContato();
  const whatsappHref = whatsappLink(contato.whatsapp, mensagens.orcamento);

  return (
    <section id="orcamento" aria-labelledby="orcamento-titulo" className="on-dark section-y bg-brand text-white">
      <Reveal className="container-site grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-16">
        <div>
          <p className="text-eyebrow text-white/70">Especialistas em B2B</p>
          <h2 id="orcamento-titulo" className="mt-3 text-h2 text-balance">
            Peça um orçamento. A gente responde com preço, prazo e nota fiscal.
          </h2>
          <p className="mt-4 max-w-[44ch] text-body-lg text-white/85">
            Vender para empresas é a nossa especialidade. Conte o que a sua precisa e um vendedor monta a cotação com as opções que cabem no seu orçamento.
          </p>

          <ul className="mt-8 divide-y divide-white/15 border-y border-white/15 text-body text-white/90">
            <li className="py-3">Resposta rápida, em horário comercial</li>
            <li className="py-3">Nota fiscal no CNPJ e condições para empresa</li>
            <li className="py-3">Entrega em Itatiba e região ou envio para todo o Brasil</li>
          </ul>

          <p className="mt-8 text-small text-white/85">
            Prefere conversar?{" "}
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1.5 font-bold text-white underline-offset-4 hover:underline"
            >
              <WhatsAppIcon className="size-4" />
              Chame no WhatsApp
            </a>
          </p>
        </div>

        <OrcamentoForm whatsapp={contato.whatsapp} />
      </Reveal>
    </section>
  );
}
