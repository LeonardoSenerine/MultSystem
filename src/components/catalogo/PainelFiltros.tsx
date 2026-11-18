import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { FormularioFaixaPreco } from "@/components/catalogo/FormularioFaixaPreco";
import { ListaMarcas } from "@/components/catalogo/ListaMarcas";
import { SecaoFiltro } from "@/components/catalogo/SecaoFiltro";
import { departamentoOutros, departamentos } from "@/data/departamentos";
import { nomeDaMarca } from "@/lib/catalogo";
import { urlFiltros, type Filtros, type ResultadoCatalogo } from "@/lib/filtros";
import { formatarPreco } from "@/lib/formato";

const linha =
  "group/linha flex min-h-11 items-center justify-between gap-3 rounded-[10px] px-2 text-[14px] leading-5 transition-[background-color,transform] duration-200 hover:bg-tint active:scale-[0.98]";

function Contagem({ n, ativa = false }: { n: number; ativa?: boolean }) {
  return (
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 text-[12px] leading-4 font-semibold tabular-nums transition-colors duration-200 ${
        ativa ? "bg-brand text-white" : "bg-tint text-muted group-hover/linha:bg-white"
      }`}
    >
      {n}
    </span>
  );
}

/** Bolinha de escolha única (categoria). */
function Bolinha({ marcada }: { marcada: boolean }) {
  return (
    <span
      aria-hidden
      className={`grid size-5 shrink-0 place-items-center rounded-full border-[1.5px] transition-[border-color,box-shadow] duration-200 ${
        marcada ? "border-brand shadow-[0_0_0_3px_rgb(46_70_134/0.14)]" : "border-[#b9c3dc] bg-white group-hover/linha:border-brand"
      }`}
    >
      <span
        className={`size-2.5 rounded-full bg-brand transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          marcada ? "scale-100" : "scale-0"
        }`}
      />
    </span>
  );
}

const pilula =
  "inline-flex min-h-11 items-center rounded-full px-3.5 text-[13px] font-semibold whitespace-nowrap transition-[background-color,color,box-shadow,transform] duration-200 hover:-translate-y-px active:translate-y-0 active:scale-95";

function textoPreco(min?: number, max?: number) {
  if (min !== undefined && max !== undefined) return `${formatarPreco(min)} a ${formatarPreco(max)}`;
  if (min !== undefined) return `A partir de ${formatarPreco(min)}`;
  if (max !== undefined) return `Até ${formatarPreco(max)}`;
  return undefined;
}

/**
 * Painel de filtros: blocos que abrem e fecham, com o que está escolhido escrito no título
 * (visível mesmo fechado), "Limpar" por filtro e a quantidade de produtos de cada opção.
 * `prefixo` diferencia os ids do painel lateral e da gaveta; `compacto` (gaveta do celular)
 * começa com os blocos fechados, menos o primeiro, para caber na tela.
 */
export function PainelFiltros({
  filtros,
  resultado,
  prefixo,
  compacto = false,
}: {
  filtros: Filtros;
  resultado: ResultadoCatalogo;
  prefixo: string;
  compacto?: boolean;
}) {
  const depto = [...departamentos, departamentoOutros].find((d) => d.slug === filtros.departamento);
  const subs = depto
    ? depto.subcategorias
        .map((s) => ({ ...s, quantidade: resultado.subcategorias.get(s.slug) ?? 0 }))
        .filter((s) => s.quantidade > 0)
    : [];
  const subAtual = subs.find((s) => s.slug === filtros.sub);
  const marcasEscolhidas = filtros.marcas.map((m) => nomeDaMarca.get(m) ?? m);
  const precoEscolhido = textoPreco(filtros.min, filtros.max);
  const faixaAtual = resultado.faixas.find((f) => f.min === filtros.min && f.max === filtros.max);

  return (
    <div>
      {depto ? (
        <SecaoFiltro nome="Categoria" escolhido={subAtual?.nome} limpar={urlFiltros(filtros, { sub: "" })}>
          <ul>
            <li>
              <Link href={urlFiltros(filtros, { sub: "" })} scroll={false} className={linha}>
                <span className="flex items-center gap-3">
                  <Bolinha marcada={!filtros.sub} />
                  <span className={filtros.sub ? "text-ink/85" : "font-bold text-ink"}>Todas as categorias</span>
                </span>
                <Contagem n={subs.reduce((s, x) => s + x.quantidade, 0)} ativa={!filtros.sub} />
              </Link>
            </li>
            {subs.map((s) => {
              const ativa = filtros.sub === s.slug;
              return (
                <li key={s.slug}>
                  <Link
                    href={urlFiltros(filtros, { sub: ativa ? "" : s.slug })}
                    scroll={false}
                    aria-current={ativa || undefined}
                    className={linha}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <Bolinha marcada={ativa} />
                      <span className={`truncate ${ativa ? "font-bold text-ink" : "text-ink/85"}`}>{s.nome}</span>
                    </span>
                    <Contagem n={s.quantidade} ativa={ativa} />
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            href={urlFiltros({ ...filtros, departamento: "", sub: "" })}
            className="mt-1 inline-flex min-h-11 items-center gap-1 px-2 text-[14px] font-bold text-brand hover:underline"
          >
            Ver outros departamentos
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </SecaoFiltro>
      ) : resultado.departamentos.length === 0 ? null : (
        <SecaoFiltro nome="Departamento">
          <ul>
            {resultado.departamentos.map((d) => (
              <li key={d.slug}>
                <Link href={urlFiltros({ ...filtros, departamento: d.slug, sub: "" })} className={linha}>
                  <span className="truncate text-ink/85 group-hover/linha:text-ink">{d.nome}</span>
                  <span className="flex items-center gap-1.5">
                    <Contagem n={d.quantidade} />
                    <ChevronRight aria-hidden className="size-4 text-muted/60 transition-transform group-hover/linha:translate-x-0.5 group-hover/linha:text-brand" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </SecaoFiltro>
      )}

      {resultado.marcas.length > 0 && (
        <SecaoFiltro
          nome="Marca"
          escolhido={marcasEscolhidas.length ? marcasEscolhidas.join(", ") : undefined}
          limpar={urlFiltros(filtros, { marcas: [] })}
          aberta={!compacto || marcasEscolhidas.length > 0}
        >
          <ListaMarcas
            prefixo={prefixo}
            opcoes={resultado.marcas.map(([slug, quantidade]) => {
              const marcada = filtros.marcas.includes(slug);
              return {
                slug,
                nome: nomeDaMarca.get(slug) ?? slug,
                quantidade,
                marcada,
                href: urlFiltros(filtros, {
                  marcas: marcada ? filtros.marcas.filter((m) => m !== slug) : [...filtros.marcas, slug],
                }),
              };
            })}
          />
        </SecaoFiltro>
      )}

      <SecaoFiltro
        nome="Preço"
        escolhido={precoEscolhido}
        limpar={urlFiltros(filtros, { min: undefined, max: undefined })}
        aberta={!compacto || Boolean(precoEscolhido)}
      >
        <ul className="flex flex-wrap gap-2">
          {resultado.faixas
            .filter((f) => f.quantidade > 0)
            .map((f) => {
              const ativa = faixaAtual === f;
              return (
                <li key={f.nome}>
                  <Link
                    href={urlFiltros(filtros, ativa ? { min: undefined, max: undefined } : { min: f.min, max: f.max })}
                    scroll={false}
                    aria-current={ativa || undefined}
                    className={`${pilula} ${
                      ativa ? "bg-brand text-white" : "bg-white text-ink ring-1 ring-line hover:text-brand hover:ring-brand"
                    }`}
                  >
                    {f.nome}
                  </Link>
                </li>
              );
            })}
        </ul>

        {/* Faixa livre: formulário GET comum (funciona sem JavaScript) que, com JavaScript, só troca a lista. */}
        <FormularioFaixaPreco
          action={filtros.departamento ? `/categoria/${filtros.departamento}` : "/produtos"}
          prefixo={prefixo}
          min={filtros.min}
          max={filtros.max}
          ocultos={[
            ...(filtros.q ? ([["q", filtros.q]] as [string, string][]) : []),
            ...(filtros.sub ? ([["sub", filtros.sub]] as [string, string][]) : []),
            ...(filtros.marcas.length > 0 ? ([["marca", filtros.marcas.join(",")]] as [string, string][]) : []),
            ...(filtros.ordem !== "relevancia" ? ([["ordem", filtros.ordem]] as [string, string][]) : []),
          ]}
        />      </SecaoFiltro>
    </div>
  );
}
