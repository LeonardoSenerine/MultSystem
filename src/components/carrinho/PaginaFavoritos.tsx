"use client";

import Link from "next/link";
import { Check, Heart, ShoppingCart, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useAtualizarPrecos } from "@/components/carrinho/AtualizarPrecos";
import { BotaoFavorito } from "@/components/carrinho/BotaoFavorito";
import { ControleCarrinho } from "@/components/carrinho/ControleCarrinho";
import { FotoProduto } from "@/components/catalogo/FotoProduto";
import { centroDe, useListaAnimada, voarParaCarrinho } from "@/lib/animacoes";
import { colocarNoCarrinho, useCarrinho } from "@/lib/carrinho";
import { evento } from "@/lib/eventos";
import { atualizarFavoritos, limparFavoritos, useFavoritos, type Favorito } from "@/lib/favoritos";
import { formatarPreco, quebravel } from "@/lib/formato";
import { useHidratado } from "@/lib/loja-local";

const data = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" });

/** Comparação do preço de hoje com o do dia em que o produto foi salvo. */
function Variacao({ f }: { f: Favorito }) {
  const diferenca = f.preco - f.precoSalvo;
  const desde = `desde ${data.format(new Date(f.salvoEm))}`;
  if (Math.abs(diferenca) < 0.01) return <p className="text-[13px] leading-[18px] text-muted">Mesmo preço {desde}</p>;
  const baixou = diferenca < 0;
  return (
    <p className={`erro-campo inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] leading-4 font-bold ${baixou ? "bg-[#e6f6ef] text-[#00734c]" : "bg-[#fdecec] text-[#b42318]"}`}>
      {baixou ? <TrendingDown aria-hidden className="size-4" /> : <TrendingUp aria-hidden className="size-4" />}
      {baixou ? "Baixou" : "Subiu"} {formatarPreco(Math.abs(diferenca))} {desde}
    </p>
  );
}

/** Página de favoritos: produtos guardados, com a variação de preço desde que foram salvos. */
export function PaginaFavoritos() {
  const favoritos = useFavoritos();
  const { ref: listaRef, saindo, remover, removerTodos } = useListaAnimada<HTMLUListElement>(favoritos.length);
  useAtualizarPrecos(
    favoritos.map((f) => f.codigo),
    atualizarFavoritos,
  );
  const hidratado = useHidratado();

  if (!hidratado) return <div aria-busy="true" aria-label="Carregando" className="h-72 animate-pulse rounded-card bg-white/70 ring-1 ring-line" />;

  if (favoritos.length === 0) {
    return (
      <div className="erro-campo mx-auto max-w-xl rounded-card bg-white p-8 text-center ring-1 ring-line lg:p-12">
        <span aria-hidden className="flutua mx-auto grid size-14 place-items-center rounded-full bg-[#fdecf1] text-[#e0245e]">
          <Heart className="size-7" />
        </span>
        <p className="mt-5 text-h3 text-ink">Nenhum favorito ainda</p>
        <p className="mt-2 text-body text-muted">
          Toque no coração dos produtos para guardar. Aqui você acompanha se o preço baixou ou subiu.
        </p>
        <Link href="/produtos" className="mt-6 inline-flex min-h-12 items-center justify-center rounded-btn bg-brand px-6 font-bold text-white transition-[background-color,transform] hover:bg-[#263b73] active:scale-[0.98]">
          Ver produtos
        </Link>
      </div>
    );
  }

  return (
    <>
    <BarraLevarParaCarrinho favoritos={favoritos} aoRemoverTodos={() => removerTodos(limparFavoritos)} />
    <ul ref={listaRef} className="grid grid-cols-1 gap-3 min-[460px]:grid-cols-2 min-[460px]:gap-2.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {favoritos.map((f, n) => (
        <li
          key={f.codigo}
          data-id={f.codigo}
          data-saindo={saindo.has(f.codigo)}
          style={{ "--i": n } as React.CSSProperties}
          className="lista-item"
        >
          <article className="group relative flex h-full flex-col overflow-hidden rounded-card bg-white ring-1 ring-line transition-[box-shadow,transform] duration-300 ease-out hover:shadow-card hover:ring-brand/30 max-[459px]:flex-row lg:hover:-translate-y-0.5">
            <div className="relative aspect-square border-b border-line/70 bg-white max-[459px]:aspect-auto max-[459px]:min-h-[190px] max-[459px]:w-[140px] max-[459px]:shrink-0 max-[459px]:self-stretch max-[459px]:border-r max-[459px]:border-b-0">
              <FotoProduto
                src={f.imagem}
                alt=""
                temFoto={f.temFoto}
                sizes="(min-width: 1024px) 280px, 50vw"
                className="p-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col p-3 max-[459px]:p-4 lg:p-4">
              {f.marca && <p className="text-[12px] leading-4 font-bold tracking-[0.06em] text-muted uppercase">{f.marca}</p>}
              <h3 className="mt-1 line-clamp-2 min-h-10 text-[14px] leading-5 font-medium text-ink transition-colors group-hover:text-brand lg:text-[15px]">
                <Link href={`/produto/${f.slug}`} className="after:absolute after:inset-0 after:content-['']">
                  {quebravel(f.nome)}
                </Link>
              </h3>
              <div className="mt-auto pt-3">
                <p className="text-[22px] leading-8 font-extrabold tracking-tight text-ink">{formatarPreco(f.preco)}</p>
                <div className="mt-1">
                  <Variacao f={f} />
                </div>
              </div>
              <div className="relative z-10 mt-3">
                <ControleCarrinho produto={f} />
              </div>
            </div>
            <BotaoFavorito
              produto={f}
              aoTirar={(tirar) => remover(f.codigo, tirar)}
              className="absolute top-2 right-2 z-10 max-[459px]:right-auto max-[459px]:left-2"
            />
          </article>
        </li>
      ))}
    </ul>
    </>
  );
}

