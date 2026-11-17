import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/Button";
import { QuadroHorarios } from "@/components/loja/QuadroHorarios";
import { Reveal } from "@/components/Reveal";
import { getContato } from "@/lib/dados";

const rotulo = "text-eyebrow text-muted transition-colors group-hover/linha:text-brand";
const linha = "group/linha grid gap-1 py-5 sm:grid-cols-[6.5rem_1fr] sm:gap-4";
const link = "sublinha inline-flex min-h-11 items-center text-body text-ink transition-colors hover:text-brand";

/**
 * Visite a loja: três linhas (endereço, horário, contato) alinhadas pela mesma coluna de rótulos,
 * um botão e o mapa, que estica até a altura da coluna do texto: as duas metades terminam juntas,
 * sem sobra de espaço de nenhum lado.
 */
export function VisiteLoja() {
  const contato = getContato();

  return (
    <section id="contato" aria-labelledby="visite-titulo" className="section-y">
      <div className="container-site grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-stretch lg:gap-16">
        <div className="flex flex-col">
          <Reveal>
            <h2 id="visite-titulo" className="text-h2 text-ink">
              Visite a loja
            </h2>
            <p className="mt-4 max-w-[40ch] text-body-lg text-muted">
              Venha conhecer, tirar dúvidas no balcão ou retirar seu pedido.
            </p>
          </Reveal>

          <dl className="mt-8 divide-y divide-line border-y border-line">
            <Reveal className={linha} atraso={60} as="div">
              <dt className={rotulo + " sm:pt-1"}>Endereço</dt>
              {/* TODO: dado real. Endereço tirado do site atual; confirmar número e CEP. */}
              <dd className="text-body text-ink">{contato.endereco}</dd>
            </Reveal>

            <Reveal className={linha} atraso={120} as="div">
              <dt className={rotulo + " sm:pt-1"}>Horário</dt>
              <dd>
                <QuadroHorarios />
              </dd>
            </Reveal>

            <Reveal className={linha} atraso={180} as="div">
              <dt className={rotulo + " sm:pt-1"}>Contato</dt>
              <dd className="flex flex-col items-start gap-1">
                <a href={contato.telefoneLink} className={link}>
                  {contato.telefone}
                </a>
                <a href={`mailto:${contato.email}`} className={link}>
                  {contato.email}
                </a>
              </dd>
            </Reveal>
          </dl>

          <Reveal className="mt-8 lg:mt-auto lg:pt-8" atraso={240}>
            <Button href={contato.mapsUrl} variante="primario" tamanho="lg" className="group/rota w-full sm:w-auto">
              Como chegar
              <ArrowUpRight aria-hidden className="size-5 transition-transform duration-200 group-hover/rota:translate-x-0.5 group-hover/rota:-translate-y-0.5" />
            </Button>
          </Reveal>
        </div>

        {/* Mapa solto, sem moldura: no desktop acompanha a altura da coluna do texto. */}
        <Reveal className="foto-revela relative min-h-80 overflow-hidden rounded-photo lg:min-h-[440px]" atraso={120}>
          <iframe
            src={contato.mapsEmbedUrl}
            title="Mapa com a localização da Multsystems em Itatiba"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="absolute inset-0 block size-full"
          />
        </Reveal>
      </div>
    </section>
  );
}
