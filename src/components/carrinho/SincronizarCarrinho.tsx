"use client";

import { useEffect, useRef } from "react";
import { useCadastro, type Cadastro } from "@/lib/cadastro";
import { itensDoCarrinho, totalDoCarrinho, useCarrinho } from "@/lib/carrinho";
import { useFavoritos } from "@/lib/favoritos";

/**
 * Manda o carrinho e os favoritos para o servidor (junto do contato) sempre que mudam, com uma
 * pequena espera para juntar vários cliques. O servidor repassa ao BotConversa, que lembra o
 * cliente se o carrinho ficar parado. Não desenha nada na tela.
 */
export function SincronizarCarrinho() {
  const cadastro = useCadastro();
  const itens = useCarrinho();
  const favoritos = useFavoritos();
  const ultimo = useRef("");

  useEffect(() => {
    if (!cadastro) return;
    const corpo = JSON.stringify({
      cadastro,
      itens: itens.map((i) => ({ codigo: i.codigo, nome: i.nome, quantidade: i.quantidade, preco: i.preco })),
      favoritos: favoritos.map((f) => ({ codigo: f.codigo, nome: f.nome, preco: f.preco, precoSalvo: f.precoSalvo })),
      total: totalDoCarrinho(itens),
    });
    if (corpo === ultimo.current) return;
    const t = window.setTimeout(() => {
      ultimo.current = corpo;
      fetch("/api/carrinho", { method: "POST", headers: { "Content-Type": "application/json" }, body: corpo, keepalive: true }).catch(
        () => {},
      );
    }, 1200);
    return () => window.clearTimeout(t);
  }, [cadastro, itens, favoritos]);

  return null;
}

/** Avisa o servidor que o cliente fechou o pedido (WhatsApp ou orçamento): o lembrete de carrinho parado é cancelado. */
export function avisarCarrinhoFinalizado(cadastro: Cadastro | null, via: "whatsapp" | "orcamento") {
  if (!cadastro) return;
  const itens = itensDoCarrinho();
  fetch("/api/carrinho", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    body: JSON.stringify({
      cadastro,
      itens: itens.map((i) => ({ codigo: i.codigo, nome: i.nome, quantidade: i.quantidade, preco: i.preco })),
      total: totalDoCarrinho(itens),
      evento: "finalizado",
      via,
    }),
  }).catch(() => {});
}
