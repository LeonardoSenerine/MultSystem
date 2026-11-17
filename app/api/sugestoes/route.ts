import { getProdutos, nomeDaMarca } from "@/lib/catalogo";
import { sugerirParaCarrinho } from "@/lib/sugestoes";

/**
 * GET /api/sugestoes?codigos=0012460,0012724: produtos que combinam com o que está no carrinho
 * (regras em src/data/sugestoes.ts). Devolve o resumo que o carrinho do navegador sabe guardar.
 */
export async function GET(request: Request) {
  const codigos = (new URL(request.url).searchParams.get("codigos") ?? "")
    .split(",")
    .map((c) => c.trim())
    .filter((c) => /^[\w-]{1,20}$/.test(c))
    .slice(0, 30);
  if (codigos.length === 0) return Response.json([]);

  const todos = await getProdutos();
  const porCodigo = new Map(todos.map((p) => [p.codigo, p]));
  const noCarrinho = codigos.flatMap((c) => porCodigo.get(c) ?? []);

  return Response.json(
    sugerirParaCarrinho(noCarrinho, todos, 4).map((p) => ({
      codigo: p.codigo,
      slug: p.slug,
      nome: p.nome,
      marca: nomeDaMarca.get(p.marca) ?? "",
      imagem: p.imagem,
      temFoto: p.temFoto,
      preco: p.preco,
      estoque: p.estoque,
    })),
  );
}
