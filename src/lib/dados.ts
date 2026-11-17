/*
 * Ponto único de acesso aos dados da home.
 * Contato, categorias, avaliações e FAQ vêm de src/data. Os produtos vêm do catálogo
 * real da loja (src/lib/catalogo.ts), com cache; se a API falhar, usa a reserva de exemplo.
 */

import { cacheLife } from "next/cache";
import { avaliacoes } from "@/data/avaliacoes";
import { departamentos } from "@/data/departamentos";
import { contato } from "@/data/contato";
import { perguntas } from "@/data/faq";
import { destaques, produtosExemplo } from "@/data/produtos";
import { lerCatalogo } from "@/lib/catalogo";
import type { Avaliacao, Contato, Departamento, Pergunta, Produto } from "@/types";

export function getContato(): Contato {
  return contato;
}

export async function getDestaques(limite = 8): Promise<Produto[]> {
  "use cache";

  const { itens: catalogo, atual } = await lerCatalogo();
  if (atual) cacheLife("hours");
  else cacheLife("minutes");
  const porCodigo = new Map(catalogo.map((item) => [item.codigo, item]));

  const reais: Produto[] = destaques.flatMap((d) => {
    const item = porCodigo.get(d.codigo);
    return item ? [{ ...d, preco: item.preco, imagem: item.imagem }] : [];
  });

  // Com menos de 4 produtos a seção fica vazia demais: usa a reserva de exemplo.
  return (reais.length >= 4 ? reais : produtosExemplo).slice(0, limite);
}

/** Departamentos que têm foto: são os cards da seção "Categorias" da home. */
export function getDepartamentosDaHome(): Departamento[] {
  return departamentos.filter((d) => d.imagem);
}

export function getAvaliacoes(): Avaliacao[] {
  return avaliacoes;
}

export function getPerguntas(): Pergunta[] {
  return perguntas;
}
