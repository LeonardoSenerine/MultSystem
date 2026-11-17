"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import type { ProdutoResumo } from "@/lib/carrinho";
import { evento } from "@/lib/eventos";
import { alternarFavorito, useFavoritos } from "@/lib/favoritos";

/**
 * Coração do card: guarda o produto nos favoritos (com o preço do dia, para comparar depois).
 * Ao marcar, o coração dá um pulo e um anel se abre; ao desmarcar, ele murcha.
 * `aoTirar` deixa a página animar a saída antes de o produto sair dos favoritos.
 */
export function BotaoFavorito({
  produto,
  className = "",
  aoTirar,
}: {
  produto: ProdutoResumo;
  className?: string;
  aoTirar?: (tirar: () => void) => void;
}) {
  const favoritos = useFavoritos();
  const salvo = favoritos.some((f) => f.codigo === produto.codigo);
  const [efeito, setEfeito] = useState<"marcou" | "soltou" | null>(null);

  return (
    <button
      type="button"
      aria-pressed={salvo}
      aria-label={salvo ? `Tirar ${produto.nome} dos favoritos` : `Salvar ${produto.nome} nos favoritos`}
      title={salvo ? "Tirar dos favoritos" : "Salvar nos favoritos"}
      onClick={() => {
        if (salvo && aoTirar) {
          setEfeito("soltou");
          aoTirar(() => alternarFavorito(produto));
          return;
        }
        setEfeito(salvo ? "soltou" : "marcou");
        alternarFavorito(produto);
        if (!salvo) evento("favoritar", { codigo: produto.codigo, nome: produto.nome, preco: produto.preco }, true);
      }}
      onAnimationEnd={(e) => e.target === e.currentTarget.firstElementChild && setEfeito(null)}
      className={`group/coracao grid size-11 place-items-center rounded-full bg-white/90 shadow-[0_1px_4px_rgb(28_47_92/0.12)] ring-1 ring-line backdrop-blur transition-[color,background-color,transform] duration-200 hover:scale-105 hover:bg-white active:scale-90 ${
        salvo ? "text-[#e0245e]" : "text-muted hover:text-[#e0245e]"
      } ${className}`}
    >
      <Heart
        aria-hidden
        className={`size-5 transition-colors ${efeito === "marcou" ? "coracao-pulsa" : efeito === "soltou" ? "coracao-solta" : ""}`}
        fill={salvo ? "currentColor" : "none"}
        strokeWidth={2}
      />
      {efeito === "marcou" && <span aria-hidden className="coracao-anel" />}
    </button>
  );
}
