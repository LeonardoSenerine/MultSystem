"use client";

import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { useAvisoDeMudanca } from "@/lib/animacoes";
import { unidadesNoCarrinho, useCarrinho } from "@/lib/carrinho";
import { useFavoritos } from "@/lib/favoritos";

const icone = "relative grid size-11 place-items-center rounded-btn text-ink transition-colors hover:bg-tint hover:text-brand";

function Contador({ n, cor }: { n: number; cor: string }) {
  if (n === 0) return null;
  return (
    <span
      aria-hidden
      className={`contador-pula absolute top-0.5 right-0.5 grid h-5 min-w-5 place-items-center rounded-full px-1 text-[11px] leading-none font-extrabold text-white tabular-nums ring-2 ring-white ${cor}`}
      key={n}
    >
      {n > 99 ? "99+" : n}
    </span>
  );
}

/** Favoritos e carrinho no topo, com a quantidade de cada um. O ícone balança quando entra algo. */
export function IconesConta({ mostrarFavoritos = true }: { mostrarFavoritos?: boolean }) {
  const favoritos = useFavoritos().length;
  const unidades = unidadesNoCarrinho(useCarrinho());
  const balancaCarrinho = useAvisoDeMudanca(unidades);
  const pulaCoracao = useAvisoDeMudanca(favoritos);

  return (
    <>
      {mostrarFavoritos && (
        <Link href="/favoritos" className={icone} aria-label={favoritos ? `Favoritos, ${favoritos} produtos` : "Favoritos"}>
          <Heart aria-hidden className={`size-[22px] ${pulaCoracao ? "coracao-pulsa" : ""}`} />
          <Contador n={favoritos} cor="bg-[#e0245e]" />
        </Link>
      )}
      <Link
        href="/carrinho"
        data-alvo-carrinho
        className={icone}
        aria-label={unidades ? `Carrinho, ${unidades} itens` : "Carrinho"}
      >
        <ShoppingCart aria-hidden className={`size-[22px] ${balancaCarrinho ? "carrinho-balanca" : ""}`} />
        <Contador n={unidades} cor="bg-brand" />
      </Link>
    </>
  );
}
