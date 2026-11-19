import { ArrowUpRight, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/icones-marca";
import { StatusAgora } from "@/components/loja/QuadroHorarios";
import { Reveal } from "@/components/Reveal";
import { getContato } from "@/lib/dados";
import { mensagens, whatsappLink } from "@/lib/whatsapp";

const tile =
  "group flex min-h-[76px] min-w-0 items-center gap-4 rounded-card bg-white p-4 ring-1 ring-line transition-[transform,box-shadow,--tw-ring-color] duration-300 hover:-translate-y-0.5 hover:shadow-card hover:ring-brand/40 active:scale-[0.99] lg:p-5";

/**
 * Fecho de todas as páginas: um painel claro com o convite à esquerda e, à direita, os três
 * jeitos de falar com a loja (WhatsApp, telefone, visita), todos do mesmo tamanho e alinhados.
 * A etiqueta "Aberto agora" mostra se tem alguém no balcão naquele momento.
 */
export function Encerramento() {
  const contato = getContato();

  return (
    <section id="fale-conosco" aria-labelledby="encerramento-titulo" className="pt-10 pb-12 lg:pt-14 lg:pb-24">
      <div className="container-site">
        <Reveal className="grid grid-cols-1 gap-10 rounded-photo bg-tint p-6 sm:p-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center lg:gap-16 lg:p-16">
          <div>
            <h2 id="encerramento-titulo" className="max-w-[18ch] text-display text-balance text-ink">
              Ficou com dúvida? Fale com a gente.
            </h2>
            <p className="mt-5 max-w-[46ch] text-body-lg text-muted">
              Chame no WhatsApp, ligue ou passe na loja. Você explica o que precisa e a gente diz, sem rodeio, o que vale a pena.
            </p>
            <div className="mt-6">
              <StatusAgora />
            </div>
          </div>

          <ul className="grid min-w-0 grid-cols-1 gap-3">
            <Reveal as="li" className="min-w-0" atraso={100}>
              <a href={whatsappLink(contato.whatsapp, mensagens.geral)} target="_blank" rel="noopener noreferrer" className={tile}>
                <span aria-hidden className="relative grid size-12 shrink-0 place-items-center rounded-full bg-whatsapp text-ink">
                  <WhatsAppIcon className="size-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-body font-bold text-ink">Chamar no WhatsApp</span>
                  <span className="block text-small text-muted">Resposta rápida em horário comercial</span>
                </span>
                <ArrowUpRight aria-hidden className="size-5 shrink-0 text-muted transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
              </a>
            </Reveal>

            <Reveal as="li" className="min-w-0" atraso={180}>
              <a href={contato.telefoneLink} className={tile}>
                <span aria-hidden className="grid size-12 shrink-0 place-items-center rounded-full bg-brand text-white">
                  <Phone className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-body font-bold text-ink">Ligar para a loja</span>
                  <span className="block text-small text-muted tabular-nums">{contato.telefone}</span>
                </span>
                <ArrowUpRight aria-hidden className="size-5 shrink-0 text-muted transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
              </a>
            </Reveal>

            <Reveal as="li" className="min-w-0" atraso={260}>
              <a href={contato.mapsUrl} target="_blank" rel="noopener noreferrer" className={tile}>
                <span aria-hidden className="grid size-12 shrink-0 place-items-center rounded-full bg-navy text-white">
                  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
                    <circle cx="12" cy="9.5" r="2.5" />
                  </svg>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-body font-bold text-ink">Passar na loja</span>
                  <span className="block text-small text-muted sm:truncate">{contato.endereco}</span>
                </span>
                <ArrowUpRight aria-hidden className="size-5 shrink-0 text-muted transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
              </a>
            </Reveal>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

