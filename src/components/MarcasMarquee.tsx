import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { marcas } from "@/data/marcas";

const ALTURA = 40;

function Faixa({ oculta = false }: { oculta?: boolean }) {
  return (
    <ul
      aria-hidden={oculta || undefined}
      className="marquee-copia flex shrink-0 items-center gap-16 pr-16 lg:gap-24 lg:pr-24"
    >
      {marcas.map((m) => {
        // Logos quadrados (Dell, HP) somem ao lado dos que são só texto: ganham mais altura
        // para terem o mesmo peso visual.
        const quadrado = m.largura / m.altura < 1.5;
        return (
          <li key={m.nome} className="shrink-0">
            <Image
              src={`/img/marcas/${m.arquivo}`}
              alt={oculta ? "" : m.nome}
              width={Math.round((m.largura / m.altura) * ALTURA)}
              height={ALTURA}
              unoptimized
              className={quadrado ? "h-12 w-auto lg:h-14" : "h-8 w-auto lg:h-10"}
            />
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Carrossel de marcas que roda sozinho, em loop contínuo, com os logos nas cores originais.
 * É só um detalhe da página: não pausa no hover nem no toque.
 * A lista é renderizada duas vezes e a faixa anda de 0 a -50%: no fim da primeira cópia a
 * segunda está exatamente onde a primeira começou, então o loop não dá salto.
 * Com prefers-reduced-motion vira um scroll normal.
 */
export function MarcasMarquee() {
  return (
    <Reveal className="mt-20 lg:mt-32">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <p className="text-h3 text-ink">Trabalhamos com as principais marcas</p>
        <p className="text-small text-muted">Produtos originais, com garantia do fabricante</p>
      </div>

      <div className="marquee mt-10 overflow-hidden py-4 lg:mt-14" role="group" aria-label="Marcas que vendemos">
        <div className="marquee-track flex w-max">
          <Faixa />
          <Faixa oculta />
        </div>
      </div>
    </Reveal>
  );
}
