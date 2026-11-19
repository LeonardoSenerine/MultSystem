import Image from "next/image";
import { Building2, Headset, MapPin, Star, Store, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { getContato } from "@/lib/dados";

type Prova = { titulo: string; texto: string };

// Para cada número aparecer uma vez só (regra 6.2): "31 anos" vive no título daqui,
// "desde 1995" no selo do hero e o "5.0" nesta lista.
export const provas: Prova[] = [
  { titulo: "Atendimento para empresas", texto: "Cotação com nota no CNPJ, faturamento e entrega em Itatiba e região." },
  { titulo: "Loja física no Centro", texto: "Atendimento no balcão, retirada na loja e suporte presencial." },
  // TODO: dado real. Confirmar a nota no Mercado Livre antes de publicar.
  { titulo: "5.0 no Mercado Livre", texto: "Nota dada pelos próprios clientes na nossa loja oficial." },
  { titulo: "Pós-venda de verdade", texto: "Precisou de ajuda depois da compra? Volte ao balcão ou chame no WhatsApp." },
];

// Ícone de cada resumo, na mesma ordem de `provas`.
const icones: LucideIcon[] = [Building2, Store, Star, Headset];

/**
 * Sobre a empresa, sobre o fundo de ondas (aplicado em app/page.tsx): à esquerda a fachada real da loja, solta,
 * só com cantos arredondados e o endereço embaixo; à direita o título, um parágrafo curto e os quatro resumos
 * (ícone + texto, sem cartão). No celular a foto vem primeiro.
 * As marcas e as avaliações entram logo abaixo, na mesma faixa tint.
 */
export function Sobre() {
  const contato = getContato();

  return (
    <div className="container-site grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
      <Reveal as="figure" className="foto-revela">
        <div className="relative aspect-[4/3] overflow-hidden rounded-photo">
          <Image
            src="/img/fachada-noite.jpg"
            alt="Fachada da Multsystems ao anoitecer, com o letreiro iluminado"
            fill
            quality={85}
            sizes="(min-width: 1200px) 568px, (min-width: 1024px) 46vw, 100vw"
            className="object-cover object-[center_40%]"
          />
        </div>
        <figcaption className="mt-3 flex items-center gap-1.5 text-small text-muted">
          <MapPin aria-hidden className="size-4 shrink-0 text-brand" />
          {contato.endereco}
        </figcaption>
      </Reveal>

      <div>
        {/* TODO: dado real. Texto escrito só com o que já sabemos da empresa; pedir à Multsystems
            a história (quem fundou, como começou) para completar este bloco. */}
        <Reveal atraso={100}>
          <p className="text-eyebrow text-brand">Sobre a Multsystems</p>
          <h2 id="sobre-titulo" className="mt-2 text-h2 text-ink text-balance">
            31 anos vendendo informática em Itatiba
          </h2>
          <p className="mt-4 max-w-[48ch] text-body-lg text-muted">
            Hoje a maior parte do trabalho é com empresas: equipar escritórios, montar redes e instalar câmeras. Mas a porta continua
            aberta para quem compra para casa, e a Total Tech conserta aqui mesmo.
          </p>
        </Reveal>

        <ul className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
          {provas.map((p, i) => {
            const Icone = icones[i];
            return (
              <Reveal as="li" key={p.titulo} atraso={150 + i * 80} className="group flex gap-3.5">
                <span
                  aria-hidden
                  className="grid size-10 shrink-0 place-items-center rounded-full bg-brand/10 text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white"
                >
                  <Icone className="size-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-[16px] leading-6 font-bold text-ink">{p.titulo}</h3>
                  <p className="mt-0.5 text-small text-muted">{p.texto}</p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
