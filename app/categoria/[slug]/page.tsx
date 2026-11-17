import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Catalogo, CatalogoEsqueleto } from "@/components/catalogo/Catalogo";
import { departamentoOutros, departamentos } from "@/data/departamentos";

const todos = [...departamentos, departamentoOutros];

export function generateStaticParams() {
  return todos.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/categoria/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const depto = todos.find((d) => d.slug === slug);
  if (!depto) return {};
  return {
    title: depto.nome,
    description: `${depto.nome} na Multsystems, em Itatiba: ${depto.descricao.toLowerCase()}. Cartão em até 3x sem juros, nota fiscal e retirada na loja.`,
    alternates: { canonical: `/categoria/${depto.slug}` },
  };
}

async function Conteudo({ params, searchParams }: PageProps<"/categoria/[slug]">) {
  const { slug } = await params;
  if (!todos.some((d) => d.slug === slug)) notFound();
  return <Catalogo searchParams={searchParams} departamento={slug} />;
}

/** O slug e os filtros são lidos dentro do Suspense: a navegação mostra o esqueleto na hora. */
export default function CategoriaPage(props: PageProps<"/categoria/[slug]">) {
  return (
    <div className="bg-tint">
      <Suspense fallback={<CatalogoEsqueleto />}>
        <Conteudo {...props} />
      </Suspense>
    </div>
  );
}
