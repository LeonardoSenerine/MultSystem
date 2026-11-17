"use client";

import { usePathname } from "next/navigation";
import { BuscaComSugestoes } from "@/components/BuscaComSugestoes";

/** Páginas que já têm a busca junto dos produtos: nelas a faixa de busca do topo some. */
const temBuscaPropria = (caminho: string) => caminho === "/produtos" || caminho.startsWith("/categoria/");

/**
 * Faixa de busca logo abaixo do topo, com sugestões de produtos enquanto a pessoa digita. Ao buscar,
 * leva para /produtos já filtrando. No catálogo não aparece: a busca fica ao lado dos produtos.
 * A faixa não é fixa: rola junto com a página, para o topo fixo continuar fino.
 */
export function BuscaTopo() {
  if (temBuscaPropria(usePathname())) return null;

  return (
    // z-30: a lista de sugestões abre por cima do conteúdo da página.
    <div className="relative z-30 border-b border-line bg-white py-3 lg:py-4">
      <div className="container-site">
        <BuscaComSugestoes id="busca-topo" />
      </div>
    </div>
  );
}
