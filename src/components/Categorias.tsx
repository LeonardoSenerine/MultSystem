import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { catalogoUrl } from "@/lib/catalogo";
import { getDepartamentosDaHome } from "@/lib/dados";

// Celular: carrossel com metade do próximo card aparecendo. Desktop: grade de 4 colunas.
const itemClasse = "w-[72%] shrink-0 snap-start sm:w-[46%] md:w-[32%] lg:w-auto";
const tamanhos = "(min-width: 1200px) 282px, (min-width: 1024px) 23vw, (min-width: 768px) 32vw, (min-width: 640px) 46vw, 72vw";
const fotoClasse =
  "object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]";

export function Categorias() {
  const categorias = getDepartamentosDaHome();

  return (
    <section id="categorias" aria-labelledby="categorias-titulo" className="section-y">
      <div className="container-site">
        <Reveal>
          <p className="text-eyebrow text-brand">Categorias</p>
          <h2 id="categorias-titulo" className="mt-2 text-h2 text-ink">
            O que você procura?
          </h2>
        </Reveal>

        <ul
          className="-mx-4 mt-6 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:-mx-6 md:scroll-px-6 md:px-6 lg:mx-0 lg:mt-12 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden"
          aria-label="Categorias de produtos"
        >
          {categorias.map((c, i) => (
            <Reveal as="li" key={c.slug} className={itemClasse} atraso={(i % 4) * 80}>
              <Link
                href={`/categoria/${c.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-card bg-tint transition-transform duration-300 ease-out lg:hover:-translate-y-0.5"
              >
                {c.imagem && (
                  <span className="foto-assenta absolute inset-0">
                    <Image src={c.imagem} alt="" fill quality={85} sizes={tamanhos} className={fotoClasse} />
                  </span>
                )}

                {/* Véu navy só na parte de baixo, para o texto ficar legível sobre qualquer foto. */}
                <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/55 via-50% to-transparent" />

                <span className="absolute inset-x-0 bottom-0 p-4 text-white lg:p-5">
                  <span className="flex items-center justify-between gap-3">
                    <span className="text-h3">{c.nome}</span>
                    <ArrowRight
                      aria-hidden
                      className="size-5 shrink-0 text-white/80 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white"
                    />
                  </span>
                  <span className="mt-1 block pr-8 text-small text-white/80">{c.descricao}</span>
                </span>
              </Link>
            </Reveal>
          ))}
          <Reveal as="li" className={itemClasse} atraso={240}>
            <Link
              href={catalogoUrl}
              className="group relative block aspect-[4/5] overflow-hidden rounded-card bg-brand text-white transition-transform duration-300 ease-out lg:hover:-translate-y-0.5"
            >
              <span className="foto-assenta absolute inset-0">
                <Image src="/img/categorias/todas.jpg" alt="" fill quality={85} sizes={tamanhos} className={fotoClasse} />
              </span>
              {/* Véu azul da marca por inteiro, para o card continuar lendo como "ação". */}
              <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-brand via-brand/80 to-brand/40" />
              <span className="absolute inset-0 flex flex-col justify-between p-4 lg:p-5">
                <span>
                  <span className="block text-h3">Ver todas as categorias</span>
                  <span className="mt-2 block text-small text-white/85">
                    Peças, cabos, automação comercial e tudo o que não coube aqui.
                  </span>
                </span>
                <span className="inline-flex items-center gap-2 text-[15px] leading-5 font-bold">
                  Ver todos os produtos
                  <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </span>
            </Link>
          </Reveal>
        </ul>
      </div>
    </section>
  );
}
