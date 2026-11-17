/*
 * Filtros do catálogo (página de produtos e páginas de departamento).
 * Tudo vem da URL (?q=&sub=&marca=&min=&max=&ordem=&pagina=), então cada filtro é um link
 * comum: funciona sem JavaScript, dá para compartilhar e o Google consegue seguir.
 */
import { departamentoOutros, departamentos } from "@/data/departamentos";
import { normalizar } from "@/lib/formato";
import type { ProdutoCatalogo } from "@/types";

export const POR_PAGINA = 24;

export const ORDENS = [
  { valor: "relevancia", nome: "Mais relevantes" },
  { valor: "menor-preco", nome: "Menor preço" },
  { valor: "maior-preco", nome: "Maior preço" },
  { valor: "nome", nome: "Nome (A a Z)" },
] as const;

export type Ordem = (typeof ORDENS)[number]["valor"];

export const FAIXAS_PRECO = [
  { min: undefined, max: 50, nome: "Até R$ 50" },
  { min: 50, max: 200, nome: "R$ 50 a R$ 200" },
  { min: 200, max: 500, nome: "R$ 200 a R$ 500" },
  { min: 500, max: 1000, nome: "R$ 500 a R$ 1.000" },
  { min: 1000, max: undefined, nome: "Mais de R$ 1.000" },
] as const;

export type Filtros = {
  /** Fixo pela rota em /categoria/[slug]; vazio em /produtos. */
  departamento: string;
  q: string;
  sub: string;
  marcas: string[];
  min?: number;
  max?: number;
  ordem: Ordem;
  pagina: number;
};

type Params = Record<string, string | string[] | undefined>;

function um(valor: string | string[] | undefined): string {
  return (Array.isArray(valor) ? valor[0] : valor ?? "").trim();
}

function numero(valor: string): number | undefined {
  const n = Number(valor.replace(",", "."));
  return valor && Number.isFinite(n) && n >= 0 ? n : undefined;
}

export function lerFiltros(params: Params, departamento = ""): Filtros {
  const ordem = um(params.ordem);
  return {
    departamento,
    q: um(params.q).slice(0, 80),
    sub: um(params.sub),
    marcas: um(params.marca).split(",").filter(Boolean),
    min: numero(um(params.min)),
    max: numero(um(params.max)),
    ordem: ORDENS.some((o) => o.valor === ordem) ? (ordem as Ordem) : "relevancia",
    pagina: Math.max(1, Math.floor(Number(um(params.pagina)) || 1)),
  };
}

/** Monta a URL com os filtros atuais e as mudanças pedidas. Mudar filtro volta para a página 1. */
export function urlFiltros(filtros: Filtros, mudancas: Partial<Filtros> = {}): string {
  const f = { ...filtros, pagina: 1, ...mudancas };
  const base = f.departamento ? `/categoria/${f.departamento}` : "/produtos";
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.sub) p.set("sub", f.sub);
  if (f.marcas.length) p.set("marca", f.marcas.join(","));
  if (f.min !== undefined) p.set("min", String(f.min));
  if (f.max !== undefined) p.set("max", String(f.max));
  if (f.ordem !== "relevancia") p.set("ordem", f.ordem);
  if (f.pagina > 1) p.set("pagina", String(f.pagina));
  const qs = p.toString();
  return qs ? `${base}?${qs}` : base;
}

type Criterio = "departamento" | "sub" | "marca" | "preco" | "q";

/** Aplica os filtros, menos o que estiver em `ignorar` (para contar as opções de cada filtro). */
function aplicar(produtos: ProdutoCatalogo[], f: Filtros, ignorar?: Criterio) {
  const termos = normalizar(f.q).split(/\s+/).filter(Boolean);
  return produtos.filter(
    (p) =>
      (ignorar === "departamento" || !f.departamento || p.departamento === f.departamento) &&
      (ignorar === "sub" || !f.sub || p.subcategoria === f.sub) &&
      (ignorar === "marca" || f.marcas.length === 0 || f.marcas.includes(p.marca)) &&
      (ignorar === "preco" || ((f.min === undefined || p.preco >= f.min) && (f.max === undefined || p.preco <= f.max))) &&
      (termos.length === 0 ||
        termos.every((t) => normalizar(`${p.nomeSistema} ${p.nome} ${p.codigo} ${p.sku} ${p.marca}`).includes(t))),
  );
}

function contar<T extends string>(produtos: ProdutoCatalogo[], chave: (p: ProdutoCatalogo) => T) {
  const mapa = new Map<T, number>();
  for (const p of produtos) mapa.set(chave(p), (mapa.get(chave(p)) ?? 0) + 1);
  return mapa;
}

function ordenar(lista: ProdutoCatalogo[], f: Filtros) {
  const primeiro = normalizar(f.q).split(/\s+/)[0] ?? "";
  const relevancia = (p: ProdutoCatalogo) =>
    (p.temFoto ? 4 : 0) + (primeiro && normalizar(p.nome).startsWith(primeiro) ? 2 : 0);

  const porOrdem: Record<Ordem, (a: ProdutoCatalogo, b: ProdutoCatalogo) => number> = {
    // Com foto primeiro; entre eles, os de maior valor (notebooks antes de conectores).
    relevancia: (a, b) => relevancia(b) - relevancia(a) || b.preco - a.preco,
    "menor-preco": (a, b) => a.preco - b.preco,
    "maior-preco": (a, b) => b.preco - a.preco,
    nome: (a, b) => a.nome.localeCompare(b.nome, "pt-BR"),
  };
  return [...lista].sort(porOrdem[f.ordem]);
}

export function filtrarCatalogo(produtos: ProdutoCatalogo[], f: Filtros) {
  const resultado = ordenar(aplicar(produtos, f), f);
  const totalPaginas = Math.max(1, Math.ceil(resultado.length / POR_PAGINA));
  const pagina = Math.min(f.pagina, totalPaginas);

  const porDepartamento = contar(aplicar(produtos, f, "departamento"), (p) => p.departamento);
  const porSub = contar(aplicar(produtos, f, "sub"), (p) => p.subcategoria);
  const porMarca = contar(aplicar(produtos, f, "marca"), (p) => p.marca);
  const semPreco = aplicar(produtos, f, "preco");

  const listaDepartamentos = [...departamentos, departamentoOutros]
    .map((d) => ({ ...d, quantidade: porDepartamento.get(d.slug) ?? 0 }))
    .filter((d) => d.quantidade > 0);

  return {
    total: resultado.length,
    pagina,
    totalPaginas,
    itens: resultado.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA),
    departamentos: listaDepartamentos,
    subcategorias: porSub,
    marcas: [...porMarca].filter(([slug]) => slug).sort((a, b) => b[1] - a[1]),
    faixas: FAIXAS_PRECO.map((faixa) => ({
      ...faixa,
      quantidade: semPreco.filter(
        (p) => (faixa.min === undefined || p.preco >= faixa.min) && (faixa.max === undefined || p.preco <= faixa.max),
      ).length,
    })),
  };
}

export type ResultadoCatalogo = ReturnType<typeof filtrarCatalogo>;
