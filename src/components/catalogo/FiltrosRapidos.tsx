import Link from "next/link";
import { Check } from "lucide-react";
import { EtiquetasRolaveis } from "@/components/catalogo/EtiquetasRolaveis";
import { departamentoOutros, departamentos } from "@/data/departamentos";
import { nomeDaMarca } from "@/lib/catalogo";
import { urlFiltros, type Filtros, type ResultadoCatalogo } from "@/lib/filtros";

const base =
  "inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-4 text-[14px] font-semibold whitespace-nowrap transition-[background-color,color,box-shadow,transform] duration-200 hover:-translate-y-px active:translate-y-0 active:scale-95";
const normal = `${base} bg-white text-ink ring-1 ring-line hover:text-brand hover:ring-brand`;
const ativa = `${base} bg-brand text-white ring-1 ring-brand hover:bg-[#263b73]`;

type Atalho = { chave: string; nome: string; href: string; ativo: boolean };

/**
 * Atalhos de filtro numa linha só: categorias do departamento (ou os departamentos, na página
 * de todos os produtos), as marcas mais comuns do resultado e "Até R$ 100".
 * Mostra só o que ainda dá para acrescentar (o que já está ligado fica em "Filtrando por"),
 * e os filtros se somam: Mouses + Logitech + Até R$ 100.
 */
export function FiltrosRapidos({ filtros, resultado }: { filtros: Filtros; resultado: ResultadoCatalogo }) {
  const depto = [...departamentos, departamentoOutros].find((d) => d.slug === filtros.departamento);
  const atalhos: Atalho[] = [];

  if (depto) {
    depto.subcategorias
      .map((s) => ({ ...s, n: resultado.subcategorias.get(s.slug) ?? 0 }))
      .filter((s) => s.n > 0)
      .sort((a, b) => b.n - a.n)
      .forEach((s) =>
        atalhos.push({
          chave: `sub-${s.slug}`,
          nome: s.nome,
          href: urlFiltros(filtros, { sub: filtros.sub === s.slug ? "" : s.slug }),
          ativo: filtros.sub === s.slug,
        }),
      );
  } else {
    [...resultado.departamentos]
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 6)
      .forEach((d) =>
        atalhos.push({ chave: `dep-${d.slug}`, nome: d.nome, href: urlFiltros({ ...filtros, departamento: d.slug, sub: "" }), ativo: false }),
      );
  }

  // As 3 marcas com mais produtos aqui que ainda não foram escolhidas.
  const marcas = resultado.marcas
    .map(([slug]) => slug)
    .filter((slug) => !filtros.marcas.includes(slug))
    .slice(0, 3);
  for (const slug of marcas) {
    const marcada = filtros.marcas.includes(slug);
    atalhos.push({
      chave: `marca-${slug}`,
      nome: nomeDaMarca.get(slug) ?? slug,
      href: urlFiltros(filtros, { marcas: marcada ? filtros.marcas.filter((m) => m !== slug) : [...filtros.marcas, slug] }),
      ativo: marcada,
    });
  }

  const ate100 = filtros.min === undefined && filtros.max === 100;
  atalhos.push({
    chave: "ate-100",
    nome: "Até R$ 100",
    href: urlFiltros(filtros, ate100 ? { min: undefined, max: undefined } : { min: undefined, max: 100 }),
    ativo: ate100,
  });

  return (
    <EtiquetasRolaveis rotulo="Filtros rápidos">
      {atalhos
        .filter((a) => !a.ativo)
        .map((a) => (
        <li key={a.chave} className="chip-entra shrink-0">
          <Link href={a.href} scroll={false} aria-current={a.ativo || undefined} className={a.ativo ? ativa : normal}>
            {a.ativo && <Check aria-hidden className="size-4" strokeWidth={2.5} />}
            {a.nome}
          </Link>
        </li>
      ))}
    </EtiquetasRolaveis>
  );
}
