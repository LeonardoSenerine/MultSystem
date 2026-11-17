import { getProdutos } from "@/lib/catalogo";

/**
 * GET /api/produtos?codigos=0000073,0000485 → preço e estoque de agora desses produtos.
 * O carrinho e os favoritos usam para atualizar o que está salvo no navegador.
 */
export async function GET(request: Request) {
  const codigos = new Set(
    (new URL(request.url).searchParams.get("codigos") ?? "")
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean)
      .slice(0, 200),
  );
  if (codigos.size === 0) return Response.json({ itens: [] });

  const itens = (await getProdutos())
    .filter((p) => codigos.has(p.codigo))
    .map((p) => ({ codigo: p.codigo, preco: p.preco, estoque: p.estoque }));

  return Response.json({ itens }, { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=600" } });
}
