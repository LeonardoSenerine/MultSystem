import type { Metadata } from "next";
import { CabecalhoPagina } from "@/components/CabecalhoPagina";
import { CtaOrcamento } from "@/components/CtaOrcamento";
import { TiposOrcamento } from "@/components/TiposOrcamento";

// TODO (etapa 5): lista de produtos escolhidos no site junto com o formulário.
export const metadata: Metadata = {
  title: "Pedir orçamento",
  description: "Peça um orçamento para empresa ou para casa, com nota fiscal e garantia.",
  alternates: { canonical: "/orcamento" },
};

export default function OrcamentoPage() {
  return (
    <>
      <CabecalhoPagina
        eyebrow="Orçamento"
        titulo="Pedir orçamento"
        texto="Conte o que precisa e a gente responde com preço, prazo e condição, sempre com nota fiscal. Vale para empresa e para casa."
        imagem={{ src: "/img/caminhos/empresa.jpg", posicao: "center 35%" }}
        pontos={["Preço, prazo e condição por escrito", "Nota fiscal no CNPJ", "Resposta em horário comercial"]}
      />
      <TiposOrcamento />
      <CtaOrcamento />
    </>
  );
}