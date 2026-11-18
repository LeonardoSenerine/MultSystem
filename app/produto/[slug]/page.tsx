import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { EventoNaTela } from "@/components/analytics/EventoNaTela";
import { Button } from "@/components/Button";
import { BotaoFavorito } from "@/components/carrinho/BotaoFavorito";
import { ControleCarrinho } from "@/components/carrinho/ControleCarrinho";
import { CardProduto, resumo } from "@/components/catalogo/CardProduto";
import { FotoProduto } from "@/components/catalogo/FotoProduto";
import { WhatsAppIcon } from "@/components/icones-marca";
import { Migalhas } from "@/components/Migalhas";
import { BarraCompraFixa } from "@/components/produto/BarraCompraFixa";
import { CompartilharProduto } from "@/components/produto/CompartilharProduto";
import { FotoZoom } from "@/components/produto/FotoZoom";
import { Reveal } from "@/components/Reveal";
import { departamentos } from "@/data/departamentos";
import { tipoDoDepartamento } from "@/data/orcamento";
import { codigoDoSlug, getProdutos, nomeDaMarca } from "@/lib/catalogo";
import { getContato } from "@/lib/dados";
import { descontoPix, formatarPreco, parcelaEm3x, quebravel } from "@/lib/formato";
import { sugerirComplementares } from "@/lib/sugestoes";
import { mensagemProduto, whatsappLink } from "@/lib/whatsapp";

async function buscar(slug: string) {
  const produtos = await getProdutos();
  const codigo = codigoDoSlug(slug);
  const produto = produtos.find((p) => p.codigo === codigo);
  return { produto, produtos };
}

/** Pré-gera os primeiros produtos no build; os outros são gerados na primeira visita. */
export async function generateStaticParams() {
  const produtos = await getProdutos();
  const alguns = produtos.filter((p) => p.temFoto).slice(0, 12);
  return (alguns.length ? alguns : [{ slug: "produto-0" }]).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/produto/[slug]">): Promise<Metadata> {
  const { produto } = await buscar((await params).slug);
  if (!produto) return { title: "Produto não encontrado" };
  return {
    title: produto.nome,
    description: `${produto.nome} por ${formatarPreco(produto.preco)}, em até 3x sem juros, com nota fiscal e retirada na loja da Multsystems em Itatiba.`,
    alternates: { canonical: `/produto/${produto.slug}` },
    openGraph: produto.temFoto ? { images: [produto.imagem] } : undefined,
  };
}

// Vantagens de comprar na Multsystems. Só o que o site já afirma (nota fiscal, retirada na loja,
// entrega combinada, garantia). Frete e prazo "a combinar" confirmados pelo cliente em 17/11/2026. TODO: confirmar a política de troca.
const vantagens = [
  { titulo: "Retire na loja", texto: "Centro de Itatiba, sem pagar frete." },
  { titulo: "Nota fiscal", texto: "Para pessoa física e para CNPJ." },
  { titulo: "Entrega", texto: "Frete e prazo combinados com o vendedor." },
  { titulo: "Garantia", texto: "Do fabricante, com suporte no balcão." },
] as const;

