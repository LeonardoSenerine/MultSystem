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
  principal?: boolean;
};

// TODO: fotos de banco de imagens (origem em public/img/FONTES.md). Trocar por fotos da loja
// (vendedor atendendo empresa, cliente no balcão, bancada da Total Tech) quando a Multsystems enviar.

export function Caminhos() {
  // Empresa vem primeiro: é quem mais fatura. Só ela tem o botão azul cheio (ação principal).
  const caminhos: Caminho[] = [
    {
      titulo: "Orçamento para empresa",
      texto: "Somos especializados em B2B: cotação com nota fiscal, condição especial e um vendedor que acompanha o pedido.",
      acao: "Pedir orçamento",
      href: "#orcamento",
      imagem: "/img/caminhos/empresa.jpg",
      alt: "Dois profissionais conversando sobre uma proposta num notebook",
      principal: true,
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
                  className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-white transition-[transform,box-shadow,border-color] duration-300 ease-out hover:border-[#c7d2ea] lg:hover:-translate-y-0.5 lg:hover:shadow-card"
                >
                  <span className="relative block aspect-[3/2] overflow-hidden bg-tint">
                    <span className="foto-assenta absolute inset-0">
                      <Image
                        src={c.imagem}
                        alt={c.alt}
                        fill
                        quality={85}
                        sizes="(min-width: 1200px) 384px, (min-width: 768px) 32vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                      />
                    </span>
                  </span>

                  <span className="flex flex-1 flex-col p-5 lg:p-7">
                    <h3 className="text-h3 text-ink">{c.titulo}</h3>
                    <p className="mt-2 flex-1 text-body text-muted">{c.texto}</p>
                    {c.principal ? (
                      <span className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-btn bg-brand px-5 text-[15px] leading-5 font-bold text-white transition-colors group-hover:bg-[#263b73]">
                        {c.acao}
                        <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </span>
                    ) : (
                      <span className="mt-6 inline-flex min-h-11 items-center gap-2 self-start text-[15px] leading-5 font-bold text-brand">
                        {c.acao}
                        <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </span>
                    )}
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
