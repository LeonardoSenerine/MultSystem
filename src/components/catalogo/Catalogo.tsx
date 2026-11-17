import { existsSync } from "node:fs";
import { join } from "node:path";
import Link from "next/link";
import { X } from "lucide-react";
import { EventoNaTela } from "@/components/analytics/EventoNaTela";
import { AreaResultados } from "@/components/catalogo/AreaResultados";
import { BuscaCatalogo } from "@/components/catalogo/BuscaCatalogo";
import { CardProduto } from "@/components/catalogo/CardProduto";
import { NaoAchou } from "@/components/catalogo/NaoAchou";
import { FiltrosCelular } from "@/components/catalogo/FiltrosCelular";
import { FiltrosRapidos } from "@/components/catalogo/FiltrosRapidos";
import { Ordenar } from "@/components/catalogo/Ordenar";
import { VitrineProdutos } from "@/components/catalogo/VitrineProdutos";
import { PainelFiltros } from "@/components/catalogo/PainelFiltros";
import { Paginacao } from "@/components/catalogo/Paginacao";
import { SecaoPromocoes } from "@/components/promocoes/SecaoPromocoes";
import { Migalhas, type Migalha } from "@/components/Migalhas";
import { departamentoOutros, departamentos } from "@/data/departamentos";
import { getProdutos, nomeDaMarca } from "@/lib/catalogo";
import { filtrarCatalogo, lerFiltros, ORDENS, urlFiltros, type Filtros, type Ordem } from "@/lib/filtros";
import { formatarPreco, normalizar } from "@/lib/formato";
import type { ProdutoCatalogo } from "@/types";

type Params = Record<string, string | string[] | undefined>;

/**
 * Capas do banner no alto de /produtos: basta colocar o arquivo em public/img/vitrine/ com o nome
 * capa-empresas, capa-pessoa-fisica ou capa-como-funciona (.jpg, .webp ou .png). Sem arquivo, o banner
 * mostra a colagem de fotos de produtos.
 */
function capasDaVitrine(): Record<string, string> {
  const capas: Record<string, string> = {};
  for (const id of ["empresas", "pessoa-fisica", "como-funciona"]) {
    for (const ext of ["jpg", "webp", "png"]) {
      const arquivo = `capa-${id}.${ext}`;
      if (existsSync(join(process.cwd(), "public", "img", "vitrine", arquivo))) {
        capas[id] = `/img/vitrine/${arquivo}`;
        break;
      }
    }
  }
  return capas;
}

function chips(f: Filtros) {
  const lista: { nome: string; href: string }[] = [];
  if (f.q) lista.push({ nome: `"${f.q}"`, href: urlFiltros(f, { q: "" }) });
  if (f.sub) {
    const sub = departamentos.flatMap((d) => d.subcategorias).find((s) => s.slug === f.sub);
    lista.push({ nome: sub?.nome ?? f.sub, href: urlFiltros(f, { sub: "" }) });
  }
  for (const m of f.marcas) {
    lista.push({ nome: nomeDaMarca.get(m) ?? m, href: urlFiltros(f, { marcas: f.marcas.filter((x) => x !== m) }) });
  }
  if (f.min !== undefined || f.max !== undefined) {
    const nome =
      f.min !== undefined && f.max !== undefined
        ? `${formatarPreco(f.min)} a ${formatarPreco(f.max)}`
        : f.min !== undefined
          ? `A partir de ${formatarPreco(f.min)}`
          : `Até ${formatarPreco(f.max!)}`;
    lista.push({ nome, href: urlFiltros(f, { min: undefined, max: undefined }) });
  }
  return lista;
}

/**
 * Quando nada é encontrado: produtos que tenham pelo menos uma das palavras buscadas (no
 * departamento, se houver), ou os mais relevantes do departamento. Só os que têm foto.
 */
function sugerir(produtos: ProdutoCatalogo[], f: Filtros): ProdutoCatalogo[] {
  const noLugar = produtos.filter((p) => p.temFoto && (!f.departamento || p.departamento === f.departamento));
  const palavras = normalizar(f.q).split(/\s+/).filter((t) => t.length >= 3);
  const parecidos = palavras.length
    ? noLugar.filter((p) => palavras.some((t) => normalizar(`${p.nomeSistema} ${p.nome}`).includes(t)))
    : [];
  const base = parecidos.length ? parecidos : noLugar;
  return filtrarCatalogo(base, { ...f, q: "", sub: "", marcas: [], min: undefined, max: undefined, pagina: 1 }).itens.slice(0, 8);
}

/**
 * Catálogo no modelo de marketplace: filtros fixos à esquerda no desktop (gaveta no celular),
 * barra com total e ordenação, filtros aplicados em etiquetas removíveis e grade de produtos.
 */
