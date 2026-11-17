import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { Contador } from "@/components/sobre/Contador";
import { provas } from "@/components/Sobre";

/**
 * "Quem somos" da página Sobre: foto da loja à esquerda e o texto à direita, na mesma altura,
 * e as quatro provas numa faixa de quatro células iguais logo abaixo.
 */
export function QuemSomos() {
  return (
    <section aria-labelledby="sobre-titulo" className="section-y">
      <div className="container-site">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-16">
          {/* TODO: trocar pela foto real da equipe e da loja quando a Multsystems enviar. */}
          <Reveal className="foto-revela relative aspect-[4/3] overflow-hidden rounded-photo lg:aspect-auto lg:min-h-[420px]">
            <Image
              src="/img/fachada.jpg"
              alt="Fachada da loja Multsystems, no Centro de Itatiba"
              fill
              quality={85}
              sizes="(min-width: 1200px) 568px, (min-width: 1024px) 46vw, 100vw"
              className="object-cover"
            />
          </Reveal>

          <Reveal className="flex flex-col justify-center" atraso={100}>
            <p className="text-eyebrow text-brand">Quem somos</p>
            <h2 id="sobre-titulo" className="mt-2 text-h2 text-balance text-ink">
              <Contador valor={31} /> anos vendendo informática em Itatiba
            </h2>
            {/* TODO: dado real. Texto escrito só com o que já sabemos da empresa; pedir à Multsystems
                a história (quem fundou, como começou) para completar este bloco. */}
            <div className="mt-5 space-y-4 text-body-lg text-ink">
              <p>
                A Multsystems é uma loja de informática no Centro de Itatiba. Hoje a maior parte do nosso trabalho é com
                empresas: equipar escritórios, montar redes, instalar câmeras e manter tudo funcionando, com nota fiscal e um
                vendedor que acompanha o pedido do começo ao fim.
              </p>
              <p className="text-muted">
                A porta continua aberta para quem compra para casa. Você vê o produto no balcão, tira a dúvida com quem vende e,
                se algo der problema, a Total Tech conserta aqui mesmo.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Quatro células do mesmo tamanho, separadas por uma linha fina. */}
        <ul className="mt-10 grid gap-px overflow-hidden rounded-card bg-line ring-1 ring-line sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {provas.map((p, i) => (
            <Reveal as="li" key={p.titulo} atraso={i * 80} className="group bg-white p-5 transition-colors duration-300 hover:bg-tint lg:p-6">
              <h3 className="text-h3 text-ink transition-colors group-hover:text-brand">{p.titulo}</h3>
              <p className="mt-2 text-small text-muted">{p.texto}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