/**
 * Atalho no alto dos favoritos: leva todos os que ainda não estão no carrinho, uma unidade de cada
 * (a quantidade se ajusta depois, no carrinho). Produtos sem estoque ficam de fora. Depois do clique,
 * a barra confirma quantos foram e oferece "Ver carrinho".
 */
function BarraLevarParaCarrinho({ favoritos, aoRemoverTodos }: { favoritos: Favorito[]; aoRemoverTodos: () => void }) {
  const itens = useCarrinho();
  const [feito, setFeito] = useState<number | null>(null);
  // "Remover todos" pede uma confirmação ali mesmo, para ninguém apagar a lista sem querer.
  const [confirmando, setConfirmando] = useState(false);

  const noCarrinho = new Set(itens.map((i) => i.codigo));
  const faltam = favoritos.filter((f) => !noCarrinho.has(f.codigo) && f.estoque > 0);
  const semEstoque = favoritos.filter((f) => f.estoque <= 0).length;
  const total = faltam.reduce((soma, f) => soma + f.preco, 0);

  function levarTodos(el: HTMLElement) {
    const origem = centroDe(el);
    for (const f of faltam) {
      colocarNoCarrinho({ codigo: f.codigo, slug: f.slug, nome: f.nome, marca: f.marca, imagem: f.imagem, temFoto: f.temFoto, preco: f.preco, estoque: f.estoque });
    }
    voarParaCarrinho(origem);
    evento("adicionar_todos_favoritos", { quantidade: faltam.length }, true);
    setFeito(faltam.length);
  }

  const tudoLa = faltam.length === 0;

  return (
    <div className="mb-4 flex flex-col gap-4 rounded-card bg-white p-4 ring-1 ring-line sm:flex-row sm:items-center sm:justify-between lg:mb-6 lg:p-5">
      <div className="min-w-0" role="status">
        <p className="text-body font-bold text-ink">
          {favoritos.length} {favoritos.length === 1 ? "produto guardado" : "produtos guardados"}
        </p>
        <p className="mt-0.5 text-small text-muted">
          {tudoLa ? (
            feito ? (
              <span className="erro-campo inline-flex items-center gap-1.5 font-semibold text-[#00734c]">
                <Check aria-hidden className="size-4" strokeWidth={3} />
                {feito} {feito === 1 ? "produto foi" : "produtos foram"} para o carrinho.
              </span>
            ) : (
              "Todos os disponíveis já estão no carrinho."
            )
          ) : (
            <>
              Leve {faltam.length === 1 ? "o produto" : `os ${faltam.length} produtos`} de uma vez: <strong className="text-ink tabular-nums">{formatarPreco(total)}</strong>
              {semEstoque > 0 && ` (${semEstoque} sem estoque ${semEstoque === 1 ? "fica" : "ficam"} de fora)`}.
            </>
          )}
        </p>
      </div>

      {confirmando ? (
        <div role="alertdialog" aria-label="Confirmar remoção dos favoritos" className="erro-campo flex flex-col gap-2 sm:flex-row sm:items-center">
          <p className="text-small font-bold text-ink sm:mr-2">Remover os {favoritos.length} favoritos?</p>
          <button
            type="button"
            autoFocus
            onClick={() => {
              setConfirmando(false);
              aoRemoverTodos();
            }}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-btn bg-[#b42318] px-5 font-bold text-white transition-[background-color,transform] hover:bg-[#912018] active:scale-[0.98]"
          >
            <Trash2 aria-hidden className="size-4" />
            Sim, remover todos
          </button>
          <button
            type="button"
            onClick={() => setConfirmando(false)}
            className="inline-flex min-h-12 items-center justify-center rounded-btn border border-line px-5 font-bold text-ink transition-[border-color,color] hover:border-brand hover:text-brand"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {tudoLa ? (
            <Link
              href="/carrinho"
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-btn bg-brand px-6 font-bold text-white transition-[background-color,transform] hover:bg-[#263b73] active:scale-[0.98]"
            >
              <ShoppingCart aria-hidden className="size-5" />
              Ver carrinho
            </Link>
          ) : (
            <button
              type="button"
              onClick={(e) => levarTodos(e.currentTarget)}
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-btn bg-brand px-6 font-bold text-white transition-[background-color,transform] hover:bg-[#263b73] active:scale-[0.98]"
            >
              <ShoppingCart aria-hidden className="size-5" />
              Levar todos para o carrinho
            </button>
          )}
          <button
            type="button"
            onClick={() => setConfirmando(true)}
            className="group/lixo inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-btn border border-line px-5 font-bold text-muted transition-[border-color,color,transform] hover:border-[#b42318] hover:text-[#b42318] active:scale-[0.98]"
          >
            <Trash2 aria-hidden className="size-4 transition-transform duration-200 group-hover/lixo:-rotate-12" />
            Remover todos
          </button>
        </div>
      )}
    </div>
  );
}
