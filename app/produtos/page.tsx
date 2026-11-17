import type { Metadata } from "next";
import { Suspense } from "react";
import { Catalogo, CatalogoEsqueleto } from "@/components/catalogo/Catalogo";

export const metadata: Metadata = {
  title: "Produtos",
  description:
    "Todos os produtos da Multsystems em Itatiba: computadores, impressoras, redes, câmeras, periféricos e peças, com cartão em até 3x sem juros, nota fiscal e retirada na loja.",
  alternates: { canonical: "/produtos" },
};

export default function ProdutosPage({ searchParams }: PageProps<"/produtos">) {
  return (
    <div className="bg-tint">
      <Suspense fallback={<CatalogoEsqueleto />}>
        <Catalogo searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
