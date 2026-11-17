/*
 * Catálogo da loja. Lê a mesma API que o site atual usa e guarda o resultado em cache por
 * algumas horas, então a API não é chamada a cada visita.
 */
import { cacheLife } from "next/cache";
import { departamentoOutros, departamentos } from "@/data/departamentos";
import { marcaDoNome } from "@/data/marcas-catalogo";
import { formatarNomeProduto, normalizar, slugificar } from "@/lib/formato";
import type { Departamento, ItemCatalogo, ProdutoCatalogo, Subcategoria } from "@/types";

// TODO: confirmar com a Multsystems (ou com quem mantém o site atual) se esta API pode ser usada no site novo.
const CATALOGO_API_URL = process.env.CATALOGO_API_URL || "https://multsystems.discloud.app/api/produtos";

/** Página com todos os produtos. */
export const catalogoUrl = "/produtos";

// Categorias internas do sistema que não são produtos à venda.
const CATEGORIAS_OCULTAS = new Set(["FRETE", "SERVIÇO", "OUTRAS RECEITAS", "ATIVO", "SOFTWARE"]);

type ItemApi = {
  cod_produto?: string;
  sku?: string;
  nome?: string;
  categoria?: string;
  imagem?: string;
  preco?: number;
  preco_original?: number;
  estoque?: number;
};

// Última lista que a API entregou com sucesso. Se a API cair numa atualização, o site continua mostrando
// esta (preços e estoque de poucas horas atrás) em vez de ficar com o catálogo vazio.
let ultimoCatalogo: ItemCatalogo[] = [];

/**
 * Lê a API. Quando dá certo, a lista fica em cache por horas. Quando a API falha (fora do ar, lenta ou
 * devolvendo lista vazia), devolve a última lista boa e guarda isso só por 1 minuto: assim o site volta
 * a tentar logo, em vez de ficar horas com dados velhos (ou vazios) guardados.
 */
export async function lerCatalogo(): Promise<{ itens: ItemCatalogo[]; atual: boolean }> {
  "use cache";

  try {
    const resposta = await fetch(CATALOGO_API_URL, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8_000),
    });
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    const json = (await resposta.json()) as { data?: ItemApi[] };

    const itens: ItemCatalogo[] = (json.data ?? [])
      .filter((p) => p.cod_produto && p.nome && (p.preco ?? 0) > 0 && !CATEGORIAS_OCULTAS.has(p.categoria ?? ""))
      .map((p) => ({
        codigo: String(p.cod_produto),
        sku: String(p.sku ?? ""),
        nome: String(p.nome).replace(/""/g, '"').replace(/\s+/g, " ").trim(),
        categoria: String(p.categoria ?? "").trim(),
        imagem: String(p.imagem ?? ""),
        preco: Number(p.preco),
        precoOriginal: Number(p.preco_original ?? p.preco),
        estoque: Number(p.estoque ?? 0),
      }));
    if (itens.length === 0) throw new Error("a API devolveu uma lista vazia");

    ultimoCatalogo = itens;
    cacheLife("hours");
    return { itens, atual: true };
  } catch (erro) {
    console.error("[catalogo] não foi possível ler a API, usando a última lista conhecida:", erro);
    cacheLife("minutes");
    return { itens: ultimoCatalogo, atual: false };
  }
}

export async function getCatalogo(): Promise<ItemCatalogo[]> {
  return (await lerCatalogo()).itens;
}

/*
 * Cerca de 40% dos produtos não têm foto: a URL responde 200, mas com uma página HTML no
 * lugar da imagem. Conferimos uma vez por dia (pedidos HEAD, em paralelo) para mostrar um
 * espaço "sem foto" bonito e jogar esses produtos para o fim da ordem "Mais relevantes".
 */
