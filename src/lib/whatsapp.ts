import type { Produto } from "@/types";

/** Monta o link wa.me com a mensagem já escrita. */
export function whatsappLink(numero: string, mensagem?: string): string {
  const base = `https://wa.me/${numero.replace(/\D/g, "")}`;
  return mensagem ? `${base}?text=${encodeURIComponent(mensagem)}` : base;
}

export function mensagemProduto(produto: Pick<Produto, "nome" | "codigo">): string {
  return `Olá! Tenho interesse no produto: ${produto.nome} (cód. ${produto.codigo})`;
}

export const mensagens = {
  geral: "Olá! Vim pelo site da Multsystems e queria tirar uma dúvida.",
  orcamento: "Olá! Vim pelo site e queria pedir um orçamento para minha empresa.",
  totalTech: "Olá! Vim pelo site da Multsystems e preciso de assistência técnica.",
} as const;
