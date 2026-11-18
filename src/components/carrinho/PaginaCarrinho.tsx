"use client";

import Link from "next/link";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAtualizarPrecos } from "@/components/carrinho/AtualizarPrecos";
import { ControleCarrinho } from "@/components/carrinho/ControleCarrinho";
import { FotoProduto } from "@/components/catalogo/FotoProduto";
import { WhatsAppIcon } from "@/components/icones-marca";
import { ContatoCarrinho } from "@/components/carrinho/ContatoCarrinho";
import { ListasSalvas } from "@/components/carrinho/ListasSalvas";
import { SalvarLista } from "@/components/carrinho/SalvarLista";
import { avisarCarrinhoFinalizado } from "@/components/carrinho/SincronizarCarrinho";
import { SugestoesCarrinho } from "@/components/carrinho/SugestoesCarrinho";
import { useListaAnimada } from "@/lib/animacoes";
import { evento } from "@/lib/eventos";
import { esquecerCadastro, useCadastro } from "@/lib/cadastro";
import {
  atualizarCarrinho,
  esvaziarCarrinho,
  textoDoCarrinho,
  tirarDoCarrinho,
  totalDoCarrinho,
  unidadesNoCarrinho,
  useCarrinho,
  type ItemCarrinho,
} from "@/lib/carrinho";
import { alternarFavorito, useFavoritos } from "@/lib/favoritos";
import { formatarPreco, parcelaEm3x, quebravel } from "@/lib/formato";
import { useHidratado } from "@/lib/loja-local";

/** "Salvar nos favoritos" da linha do carrinho: o coração dá um pulo ao marcar. */
function SalvarNosFavoritos({ item, salvo }: { item: ItemCarrinho; salvo: boolean }) {
  const [pulou, setPulou] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        if (!salvo) setPulou(true);
        alternarFavorito(item);
      }}
      aria-pressed={salvo}
      className={`inline-flex min-h-11 items-center gap-1.5 text-[13px] font-bold transition-colors ${salvo ? "text-[#e0245e]" : "text-muted hover:text-[#e0245e]"}`}
    >
      <Heart
        aria-hidden
        onAnimationEnd={() => setPulou(false)}
        className={`size-4 transition-colors ${pulou ? "coracao-pulsa" : ""}`}
        fill={salvo ? "currentColor" : "none"}
      />
      {salvo ? "Nos favoritos" : "Favoritar"}
    </button>
  );
}

/** Valor que troca com uma subida curta quando muda (total, subtotal da linha). */
function Valor({ valor, className = "" }: { valor: number; className?: string }) {
  return (
    <span className={className}>
      <span key={valor} className="numero-troca">
        {formatarPreco(valor)}
      </span>
    </span>
  );
}