async function getUrlsSemFoto(urls: string[]): Promise<Set<string>> {
  "use cache";
  cacheLife("days");

  const semFoto = new Set<string>();
  const fila = [...new Set(urls.filter(Boolean))];
  async function trabalhar() {
    for (let url = fila.pop(); url; url = fila.pop()) {
      try {
        const r = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(5_000) });
        if (!r.ok || !(r.headers.get("content-type") ?? "").startsWith("image/")) semFoto.add(url);
      } catch {
        // Na dúvida, considera que tem foto: o componente da foto ainda tem um plano B no navegador.
      }
    }
  }
  await Promise.all(Array.from({ length: 24 }, trabalhar));
  return semFoto;
}

const porSistema = new Map<string, { departamento: Departamento; sub: Subcategoria }>(
  departamentos.flatMap((d) => d.subcategorias.map((s) => [s.sistema, { departamento: d, sub: s }] as const)),
);

/** Departamento e subcategoria de uma categoria do sistema. Categoria nova cai em "Outros". */
export function localizarCategoria(sistema: string): { departamento: Departamento; sub: Subcategoria } {
  return (
    porSistema.get(sistema) ?? {
      departamento: departamentoOutros,
      sub: { sistema, nome: formatarNomeProduto(sistema), slug: slugificar(sistema) },
    }
  );
}

/** Catálogo pronto para o site: nome legível, departamento, marca e se tem foto. */
export async function getProdutos(): Promise<ProdutoCatalogo[]> {
  "use cache";

  // Quem chama `cacheLife` explicitamente manda no próprio prazo (não herda o do cache de dentro):
  // se a leitura da API falhou, este resultado também só dura 1 minuto.
  const { itens, atual } = await lerCatalogo();
  if (atual) cacheLife("hours");
  else cacheLife("minutes");

  const semFoto = await getUrlsSemFoto(itens.map((i) => i.imagem));

  return itens.map((item) => {
    const marca = marcaDoNome(item.nome);
    const { departamento, sub } = localizarCategoria(item.categoria);
    const nome = formatarNomeProduto(item.nome, marca);
    return {
      codigo: item.codigo,
      sku: item.sku,
      slug: `${slugificar(nome).slice(0, 70).replace(/-+$/, "")}-${item.codigo}`,
      nome,
      nomeSistema: item.nome,
      departamento: departamento.slug,
      subcategoria: sub.slug,
      marca: marca?.slug ?? "",
      imagem: item.imagem,
      temFoto: Boolean(item.imagem) && !semFoto.has(item.imagem),
      preco: item.preco,
      precoOriginal: item.precoOriginal,
      estoque: item.estoque,
    };
  });
}

export { nomeDaMarca } from "@/data/marcas-catalogo";

/** O código do produto fica no fim do slug: "teclado-usb-std-skl106-pt-0000073". */
export function codigoDoSlug(slug: string): string {
  return slug.slice(slug.lastIndexOf("-") + 1);
}

/** Busca simples: todas as palavras precisam aparecer no nome, categoria ou código. */
export function buscarNoCatalogo(catalogo: ItemCatalogo[], consulta: string, limite = 8) {
  const termos = normalizar(consulta).split(/\s+/).filter(Boolean);
  if (termos.length === 0) return { total: 0, itens: [] as ItemCatalogo[] };

  const encontrados = catalogo.filter((item) => {
    const alvo = normalizar(`${item.nome} ${item.categoria} ${item.codigo} ${item.sku}`);
    return termos.every((t) => alvo.includes(t));
  });

  const primeiro = termos[0];
  const pontuar = (item: ItemCatalogo) =>
    (item.estoque > 0 ? 4 : 0) +
    (normalizar(item.nome).startsWith(primeiro) ? 2 : 0) +
    (normalizar(item.categoria).includes(primeiro) ? 1 : 0);

  encontrados.sort((a, b) => pontuar(b) - pontuar(a) || a.nome.length - b.nome.length);
  return { total: encontrados.length, itens: encontrados.slice(0, limite) };
}