async function ProdutoConteudo({ params }: PageProps<"/produto/[slug]">) {
  const { slug } = await params;
  const { produto, produtos } = await buscar(slug);
  if (!produto) notFound();

  const contato = getContato();
  const depto = departamentos.find((d) => d.slug === produto.departamento);
  const subcategoria = depto?.subcategorias.find((s) => s.slug === produto.subcategoria);
  const marca = nomeDaMarca.get(produto.marca);
  const desconto = descontoPix(produto.preco, produto.precoOriginal);
  const dados = resumo(produto);
  const parecidos = produtos
    .filter((p) => p.subcategoria === produto.subcategoria && p.codigo !== produto.codigo)
    .sort((a, b) => Number(b.temFoto) - Number(a.temFoto) || Math.abs(a.preco - produto.preco) - Math.abs(b.preco - produto.preco))
    .slice(0, 4);

  const complementares = sugerirComplementares(produto, produtos, 4);

  const urlOrcamento = `/orcamento?${new URLSearchParams({
    produto: `${produto.nome} (cód. ${produto.codigo})`,
    tipo: tipoDoDepartamento(produto.departamento),
  }).toString()}#orcamento`;

  const ficha: [string, React.ReactNode][] = [
    ["Código", produto.codigo],
    // O sistema da loja às vezes traz "SEM GTIN" no lugar do código de barras: só mostra quando é número.
    ...(/^\d{8,14}$/.test(produto.sku) ? ([["Código de barras", produto.sku]] as [string, string][]) : []),
    ...(marca ? ([["Marca", marca]] as [string, string][]) : []),
    ...(depto
      ? ([["Departamento", <Link key="d" href={`/categoria/${depto.slug}`} className="sublinha hover:text-brand">{depto.nome}</Link>]] as [string, React.ReactNode][])
      : []),
    ...(depto && subcategoria
      ? ([["Categoria", <Link key="c" href={`/categoria/${depto.slug}?sub=${subcategoria.slug}`} className="sublinha hover:text-brand">{subcategoria.nome}</Link>]] as [string, React.ReactNode][])
      : []),
    ["Disponibilidade", produto.estoque > 0 ? "Em estoque na loja de Itatiba" : "Consultar com o vendedor"],
  ];

  // Dados estruturados para o Google mostrar preço e disponibilidade na busca.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: produto.nome,
    sku: produto.codigo,
    ...(marca ? { brand: { "@type": "Brand", name: marca } } : {}),
    ...(produto.temFoto ? { image: produto.imagem } : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: produto.preco.toFixed(2),
      availability: produto.estoque > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `https://www.multsystems.com.br/produto/${produto.slug}`,
      seller: { "@type": "Organization", name: "Multsystems" },
    },
  };

  return (
    <div className="bg-tint pb-24 lg:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <EventoNaTela nome="ver_produto" dados={{ codigo: produto.codigo, nome: produto.nome, preco: produto.preco, departamento: produto.departamento }} />
      <div className="container-site pt-4 pb-16 lg:pt-6 lg:pb-24">
        <Migalhas
          itens={[
            { nome: "Início", href: "/" },
            { nome: "Produtos", href: "/produtos" },
            ...(depto ? [{ nome: depto.nome, href: `/categoria/${depto.slug}` }] : []),
            ...(depto && subcategoria ? [{ nome: subcategoria.nome, href: `/categoria/${depto.slug}?sub=${subcategoria.slug}` }] : []),
          ]}
        />

        <article className="mt-3 grid gap-6 rounded-card bg-white p-4 ring-1 ring-line md:grid-cols-2 md:grid-rows-[auto_1fr] md:gap-y-4 lg:mt-4 lg:gap-x-12 lg:p-10">
          {/* No celular a ordem é foto, preço e compra, e só depois os quadros (retirada, nota, entrega, garantia);
              do tablet para cima os quadros ficam embaixo da foto, na coluna da esquerda. */}
          <div className="md:col-start-1 md:row-start-1">
            <div className="relative">
              <FotoZoom className="relative aspect-[5/4] overflow-hidden rounded-card bg-white ring-1 ring-line/70 md:aspect-square">
                <FotoProduto src={produto.imagem} alt={produto.nome} temFoto={produto.temFoto} sizes="(min-width: 1024px) 520px, (min-width: 768px) 45vw, 100vw" preload className="p-6" />
              </FotoZoom>
              <BotaoFavorito produto={dados} className="absolute top-3 right-3 z-10" />
            </div>
          </div>

          <div className="flex flex-col md:col-start-2 md:row-span-2 md:row-start-1">
            {marca && <p className="text-eyebrow text-brand">{marca}</p>}
            <h1 className="mt-2 text-[24px] leading-8 font-bold tracking-tight text-ink lg:text-[30px] lg:leading-10">{quebravel(produto.nome)}</h1>
            <p className="mt-2 text-small text-muted">Cód. {produto.codigo}</p>

            <div id="bloco-compra" className="mt-6 border-t border-line pt-6">
              {desconto > 0 && <p className="text-body text-muted line-through">{formatarPreco(produto.precoOriginal)}</p>}
              <p className="flex flex-wrap items-baseline gap-x-3">
                <span className="text-[36px] leading-[44px] font-extrabold tracking-tight text-ink">{formatarPreco(produto.preco)}</span>
                {desconto > 0 && <span className="text-body font-bold text-[#00875a]">{desconto}% OFF</span>}
              </p>
              <p className="mt-1 text-small text-muted">
                ou <strong className="font-bold text-ink">{parcelaEm3x(produto.preco)}</strong> sem juros no cartão. Nota fiscal em toda venda.
              </p>
              <p className="mt-4 inline-flex items-center gap-2 text-small font-semibold text-[#00875a]">
                <span aria-hidden className="size-2 rounded-full bg-[#00a86b]" />
                {produto.estoque === 1
                  ? "Última unidade na loja de Itatiba"
                  : produto.estoque > 0 && produto.estoque <= 3
                  ? `Últimas ${produto.estoque} unidades na loja de Itatiba`
                  : produto.estoque > 0
                    ? `${produto.estoque} em estoque na loja de Itatiba`
                    : "Consulte a disponibilidade"}
              </p>

              <div className="mt-6 grid gap-3">
                <ControleCarrinho produto={dados} grande />
                <Button
                  href={whatsappLink(contato.whatsapp, mensagemProduto(produto))}
                  variante="whatsapp"
                  tamanho="lg"
                  className="w-full"
                  icone={<WhatsAppIcon className="size-5" />}
                >
                  Comprar pelo WhatsApp
                </Button>
              </div>
              <p className="mt-3 text-[13px] leading-[18px] text-muted">
                Toque no coração para guardar e acompanhar se o preço baixa ou sobe. Dúvidas sobre pagamento e entrega?{" "}
                <Link href="/como-comprar" className="font-bold text-brand hover:underline">
                  Veja como comprar
                </Link>
                .
              </p>
            </div>

            <div className="mt-6 border-t border-line pt-4">
              <CompartilharProduto nome={produto.nome} />
            </div>

          </div>
          <ul className="grid gap-px overflow-hidden rounded-card bg-line ring-1 ring-line sm:grid-cols-2 md:col-start-1 md:row-start-2 md:self-start">
              {vantagens.map((v) => (
                <li key={v.titulo} className="bg-white p-4 transition-colors duration-300 hover:bg-tint">
                  <p className="text-[15px] leading-5 font-extrabold text-ink">{v.titulo}</p>
                  <p className="mt-1 text-[13px] leading-[18px] text-muted">{v.texto}</p>
                </li>
              ))}
            </ul>
        </article>

        <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-8">
          <Reveal as="section" aria-labelledby="ficha-titulo" className="rounded-card bg-white p-5 ring-1 ring-line lg:p-8">
            <h2 id="ficha-titulo" className="text-h3 text-ink lg:text-[22px] lg:leading-7">
              Ficha do produto
            </h2>
            <dl className="mt-4 divide-y divide-line border-y border-line">
              {ficha.map(([nome, valor]) => (
                <div key={nome} className="grid grid-cols-[8.5rem_1fr] gap-4 py-3 text-body">
                  <dt className="text-muted">{nome}</dt>
                  <dd className="font-semibold text-ink">{valor}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-small text-muted">
              Precisa de mais detalhes (especificações, compatibilidade)? O vendedor responde pelo WhatsApp antes de você fechar.
            </p>
          </Reveal>

          {/* Compra para empresa: leva o produto já escrito para o pedido de orçamento. */}
          <Reveal as="section" aria-labelledby="empresa-titulo" atraso={100} className="on-dark flex flex-col self-start rounded-card bg-brand p-5 text-white lg:p-8">
            <p className="text-eyebrow text-white/70">Compra para empresa</p>
            <h2 id="empresa-titulo" className="mt-2 text-h3 text-balance lg:text-[22px] lg:leading-7">
              Precisa de mais de uma unidade?
            </h2>
            <p className="mt-3 text-body text-white/85">
              Peça um orçamento deste produto com nota no CNPJ e condição para compra em quantidade. Um vendedor responde em horário comercial.
            </p>
            <Link
              href={urlOrcamento}
              className="group mt-6 inline-flex min-h-12 items-center justify-center gap-2 self-start rounded-btn bg-white px-5 font-bold text-navy transition-[background-color,transform] hover:bg-tint active:scale-[0.98]"
            >
              Pedir orçamento deste produto
              <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>

        {complementares.length > 0 && (
          <section aria-labelledby="complete-titulo" className="mt-12 lg:mt-16">
            <h2 id="complete-titulo" className="text-h3 text-ink lg:text-[24px] lg:leading-8">
              Complete a sua compra
            </h2>
            <p className="mt-1 text-small text-muted">Combina com este produto e já está em estoque na loja.</p>
            <ul className="mt-4 grid grid-cols-1 gap-3 min-[460px]:grid-cols-2 min-[460px]:gap-2.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {complementares.map((p) => (
                <li key={p.codigo}>
                  <CardProduto produto={p} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {parecidos.length > 0 && (
          <section aria-labelledby="parecidos-titulo" className="mt-12 lg:mt-16">
            <h2 id="parecidos-titulo" className="text-h3 text-ink lg:text-[24px] lg:leading-8">
              Produtos parecidos
            </h2>
            <ul className="mt-4 grid grid-cols-1 gap-3 min-[460px]:grid-cols-2 min-[460px]:gap-2.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {parecidos.map((p) => (
                <li key={p.codigo}>
                  <CardProduto produto={p} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <BarraCompraFixa produto={dados} />
    </div>
  );
}

/** Esqueleto enquanto o produto carrega (o slug é lido dentro do Suspense). */
function ProdutoEsqueleto() {
  return (
    <div className="bg-tint">
      <div className="container-site pt-4 pb-16 lg:pt-6" aria-busy="true" aria-label="Carregando produto">
        <div className="h-11 w-64 rounded bg-white/70" />
        <div className="mt-3 grid animate-pulse gap-6 rounded-card bg-white p-4 ring-1 ring-line md:grid-cols-2 lg:p-10">
          <div className="aspect-square rounded-card bg-tint/60" />
          <div className="space-y-4">
            <div className="h-4 w-24 rounded bg-tint" />
            <div className="h-9 rounded bg-tint" />
            <div className="h-12 w-1/2 rounded bg-tint" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProdutoPage(props: PageProps<"/produto/[slug]">) {
  return (
    <Suspense fallback={<ProdutoEsqueleto />}>
      <ProdutoConteudo {...props} />
    </Suspense>
  );
}
