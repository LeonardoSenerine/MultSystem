"use client";

/*
 * Contato do cliente (WhatsApp e e-mail), deixado de forma OPCIONAL no carrinho. Serve para a loja
 * retomar o atendimento se o carrinho ficar parado. Adicionar ao carrinho nunca depende dele.
 */
import { criarLoja } from "@/lib/loja-local";

export type Cadastro = { nome: string; whatsapp: string; email: string; consentiuEm: string };

const loja = criarLoja<Cadastro | null>("multsystems:cadastro:v1", null, (bruto) => {
  const c = bruto as Cadastro | null;
  return c && typeof c.whatsapp === "string" && typeof c.email === "string" ? c : null;
});

export const useCadastro = loja.usar;

/** Guarda o contato (com a data do aceite). A partir daí o carrinho passa a ser enviado ao servidor. */
export function salvarCadastro(dados: Omit<Cadastro, "consentiuEm">) {
  loja.salvar({ ...dados, consentiuEm: new Date().toISOString() });
}

export function esquecerCadastro() {
  loja.salvar(null);
}
