import Image from "next/image";
import { Button } from "@/components/Button";
import { WhatsAppIcon } from "@/components/icones-marca";
import { Reveal } from "@/components/Reveal";
import { getContato } from "@/lib/dados";
import { mensagens, whatsappLink } from "@/lib/whatsapp";

const passos = [
  { titulo: "Fale com a gente", detalhe: "Pelo WhatsApp ou direto no balcão da loja." },
  { titulo: "Avaliação em 24h", detalhe: "A avaliação do técnico é paga. Depois dela, ele manda o orçamento do conserto." },
  { titulo: "Você aprova", detalhe: "O conserto só começa com o seu ok." },
  { titulo: "Retire com garantia", detalhe: "O serviço sai daqui com 90 dias de garantia." },
];

export function Assistencia() {
  const contato = getContato();
  const href = whatsappLink(contato.whatsappTotalTech, mensagens.totalTech);

  return (
    <section id="assistencia" aria-labelledby="assistencia-titulo" className="on-dark section-y bg-navy text-white">
      {/* No desktop a foto estica até a altura do texto: as duas colunas começam e terminam juntas. */}
      <div className="container-site grid gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-16">
        {/* TODO: foto de banco de imagens (origem em public/img/FONTES.md). Trocar pela foto real
            da bancada da Total Tech quando a Multsystems enviar (mínimo 1600 px). */}
        <Reveal className="foto-revela relative aspect-[4/3] overflow-hidden rounded-photo lg:aspect-auto lg:min-h-[520px]">
          <Image
            src="/img/bancada.jpg"
            alt="Técnico de bancada soldando uma placa de circuito"
            fill
            quality={85}
            sizes="(min-width: 1200px) 568px, (min-width: 1024px) 46vw, 100vw"
            className="object-cover"
          />
        </Reveal>

        <Reveal className="flex flex-col justify-center" atraso={120}>
          <p className="text-eyebrow text-brand-light">Assistência técnica</p>
          <h2 id="assistencia-titulo" className="mt-3 text-h2 text-balance">
            Seu equipamento parou? A Total Tech resolve.
          </h2>
          <p className="mt-4 max-w-[46ch] text-body-lg text-white/85">
            A assistência parceira funciona dentro da nossa loja. Você traz o notebook ou o PC, o técnico faz a avaliação (que é paga) e envia o orçamento do conserto.
          </p>

          {/* Passos numerados, todos com a mesma estrutura: número e título na mesma linha de base. */}
          <ol className="mt-10 grid gap-x-10 gap-y-7 border-t border-white/15 pt-8 sm:grid-cols-2">
            {passos.map((p, i) => (
              <li key={p.titulo} className="grid grid-cols-[2rem_1fr] gap-x-3">
                <span aria-hidden className="text-h3 font-extrabold text-brand-light tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-h3">{p.titulo}</span>
                <span className="col-start-2 mt-1 text-small text-white/75">{p.detalhe}</span>
              </li>
            ))}
          </ol>

          <div className="mt-10">
            <Button href={href} variante="whatsapp" tamanho="lg" className="w-full sm:w-auto" icone={<WhatsAppIcon className="size-5" />}>
              Falar com a Total Tech
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
