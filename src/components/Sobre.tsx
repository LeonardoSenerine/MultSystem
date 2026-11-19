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
 * Sobre a empresa, com fotos: à esquerda uma composição com a fachada real da loja (à noite, com o letreiro
 * aceso), uma foto menor dos produtos sobreposta no canto e a etiqueta do endereço; à direita o título, um
 * parágrafo curto e os quatro resumos com ícone. No celular as fotos vêm primeiro e os resumos viram linhas.
 * As marcas e as avaliações entram logo abaixo, na mesma faixa tint.
 */
export function Sobre() {
  const contato = getContato();

  return (
    <div className="container-site grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
      {/* Composição de fotos. O padding embaixo/à direita abre espaço para a foto menor que "sai" da grande. */}
      <Reveal className="relative pr-6 pb-10 sm:pr-10 sm:pb-14">
        {/* Bloco azul atrás da foto: dá profundidade e puxa a cor da marca. */}
        <span aria-hidden className="absolute top-6 -left-3 h-[calc(100%-4rem)] w-2/3 rounded-photo bg-brand/10 sm:-left-5" />

        <div className="foto-revela relative aspect-[4/3] overflow-hidden rounded-photo shadow-[0_18px_44px_rgb(28_47_92/0.18)]">
          <Image
            src="/img/fachada-noite.jpg"
            alt="Fachada da Multsystems ao anoitecer, com o letreiro iluminado"
            fill
            quality={85}
            sizes="(min-width: 1200px) 560px, (min-width: 1024px) 45vw, 90vw"
            className="object-cover object-[center_40%]"
          />
          {/* Etiqueta do endereço sobre a foto. */}
          <p className="absolute top-3 left-3 inline-flex max-w-[calc(100%-1.5rem)] items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[12px] leading-4 font-semibold text-ink shadow-sm backdrop-blur sm:top-4 sm:left-4 sm:text-[13px]">
            <MapPin aria-hidden className="size-3.5 shrink-0 text-brand" />
            <span className="truncate">{contato.endereco}</span>
          </p>
        </div>

        {/* Foto menor, sobreposta no canto de baixo: os produtos que a loja vende. */}
        <div className="absolute right-0 bottom-0 w-[46%] overflow-hidden rounded-card border-4 border-white bg-white shadow-[0_14px_34px_rgb(28_47_92/0.22)] sm:border-[6px]">
          <div className="relative aspect-[16/10]">
            <Image
              src="/img/vitrine/capa-empresas.jpg"
              alt="Notebook, impressora, roteador e nobreak, produtos vendidos na loja"
              fill
              quality={85}
              sizes="(min-width: 1024px) 260px, 45vw"
              className="object-cover object-[94%_50%]"
            />
          </div>
        </div>
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

        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {provas.map((p, i) => {
            const Icone = icones[i];
            return (
              <Reveal
                as="li"
                key={p.titulo}
                atraso={150 + i * 80}
                className="group flex gap-3.5 rounded-card bg-white p-4 ring-1 ring-line transition-[box-shadow,transform,--tw-ring-color] duration-300 hover:shadow-card hover:ring-brand/30 lg:hover:-translate-y-0.5"
              >
                <span
                  aria-hidden
                  className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-brand text-white shadow-[0_6px_14px_rgb(44_68_130/0.28)] transition-transform duration-300 group-hover:scale-105"
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
