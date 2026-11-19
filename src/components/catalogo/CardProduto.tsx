import Link from "next/link";
import { BotaoFavorito } from "@/components/carrinho/BotaoFavorito";
import { ControleCarrinho } from "@/components/carrinho/ControleCarrinho";
import { FotoProduto } from "@/components/catalogo/FotoProduto";
import { nomeDaMarca } from "@/lib/catalogo";
import { descontoPix, formatarPreco, parcelaEm3x, quebravel } from "@/lib/formato";
import type { ProdutoCatalogo } from "@/types";

const tamanhos = "(min-width: 1200px) 230px, (min-width: 1024px) 20vw, (min-width: 640px) 31vw, 50vw";

/** Dados que o carrinho e os favoritos guardam no navegador. */
export function resumo(produto: ProdutoCatalogo) {
  return {
    codigo: produto.codigo,
    slug: produto.slug,
    nome: produto.nome,
    marca: nomeDaMarca.get(produto.marca) ?? "",
    imagem: produto.imagem,
    temFoto: produto.temFoto,
    preco: produto.preco,
    estoque: produto.estoque,
  };
}

/**
 * Card do catálogo, no modelo de marketplace: foto inteira em fundo branco, marca, nome em
 * duas linhas e o preço em destaque. A foto e o nome levam à página do produto (o link cobre
 * o card inteiro); o coração e o botão do carrinho ficam por cima e funcionam sem abrir o produto.
 */
export function CardProduto({ produto, preload = false }: { produto: ProdutoCatalogo; preload?: boolean }) {
  const desconto = descontoPix(produto.preco, produto.precoOriginal);
  const marca = nomeDaMarca.get(produto.marca);
  const dados = resumo(produto);

  return (
    // Abaixo de 460 px a grade tem uma coluna só e o card deita: foto à esquerda, dados à direita.
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card bg-white ring-1 ring-line transition-[box-shadow,transform] duration-300 ease-out hover:shadow-card hover:ring-brand/30 max-[459px]:flex-row lg:hover:-translate-y-0.5 [&:has(h3_a:focus-visible)]:ring-2 [&:has(h3_a:focus-visible)]:ring-brand">
      <div className="relative aspect-square border-b border-line/70 bg-white max-[459px]:aspect-auto max-[459px]:min-h-[176px] max-[459px]:w-[140px] max-[459px]:shrink-0 max-[459px]:self-stretch max-[459px]:border-r max-[459px]:border-b-0">
        <FotoProduto
          src={produto.imagem}
          alt=""
          temFoto={produto.temFoto}
          sizes={tamanhos}
          preload={preload}
          className="p-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] lg:p-5"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-3 max-[459px]:p-4 lg:p-4">
        {marca && <p className="text-[12px] leading-4 font-bold tracking-[0.06em] text-muted uppercase">{marca}</p>}
        <h3 className="mt-1 line-clamp-2 min-h-10 text-[14px] leading-5 font-medium text-ink group-hover:text-brand max-[459px]:line-clamp-3 max-[459px]:min-h-0 max-[459px]:text-[15px] lg:text-[15px]">
          {/* O ::after deste link cobre o card inteiro: clicar em qualquer lugar abre o produto. */}
          <Link href={`/produto/${produto.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {quebravel(produto.nome)}
          </Link>
        </h3>

        <div className="mt-auto pt-3">
          {desconto > 0 && (
            <p className="text-[13px] leading-4 text-muted line-through">{formatarPreco(produto.precoOriginal)}</p>
          )}
          <p className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-[22px] leading-8 font-extrabold tracking-tight text-ink">{formatarPreco(produto.preco)}</span>
            {desconto > 0 && <span className="text-[13px] leading-4 font-bold text-[#00875a]">{desconto}% OFF</span>}
          </p>
          <p className="text-[13px] leading-4 text-muted">
            ou {parcelaEm3x(produto.preco)} sem juros
            {/* O aviso de estoque baixo vai numa linha própria: no mesmo parágrafo ele quebrava no meio ("última / unidade"). */}
            {produto.estoque === 1 ? (
              <span className="mt-0.5 block font-semibold text-ink">Última unidade</span>
            ) : produto.estoque > 1 && produto.estoque <= 3 ? (
              <span className="mt-0.5 block font-semibold text-ink">Últimas {produto.estoque} unidades</span>
            ) : null}
          </p>
        </div>

        {/* Por cima do link do card. */}
        <div className="relative z-10 mt-3">
          <ControleCarrinho produto={dados} />
        </div>
      </div>

      <BotaoFavorito produto={dados} className="absolute top-2 right-2 z-10 max-[459px]:right-auto max-[459px]:left-2" />
    </article>
  );
}
