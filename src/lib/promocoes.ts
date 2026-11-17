"use client";

/*
 * Lembra no navegador que a pessoa já se inscreveu em promoções e avisos, para a seção mostrar
 * "você já está na lista" em vez de pedir de novo. O contato em si vai para o servidor
 * (POST /api/promocoes); aqui só ficam o canal e o contato, para mostrar na tela.
 */
import { criarLoja } from "@/lib/loja-local";

export type Inscricao = { canal: "whatsapp" | "email"; contato: string; em: string };

const loja = criarLoja<Inscricao | null>("multsystems:promocoes:v1", null, (bruto) => {
  const i = bruto as Inscricao | null;
  return i && (i.canal === "whatsapp" || i.canal === "email") && typeof i.contato === "string" ? i : null;
});

export const useInscricao = loja.usar;
export const guardarInscricao = (i: Omit<Inscricao, "em">) => loja.salvar({ ...i, em: new Date().toISOString() });