export async function Catalogo({ searchParams, departamento = "" }: { searchParams: Promise<Params>; departamento?: string }) {
  const filtros = lerFiltros(await searchParams, departamento);
  const produtos = await getProdutos();
  const resultado = filtrarCatalogo(produtos, filtros);
  const sugestoes = resultado.total === 0 ? sugerir(produtos, filtros) : [];

  const depto = [...departamentos, departamentoOutros].find((d) => d.slug === departamento);
  const sub = depto?.subcategorias.find((s) => s.slug === filtros.sub);

  const titulo = sub?.nome ?? depto?.nome ?? (filtros.q ? `Resultados para “${filtros.q}”` : "Todos os produtos");
  const migalhas: Migalha[] = [{ nome: "Início", href: "/" }, { nome: "Produtos", href: depto || filtros.q ? "/produtos" : undefined }];
  if (depto) migalhas.push({ nome: depto.nome, href: sub ? `/categoria/${depto.slug}` : undefined });
  if (sub) migalhas.push({ nome: sub.nome });

  const aplicados = chips(filtros);
  const urlsOrdem = Object.fromEntries(ORDENS.map((o) => [o.valor, urlFiltros(filtros, { ordem: o.valor })])) as Record<Ordem, string>;
  const painel = (prefixo: string, compacto = false) => (
    <PainelFiltros filtros={filtros} resultado={resultado} prefixo={prefixo} compacto={compacto} />
  );

  const limpar = urlFiltros({ ...filtros, q: "", sub: "", marcas: [], min: undefined, max: undefined });
  const quantos = `${resultado.total.toLocaleString("pt-BR")} ${resultado.total === 1 ? "produto" : "produtos"}`;
  const local = depto ? `em ${(sub?.nome ?? depto.nome).toLowerCase()}` : undefined;

  return (
    <div data-catalogo-raiz className="container-site pt-4 pb-16 lg:pt-6 lg:pb-24">
      <Migalhas itens={migalhas} />

      {/* Carrossel de apresentação: só na página de produtos limpa (sem departamento, busca ou filtro) e na 1ª página. */}
      {!depto && aplicados.length === 0 && resultado.pagina === 1 && (
        <div className="mt-2 mb-5 lg:mb-8">
          <VitrineProdutos capas={capasDaVitrine()} />
        </div>
      )}

      {/* Título e total à esquerda; a ordenação (desktop) à direita. A busca ocupa a largura
          inteira da área de produtos, logo abaixo. */}
      <div className="mt-1 flex items-end justify-between gap-6 lg:mt-2">
        <div className="min-w-0">
          <h1 className="text-[26px] leading-8 font-extrabold tracking-tight text-balance [overflow-wrap:anywhere] text-ink lg:text-[34px] lg:leading-[42px]">
            {titulo}
          </h1>
          <p className="mt-1 text-small [overflow-wrap:anywhere] text-muted">
            <span key={quantos} className="numero-troca">
              {quantos}
            </span>
            {filtros.q && (depto || sub) ? (
              <>
                {" "}
                para <strong className="font-bold text-ink">&ldquo;{filtros.q}&rdquo;</strong>
              </>
            ) : null}
          </p>
        </div>
        <div className="hidden shrink-0 lg:block">
          <Ordenar atual={filtros.ordem} urls={urlsOrdem} />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-5 lg:mt-6 lg:grid-cols-[272px_minmax(0,1fr)] lg:gap-8">
        {/* Coluna de filtros: um painel branco que fica parado enquanto a grade rola. */}
        <aside aria-label="Filtros" className="hidden lg:block">
          <div className="sticky top-[104px] max-h-[calc(100dvh-120px)] overflow-y-auto overscroll-contain rounded-card bg-white px-4 ring-1 ring-line [scrollbar-color:#c7d2ea_transparent] [scrollbar-width:thin]">
            <div className="sticky top-0 z-10 flex min-h-14 items-center justify-between border-b border-line bg-white">
              <p className="text-[17px] font-extrabold text-ink">Filtros</p>
              {aplicados.length > 0 && (
                <Link href={limpar} scroll={false} className="inline-flex min-h-11 items-center text-[14px] font-bold text-brand hover:underline">
                  Limpar tudo ({aplicados.length})
                </Link>
              )}
            </div>
            {painel("lateral")}
          </div>
        </aside>

        <div id="produtos-grade" className="min-w-0 scroll-mt-28">
          <BuscaCatalogo valor={filtros.q} base={urlFiltros(filtros, { q: "" })} local={local} />

          {/* Celular: Filtrar e Ordenar lado a lado, cada um com metade da largura. */}
          <div className="mt-3 grid grid-cols-2 gap-2 lg:hidden">
            <FiltrosCelular ativos={aplicados.length} total={resultado.total} limpar={aplicados.length ? limpar : undefined}>
              {painel("gaveta", true)}
            </FiltrosCelular>
            <Ordenar atual={filtros.ordem} urls={urlsOrdem} compacto />
          </div>

          <div className="mt-3">
            <FiltrosRapidos filtros={filtros} resultado={resultado} />
          </div>

          {aplicados.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <p className="text-[13px] font-semibold text-muted">Filtrando por:</p>
              <ul aria-label="Filtros aplicados" className="flex max-w-full min-w-0 flex-wrap items-center gap-2">
                {aplicados.map((c) => (
                  <li key={c.nome} className="chip-entra max-w-full">
                    <Link
                      href={c.href}
                      scroll={false}
                      aria-label={`Remover filtro ${c.nome}`}
                      className="group/chip inline-flex min-h-11 max-w-full items-center gap-1.5 rounded-full bg-[#e3e9f8] pr-2.5 pl-3.5 text-[13px] font-bold text-brand transition-[background-color,transform] hover:bg-[#d5def4] active:scale-95"
                    >
                      {/* Termo de busca muito longo vira "texto…" dentro do chip, em vez de empurrar a página. */}
                      <span className="min-w-0 truncate">{c.nome}</span>
                      <X aria-hidden className="size-4 shrink-0 transition-transform duration-300 group-hover/chip:rotate-90" />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href={limpar} scroll={false} className="inline-flex min-h-11 items-center px-1 text-[13px] font-bold text-muted hover:text-brand hover:underline">
                Limpar tudo
              </Link>
            </div>
          )}
          <AreaResultados>
            {resultado.itens.length > 0 ? (
              <>
              <h2 className="sr-only">Lista de produtos</h2>
              <ul className="mt-4 grid grid-cols-1 gap-3 min-[460px]:grid-cols-2 min-[460px]:gap-2.5 sm:grid-cols-3 sm:gap-4 lg:mt-5 xl:grid-cols-4">
                {resultado.itens.map((p, i) => (
                  <li key={p.codigo} className="card-entra" style={{ "--i": i } as React.CSSProperties}>
                    <CardProduto produto={p} preload={i < 4} />
                  </li>
                ))}
              </ul>
              </>
            ) : (
              <>
                {filtros.q && <EventoNaTela nome="busca_sem_resultado" dados={{ termo: filtros.q.slice(0, 80) }} />}
                <NaoAchou termo={filtros.q} variante="vazio" limpar={aplicados.length ? limpar : undefined} />
                {sugestoes.length > 0 && (
                  <section aria-labelledby="sugestoes-titulo" className="mt-10">
                    <h2 id="sugestoes-titulo" className="text-h3 text-ink lg:text-[22px] lg:leading-7">
                      {filtros.q ? "Talvez você goste destes" : "Veja também"}
                    </h2>
                    <ul className="mt-4 grid grid-cols-1 gap-3 min-[460px]:grid-cols-2 min-[460px]:gap-2.5 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
                      {sugestoes.map((p, i) => (
                        <li key={p.codigo} className="card-entra" style={{ "--i": i } as React.CSSProperties}>
                          <CardProduto produto={p} />
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </>
            )}
            <Paginacao filtros={filtros} pagina={resultado.pagina} totalPaginas={resultado.totalPaginas} total={resultado.total} />
            {resultado.total > 0 && resultado.pagina === resultado.totalPaginas && <NaoAchou termo={filtros.q} variante="rodape" />}
          </AreaResultados>
        </div>
      </div>

      <SecaoPromocoes origem={depto ? "categoria" : "produtos"} tom="claro" aninhada />
    </div>
  );
}
/** Esqueleto mostrado enquanto o catálogo carrega (formas cinza no lugar dos cards). */
export function CatalogoEsqueleto() {
  return (
    <div className="container-site pt-4 pb-16 lg:pt-6" aria-busy="true" aria-label="Carregando produtos">
      <div className="h-11 w-48 rounded bg-white/70" />
      <div className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[248px_minmax(0,1fr)] lg:gap-10">
        <div className="hidden space-y-3 lg:block">
          <div className="h-8 w-40 rounded bg-white" />
          {Array.from({ length: 9 }, (_, i) => (
            <div key={i} className="h-5 rounded bg-white/80" style={{ width: `${60 + ((i * 17) % 35)}%` }} />
          ))}
        </div>
        <ul className="grid grid-cols-1 gap-3 min-[460px]:grid-cols-2 min-[460px]:gap-2.5 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <li key={i} className="animate-pulse overflow-hidden rounded-card bg-white ring-1 ring-line">
              <div className="aspect-square bg-tint/60" />
              <div className="space-y-2 p-4">
                <div className="h-3 w-1/3 rounded bg-tint" />
                <div className="h-4 rounded bg-tint" />
                <div className="h-6 w-1/2 rounded bg-tint" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
