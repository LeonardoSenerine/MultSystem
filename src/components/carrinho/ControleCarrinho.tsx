"use client";

import { Check, Minus, Plus, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { centroDe, voarParaCarrinho } from "@/lib/animacoes";
import { evento } from "@/lib/eventos";
import { colocarNoCarrinho, mudarQuantidade, useCarrinho, type ProdutoResumo } from "@/lib/carrinho";

/**
 * Botão do carrinho no card: "Adicionar" quando o produto ainda não está no carrinho;
 * depois vira − quantidade +, com o + travado no estoque disponível.
 * Na primeira vez, o cadastro de contato abre antes de adicionar.
 *
 * `aoTirar` deixa a página animar a saída do item antes de ele sair de fato do carrinho
 * (usado na lista do carrinho, quando a quantidade chega a zero).
 */
export function ControleCarrinho({
  produto,
  grande = false,
  aoTirar,
  semAvisoLimite = false,
}: {
  produto: ProdutoResumo;
  grande?: boolean;
  aoTirar?: (tirar: () => void) => void;
  /** No carrinho o aviso "Máximo do estoque" vai para a linha de informações, para as linhas terem a mesma altura. */
  semAvisoLimite?: boolean;
}) {
  const itens = useCarrinho();
  const quantidade = itens.find((i) => i.codigo === produto.codigo)?.quantidade ?? 0;
  const noLimite = produto.estoque > 0 && quantidade >= produto.estoque;
  const altura = grande ? "h-13" : "h-11";

  // O seletor só "cresce" quando o item acabou de entrar, não quando a página já abre com ele.
  const [entrou, setEntrou] = useState(false);
  const anterior = useRef(quantidade);
  useEffect(() => {
    if (anterior.current === 0 && quantidade === 1) setEntrou(true);
    anterior.current = quantidade;
  }, [quantidade]);

  function adicionar(el: HTMLElement) {
    // Adicionar nunca pede cadastro: o contato é opcional e fica no carrinho.
    colocarNoCarrinho(produto);
    voarParaCarrinho(centroDe(el));
    evento("adicionar_carrinho", { codigo: produto.codigo, nome: produto.nome, preco: produto.preco }, true);
  }

  if (quantidade === 0) {
    return (
      <button
        type="button"
        onClick={(e) => adicionar(e.currentTarget)}
        aria-label={`Adicionar ${produto.nome} ao carrinho`}
        className={`group/botao inline-flex ${altura} w-full items-center justify-center gap-2 rounded-btn bg-brand px-3 font-bold text-white transition-[background-color,transform] duration-200 hover:bg-[#263b73] active:scale-[0.97] ${
          grande ? "text-body" : "text-[14px]"
        }`}
      >
        <ShoppingCart aria-hidden className={`${grande ? "size-5" : "size-4"} transition-transform duration-300 group-hover/botao:-translate-x-0.5 group-hover/botao:-rotate-6`} />
        Adicionar
      </button>
    );
  }

  const botao = `grid ${grande ? "size-13" : "size-11"} shrink-0 place-items-center text-brand transition-[background-color,transform] duration-150 hover:bg-tint active:scale-90 disabled:text-muted/40 disabled:hover:bg-transparent disabled:active:scale-100`;

  return (
    <div>
      <div
        role="group"
        aria-label={`Quantidade de ${produto.nome} no carrinho`}
        className={`${entrou ? "seletor-entra" : ""} flex ${altura} items-center justify-between overflow-hidden rounded-btn bg-white ring-2 ring-brand`}
        onAnimationEnd={(e) => e.target === e.currentTarget && setEntrou(false)}
      >
        <button
          type="button"
          className={botao}
          onClick={(e) => {
            if (quantidade === 1 && aoTirar) aoTirar(() => mudarQuantidade(produto.codigo, 0));
            else mudarQuantidade(produto.codigo, quantidade - 1);
            if (quantidade === 1) evento("remover_carrinho", { codigo: produto.codigo });
            e.currentTarget.blur();
          }}
          aria-label={quantidade === 1 ? "Tirar do carrinho" : "Diminuir quantidade"}
        >
          <Minus aria-hidden className="size-4" strokeWidth={2.75} />
        </button>
        <span aria-live="polite" className="min-w-0 flex-1 text-center text-[15px] leading-5 font-extrabold text-ink tabular-nums">
          <span key={quantidade} className="numero-troca">
            {quantidade}
          </span>
          <span className="sr-only"> no carrinho</span>
        </span>
        <button
          type="button"
          className={botao}
          onClick={(e) => {
            mudarQuantidade(produto.codigo, quantidade + 1);
            voarParaCarrinho(centroDe(e.currentTarget));
            evento("adicionar_carrinho", { codigo: produto.codigo, nome: produto.nome, preco: produto.preco }, true);
          }}
          disabled={noLimite}
          aria-label={noLimite ? "Limite do estoque" : "Aumentar quantidade"}
        >
          <Plus aria-hidden className="size-4" strokeWidth={2.75} />
        </button>
      </div>
      {noLimite && !semAvisoLimite && (
        <p className="erro-campo mt-1 flex items-center justify-center gap-1 text-center text-[12px] leading-4 font-semibold text-muted">
          <Check aria-hidden className="size-3" strokeWidth={3} />
          Máximo do estoque
        </p>
      )}
      {/* Comprando em quantidade (página do produto): oferece a cotação para empresa, com condição. */}
      {grande && quantidade >= 3 && (
        <p className="erro-campo mt-3 text-center text-small text-muted">
          Comprando para a empresa?{" "}
          <Link
            href={`/orcamento?${new URLSearchParams({ produto: `${produto.nome} (cód. ${produto.codigo})`, qtd: String(quantidade) }).toString()}#orcamento`}
            className="inline-flex min-h-11 items-center font-bold text-brand hover:underline"
          >
            Peça um orçamento com condição para {quantidade} unidades
          </Link>
        </p>
      )}
    </div>
  );
}
