import { departamentos } from "@/data/departamentos";
import { getProdutos } from "@/lib/catalogo";
import { filtrarCatalogo, lerFiltros } from "@/lib/filtros";
import { normalizar } from "@/lib/formato";
import type { ResultadoBusca } from "@/types";

const nomeSub = new Map(departamentos.flatMap((d) => d.subcategorias.map((s) => [s.slug, s.nome])));

/** GET /api/busca?q=notebook → até 8 produtos, na mesma ordem da página de produtos. */
export async function GET(request: Request) {
  const consulta = (new URL(request.url).searchParams.get("q") ?? "").trim().slice(0, 80);
  if (consulta.length < 2) {
    return Response.json({ total: 0, itens: [] });
  }

  const produtos = await getProdutos();
  const primeira = filtrarCatalogo(produtos, lerFiltros({ q: consulta }));
  // Pega as 3 primeiras páginas e põe na frente os produtos que COMEÇAM com o que foi digitado
  // ("notebook" mostra notebooks antes de suportes e fontes para notebook). O resto segue a ordem do catálogo.
  const paginas = [primeira.itens];
  for (let n = 2; n <= Math.min(3, primeira.totalPaginas); n++) {
    paginas.push(filtrarCatalogo(produtos, lerFiltros({ q: consulta, pagina: String(n) })).itens);
  }
  const termo = normalizar(consulta);
  const candidatos = paginas.flat();
  const itens = candidatos
    .map((p, i) => ({ p, i, comeca: normalizar(p.nome).startsWith(termo) ? 0 : 1 }))
    .sort((a, b) => a.comeca - b.comeca || a.i - b.i)
    .map((x) => x.p);
  const total = primeira.total;

  const resultado: ResultadoBusca[] = itens.slice(0, 8).map((p) => ({
    codigo: p.codigo,
    slug: p.slug,
    nome: p.nome,
    categoria: nomeSub.get(p.subcategoria) ?? "",
    imagem: p.temFoto ? p.imagem : "",
    preco: p.preco,
    precoOriginal: p.precoOriginal,
  }));

  return Response.json(
    { total, itens: resultado },
    { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=600" } },
  );
}
