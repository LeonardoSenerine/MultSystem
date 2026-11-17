import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/Button";
import { WhatsAppIcon } from "@/components/icones-marca";
import { Reveal } from "@/components/Reveal";
import { CardProduto } from "@/components/catalogo/CardProduto";
import { destaques } from "@/data/produtos";
import { catalogoUrl, getProdutos } from "@/lib/catalogo";
import { getContato, getDestaques } from "@/lib/dados";
import { formatarPreco } from "@/lib/formato";
import { mensagemProduto, whatsappLink } from "@/lib/whatsapp";
import type { Produto } from "@/types";

/** Card da reserva de exemplo (só aparece se a API do catálogo estiver fora do ar). */
function CardExemplo({ produto, whatsapp }: { produto: Produto; whatsapp: string }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-white transition-[transform,box-shadow] duration-300 ease-out lg:hover:-translate-y-0.5 lg:hover:shadow-card">
      <div className="relative aspect-square overflow-hidden bg-white">
        {produto.imagem ? (
          <Image
            src={produto.imagem}
            alt={produto.nome}
            fill
            sizes="(min-width: 1200px) 270px, (min-width: 1024px) 22vw, 50vw"
            className="object-contain p-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 lg:p-6"
          />
        ) : (
          <div className="grid h-full place-items-center bg-tint">
            <Package aria-hidden strokeWidth={1.5} className="size-12 text-brand" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col border-t border-line p-3 lg:p-5">
        <p className="flex items-center justify-between gap-2 text-eyebrow text-muted">
          <span className="text-brand">{produto.marca}</span>
          <span className="font-medium tracking-normal normal-case">Cód. {produto.codigo}</span>
        </p>
        <h3 className="mt-1 line-clamp-3 text-[15px] leading-5 font-semibold text-ink lg:text-body">{produto.nome}</h3>

        <div className="mt-auto pt-3">
          <p className="text-[20px] leading-7 font-extrabold tracking-tight text-ink lg:text-[22px]">
            {formatarPreco(produto.preco)}
          </p>
          <p className="text-small text-muted">com nota fiscal</p>
        </div>

        <Button
          href={whatsapp}
          variante="whatsapp"
          larguraTotal
          className="mt-3"
          icone={<WhatsAppIcon className="size-[18px]" />}
          aria-label={`Comprar ${produto.nome} pelo WhatsApp`}
        >
          Comprar
        </Button>
      </div>
    </article>
  );
}

export async function MaisVendidos() {
  const [produtos, contato, catalogo] = [await getDestaques(), getContato(), await getProdutos()];
  // Os destaques reais usam o mesmo card do catálogo (coração e carrinho), com o nome escrito à mão.
  const porCodigo = new Map(catalogo.map((p) => [p.codigo, p]));
  const reais = destaques.flatMap((d) => {
    const p = porCodigo.get(d.codigo);
    return p ? [{ ...p, nome: d.nome }] : [];
  });

  return (
    // O cliente confirmou que o título "Mais vendidos" fica. A lista ainda é uma escolha da equipe, sem dado de vendas (TODO: pedir à loja a lista real).
    <section id="mais-vendidos" aria-labelledby="mais-vendidos-titulo" className="section-y bg-tint">
      <Reveal className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <div>
            <h2 id="mais-vendidos-titulo" className="text-h2 text-ink">
              Mais vendidos
            </h2>
            <p className="mt-2 text-body text-muted">
              Em até 3x sem juros no cartão. Adicione ao carrinho direto daqui ou toque no coração para guardar.
            </p>
          </div>
          <Link
            href={catalogoUrl}
            className="group inline-flex min-h-11 items-center gap-2 text-[15px] leading-5 font-bold text-brand"
          >
            Ver todos os produtos
            <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <ul className="mt-5 grid grid-cols-1 gap-3 min-[460px]:grid-cols-2 lg:mt-10 lg:grid-cols-4 lg:gap-6">
          {reais.length >= 4
            ? reais.slice(0, 8).map((p, i) => (
                // No celular (uma coluna) mostra só os 4 primeiros, para a lista não ficar longa.
                <Reveal as="li" key={p.codigo} atraso={(i % 4) * 70} className={i >= 4 ? "max-[459px]:hidden" : ""}>
                  <CardProduto produto={p} />
                </Reveal>
              ))
            : produtos.map((p, i) => (
                <Reveal as="li" key={p.codigo} atraso={(i % 4) * 70}>
                  <CardExemplo produto={p} whatsapp={whatsappLink(contato.whatsapp, mensagemProduto(p))} />
                </Reveal>
              ))}
        </ul>
      </Reveal>
    </section>
  );
}
