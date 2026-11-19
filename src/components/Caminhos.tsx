import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";

type Caminho = {
  titulo: string;
  texto: string;
  acao: string;
  href: string;
  imagem: string;
  alt: string;
};

// TODO: fotos de banco de imagens (origem em public/img/FONTES.md). Trocar por fotos da loja
// (vendedor atendendo empresa, cliente no balcão, bancada da Total Tech) quando a Multsystems enviar.

export function Caminhos() {
  // Empresa vem primeiro: é quem mais fatura. Os três cards têm o mesmo estilo.
  const caminhos: Caminho[] = [
    {
      titulo: "Orçamento para empresa",
      texto: "Somos especializados em B2B: cotação com nota fiscal, condição especial e um vendedor que acompanha o pedido.",
      acao: "Pedir orçamento",
      href: "#orcamento",
      imagem: "/img/caminhos/empresa.jpg",
      alt: "Dois profissionais conversando sobre uma proposta num notebook",
    },
    {
      titulo: "Comprar para casa",
      texto: "Notebooks, impressoras e acessórios com preço no site. Você compra pelo WhatsApp e retira na loja.",
      acao: "Ver produtos",
      href: "/produtos",
      imagem: "/img/caminhos/casa.jpg",
      alt: "Pai e filho no sofá usando um notebook",
    },
    {
      titulo: "Assistência técnica",
      texto: "Conserto de notebooks e PCs com a Total Tech, que atende aqui dentro da loja. Veja como funciona antes de chamar.",
      acao: "Ver a assistência técnica",
      href: "/assistencia",
      imagem: "/img/caminhos/assistencia.jpg",
      alt: "Técnico instalando uma placa dentro de um computador",
    },
  ];

  return (
    <section aria-labelledby="caminhos-titulo" className="section-y bg-tint">
      <div className="container-site">
        <Reveal>
          <h2 id="caminhos-titulo" className="text-center text-h2 text-ink">
            Como podemos ajudar?
          </h2>
        </Reveal>

        <ul className="mt-6 grid gap-4 md:grid-cols-3 lg:mt-12 lg:gap-6">
          {caminhos.map((c, i) => {
            return (
              <Reveal as="li" key={c.titulo} atraso={i * 110}>
                <Link
                  href={c.href}
                  className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-white transition-[transform,box-shadow,border-color] duration-300 ease-out hover:border-[#c7d2ea] max-md:flex-row lg:hover:-translate-y-0.5 lg:hover:shadow-card"
                >
                  {/* No celular o card vira uma linha (foto pequena + texto), para os 3 caberem numa tela só. */}
                  <span className="relative block aspect-[3/2] overflow-hidden bg-tint max-md:aspect-auto max-md:w-[104px] max-md:shrink-0">
                    <span className="foto-assenta absolute inset-0">
                      <Image
                        src={c.imagem}
                        alt={c.alt}
                        fill
                        quality={85}
                        sizes="(min-width: 1200px) 384px, (min-width: 768px) 32vw, 104px"
                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                      />
                    </span>
                  </span>

                  <span className="flex min-w-0 flex-1 flex-col p-5 max-md:p-4 lg:p-7">
                    <h3 className="text-h3 text-ink max-md:text-[17px] max-md:leading-6">{c.titulo}</h3>
                    <p className="mt-2 flex-1 text-body text-muted max-md:mt-1 max-md:line-clamp-3 max-md:text-small">{c.texto}</p>
                    <span className="mt-6 max-md:mt-2 inline-flex min-h-11 items-center gap-2 self-start text-[15px] leading-5 font-bold text-brand">
                      {c.acao}
                      <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
