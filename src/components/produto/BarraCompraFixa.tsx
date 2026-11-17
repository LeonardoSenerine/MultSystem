"use client";

import { useEffect, useState } from "react";
import { ControleCarrinho } from "@/components/carrinho/ControleCarrinho";
import type { ProdutoResumo } from "@/lib/carrinho";
import { formatarPreco } from "@/lib/formato";

/**
 * Barra fixa no rodapé do celular com o preço e o botão do carrinho. Aparece quando o bloco de
 * compra da página (`#bloco-compra`) sai da tela, para a pessoa não precisar voltar ao topo.
 */
export function BarraCompraFixa({ produto }: { produto: ProdutoResumo }) {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const alvo = document.getElementById("bloco-compra");
    if (!alvo) return;
    const observer = new IntersectionObserver(([e]) => setVisivel(!e.isIntersecting && e.boundingClientRect.top < 0), {
      rootMargin: "-64px 0px 0px 0px",
    });
    observer.observe(alvo);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      data-visivel={visivel}
      aria-hidden={!visivel}
      inert={!visivel}
      className="barra-compra fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 backdrop-blur lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="container-site flex items-center gap-3 py-2.5">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] leading-4 text-muted">{produto.nome}</p>
          <p className="text-[20px] leading-7 font-extrabold tracking-tight text-ink">{formatarPreco(produto.preco)}</p>
        </div>
        <div className="w-[150px] shrink-0">
          <ControleCarrinho produto={produto} />
        </div>
      </div>
    </div>
  );
}