/** Página do carrinho: lista os itens, quantidades com limite do estoque e o fechamento. */
export function PaginaCarrinho({ whatsapp }: { whatsapp: string }) {
  const itens = useCarrinho();
  const favoritos = useFavoritos();
  const cadastro = useCadastro();
  const [mudouPreco, setMudouPreco] = useState(false);
  const { ref: listaRef, saindo, remover } = useListaAnimada<HTMLUListElement>(itens.length);

  useAtualizarPrecos(
    itens.map((i) => i.codigo),
    (atuais) => {
      setMudouPreco(itens.some((i) => atuais.has(i.codigo) && atuais.get(i.codigo)!.preco !== i.preco));
      atualizarCarrinho(atuais);
    },
  );

  const total = totalDoCarrinho(itens);
  const unidades = unidadesNoCarrinho(itens);
  const hidratado = useHidratado();

  if (!hidratado) return <div aria-busy="true" aria-label="Carregando" className="h-72 animate-pulse rounded-card bg-white/70 ring-1 ring-line" />;

  if (itens.length === 0) {
    return (
      <>
      <div className="erro-campo mx-auto max-w-xl rounded-card bg-white p-8 text-center ring-1 ring-line lg:p-12">
        <span aria-hidden className="flutua mx-auto grid size-14 place-items-center rounded-full bg-tint text-brand">
          <ShoppingCart className="size-7" />
        </span>
        <p className="mt-5 text-h3 text-ink">Seu carrinho está vazio</p>
        <p className="mt-2 text-body text-muted">Toque em &ldquo;Adicionar&rdquo; nos produtos para montar o seu pedido.</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/produtos" className="inline-flex min-h-12 items-center justify-center rounded-btn bg-brand px-6 font-bold text-white transition-[background-color,transform] hover:bg-[#263b73] active:scale-[0.98]">
            Ver produtos
          </Link>
          {favoritos.length > 0 && (
            <Link
              href="/favoritos"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-btn border border-line px-6 font-bold text-ink transition-colors hover:border-brand hover:text-brand"
            >
              <Heart aria-hidden className="size-4" />
              Ver favoritos ({favoritos.length})
            </Link>
          )}
        </div>
      </div>
      <ListasSalvas />
      </>
    );
  }

  // Compra em quantidade: o orçamento para empresa passa a ser o caminho em destaque.
  const emQuantidade = unidades >= 5 || total >= 3000;
  const finalizar = (via: "whatsapp" | "orcamento") => {
    evento("finalizar_carrinho", { via, unidades, total: Math.round(total) }, true);
    avisarCarrinhoFinalizado(cadastro, via);
  };

  const mensagem = [
    "Olá! Quero fechar este pedido que montei no site:",
    "",
    textoDoCarrinho(itens),
    "",
    `Total: ${formatarPreco(total)}`,
  ].join("\n");
  const whatsappHref = `https://wa.me/${whatsapp}?text=${encodeURIComponent(mensagem)}`;

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-8">
      <section
        aria-label="Produtos no carrinho"
        className="min-w-0 overflow-hidden rounded-card bg-white ring-1 ring-line lg:col-start-1 lg:row-start-1"
      >
        {mudouPreco && (
          <p role="status" className="erro-campo border-b border-line bg-[#fff8e1] px-5 py-3 text-small text-ink">
            Alguns preços mudaram desde que você adicionou. O carrinho já mostra os valores de hoje.
          </p>
        )}
        <ul ref={listaRef} className="divide-y divide-line">
          {itens.map((i, n) => {
            const favorito = favoritos.some((f) => f.codigo === i.codigo);
            const tirar = (acao: () => void) => remover(i.codigo, acao);
            return (
              <li
                key={i.codigo}
                data-id={i.codigo}
                data-saindo={saindo.has(i.codigo)}
                style={{ "--i": n } as React.CSSProperties}
                className="lista-item group grid grid-cols-[76px_minmax(0,1fr)] gap-x-3 gap-y-3 bg-white p-4 hover:bg-tint/40 sm:grid-cols-[104px_minmax(0,1fr)_auto] sm:gap-x-5 sm:gap-y-2 lg:p-5"
              >
                {/* Miniatura: sem foto mostra só o ícone (compacto), nunca texto espremido. */}
                <Link
                  href={`/produto/${i.slug}`}
                  className="relative aspect-square self-start overflow-hidden rounded-btn bg-white ring-1 ring-line sm:row-span-2"
                >
                  <FotoProduto
                    src={i.imagem}
                    alt=""
                    temFoto={i.temFoto}
                    compacto
                    sizes="104px"
                    className="p-2 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                  />
                </Link>

                <div className="min-w-0">
                  {i.marca && <p className="text-[12px] leading-4 font-bold tracking-[0.06em] text-muted uppercase">{i.marca}</p>}
                  <Link
                    href={`/produto/${i.slug}`}
                    className="mt-0.5 line-clamp-3 text-[15px] leading-5 font-semibold [overflow-wrap:anywhere] text-ink transition-colors hover:text-brand sm:line-clamp-2"
                  >
                    {quebravel(i.nome)}
                  </Link>
                  <p className="mt-1 text-[13px] leading-[18px] text-muted">
                    {formatarPreco(i.preco)} cada · {i.estoque > 0 ? `${i.estoque} em estoque` : "consultar estoque"}
                    {i.estoque > 0 && i.quantidade >= i.estoque && <span className="font-semibold whitespace-nowrap text-ink"> · máx.</span>}
                  </p>
                </div>

                {/* Quantidade à esquerda e subtotal à direita; no desktop viram uma coluna à direita. */}
                <div className="col-span-2 flex items-center justify-between gap-4 sm:col-span-1 sm:col-start-3 sm:row-span-2 sm:row-start-1 sm:flex-col sm:items-end sm:justify-between">
                  <div className="w-[132px] sm:w-[140px]">
                    <ControleCarrinho produto={i} aoTirar={tirar} semAvisoLimite />
                  </div>
                  <Valor valor={i.preco * i.quantidade} className="text-right text-[18px] leading-6 font-extrabold text-ink tabular-nums" />
                </div>

                {/* Ações numa linha só, separadas por um fio no celular. */}
                <div className="col-span-2 flex items-center justify-between gap-4 border-t border-line/70 pt-1 sm:col-span-1 sm:col-start-2 sm:row-start-2 sm:justify-start sm:gap-6 sm:self-end sm:border-0 sm:pt-0">
                  <button
                    type="button"
                    onClick={() => tirar(() => tirarDoCarrinho(i.codigo))}
                    className="group/remover inline-flex min-h-11 items-center gap-1.5 text-[13px] font-bold text-muted transition-colors hover:text-red-700"
                  >
                    <Trash2 aria-hidden className="size-4 transition-transform duration-200 group-hover/remover:-rotate-12 group-hover/remover:scale-110" />
                    Remover
                  </button>
                  <SalvarNosFavoritos item={i} salvo={favorito} />
                </div>
              </li>
            );
          })}
        </ul>
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-line px-5 py-3">
          <button
            type="button"
            onClick={esvaziarCarrinho}
            className="inline-flex min-h-11 items-center text-[13px] font-bold text-muted transition-colors hover:text-red-700"
          >
            Esvaziar carrinho
          </button>
          <SalvarLista />
        </div>
      </section>

      {/* Resumo: no celular vem logo depois da lista (o botão de finalizar não fica escondido atrás das
          sugestões); no desktop fica parado ao lado, ocupando a altura toda da coluna. */}
      <aside
        aria-label="Resumo do pedido"
        className="mt-6 rounded-card bg-white p-5 ring-1 ring-line lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:sticky lg:top-[104px] lg:p-6"
      >
        <p className="text-[17px] font-extrabold text-ink">Resumo</p>
        <dl className="mt-4 grid gap-2 text-body">
          <div className="flex justify-between text-muted">
            <dt>
              {unidades} {unidades === 1 ? "unidade" : "unidades"}
            </dt>
            <dd className="tabular-nums">
              <Valor valor={total} />
            </dd>
          </div>
          <div className="flex justify-between text-muted">
            <dt>Entrega</dt>
            <dd>Combinar com o vendedor</dd>
          </div>
          <div className="mt-2 flex items-baseline justify-between border-t border-line pt-3">
            <dt className="font-bold text-ink">Total</dt>
            <dd className="text-[26px] leading-8 font-extrabold tracking-tight text-ink tabular-nums">
              <Valor valor={total} />
            </dd>
          </div>
          <p className="text-right text-small text-muted">
            ou <strong className="font-bold text-ink tabular-nums">{parcelaEm3x(total)}</strong> sem juros no cartão
          </p>
        </dl>

        {emQuantidade && (
          <p className="erro-campo mt-5 rounded-btn bg-tint px-4 py-3 text-small text-ink">
            <strong>Compra em quantidade?</strong> Peça um orçamento: o vendedor monta a condição para empresa, com nota no CNPJ.
          </p>
        )}

        <div className="mt-5 grid gap-3">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => finalizar("whatsapp")}
            className="inline-flex min-h-13 items-center justify-center gap-2 rounded-btn bg-whatsapp px-5 text-body font-bold text-ink transition-[background-color,transform] hover:bg-[#1fbe5a] active:scale-[0.98]"
          >
            <WhatsAppIcon className="size-5" />
            Finalizar pelo WhatsApp
          </a>
          <Link
            href="/orcamento?carrinho=1#orcamento"
            onClick={() => finalizar("orcamento")}
            className={`inline-flex min-h-12 items-center justify-center rounded-btn px-5 font-bold transition-[background-color,border-color,color,transform] active:scale-[0.98] ${
              emQuantidade
                ? "bg-brand text-white hover:bg-[#263b73]"
                : "border border-line text-ink hover:border-brand hover:text-brand"
            }`}
          >
            Pedir orçamento com estes itens
          </Link>
        </div>
        <p className="mt-4 text-[13px] leading-[18px] text-muted">
          O vendedor confirma estoque e combina o frete e o prazo. Pague no PIX ou no cartão, em até 3x sem juros. Para empresa, a nota sai no CNPJ. Veja{" "}
          <Link href="/como-comprar" className="font-bold text-brand hover:underline">
            como comprar, pagar e receber
          </Link>
          .
        </p>

        {cadastro ? (
          <p className="mt-4 border-t border-line pt-4 text-[13px] leading-[18px] text-muted">
            Lembrete ativo para <span className="font-semibold text-ink">{cadastro.whatsapp}</span> · {cadastro.email}.{" "}
            <button type="button" onClick={esquecerCadastro} className="inline-flex min-h-11 items-center font-bold text-brand hover:underline">
              Trocar
            </button>
          </p>
        ) : (
          <ContatoCarrinho />
        )}
      </aside>

      {/* Sugestões e listas salvas: depois do resumo no celular, embaixo da lista no desktop. */}
      <div className="min-w-0 lg:col-start-1 lg:row-start-2">
        <SugestoesCarrinho />
        <ListasSalvas />
      </div>
    </div>
  );
}
