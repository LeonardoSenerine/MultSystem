"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ControleCarrinho } from "@/components/carrinho/ControleCarrinho";
import { FotoProduto } from "@/components/catalogo/FotoProduto";
import { useCarrinho, type ProdutoResumo } from "@/lib/carrinho";
import { formatarPreco, quebravel } from "@/lib/formato";

/**
 * "Complete o seu pedido": produtos que combinam com o que está no carrinho (um mouse para o
 * notebook, toner para a impressora...). A lista vem de /api/sugestoes e muda quando o carrinho muda.
 */
export function SugestoesCarrinho() {
  const itens = useCarrinho();
  const codigos = itens.map((i) => i.codigo).sort().join(",");
  const [resultado, setResultado] = useState<{ chave: string; produtos: ProdutoResumo[] }>({ chave: "", produtos: [] });

  useEffect(() => {
    if (!codigos) return;
    const controle = new AbortController();
    const t = window.setTimeout(() => {
      fetch(`/api/sugestoes?codigos=${encodeURIComponent(codigos)}`, { signal: controle.signal })
        .then((r) => (r.ok ? (r.json() as Promise<ProdutoResumo[]>) : []))
        .then((produtos) => setResultado({ chave: codigos, produtos }))
        .catch(() => {});
    }, 400);
    return () => {
      window.clearTimeout(t);
      controle.abort();
    };
  }, [codigos]);

  if (!codigos || resultado.chave !== codigos || resultado.produtos.length === 0) return null;

  return (
    <section aria-labelledby="sugestoes-carrinho-titulo" className="erro-campo mt-8 lg:mt-10">
      <h2 id="sugestoes-carrinho-titulo" className="text-h3 text-ink lg:text-[22px] lg:leading-7">
        Complete o seu pedido
      </h2>
      <p className="mt-1 text-small text-muted">Combina com o que você escolheu.</p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {resultado.produtos.map((p) => (
          <li key={p.codigo} className="flex gap-3 rounded-card bg-white p-3 ring-1 ring-line transition-shadow hover:shadow-card">
            <Link href={`/produto/${p.slug}`} className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-btn bg-white ring-1 ring-line">
              <FotoProduto src={p.imagem} alt="" temFoto={p.temFoto} compacto sizes="96px" className="p-2" />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col">
              <Link href={`/produto/${p.slug}`} className="line-clamp-2 text-[14px] leading-5 font-medium text-ink hover:text-brand">
                {quebravel(p.nome)}
              </Link>
              <p className="mt-1 text-[17px] leading-6 font-extrabold text-ink">{formatarPreco(p.preco)}</p>
              <div className="mt-auto pt-2">
                <ControleCarrinho produto={p} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
