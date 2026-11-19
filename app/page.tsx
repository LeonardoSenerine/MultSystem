import type { Metadata } from "next";
import { Assistencia } from "@/components/Assistencia";
import { Avaliacoes } from "@/components/Avaliacoes";
import { Caminhos } from "@/components/Caminhos";
import { Categorias } from "@/components/Categorias";
import { CtaOrcamento } from "@/components/CtaOrcamento";
import { FundoOndas } from "@/components/FundoOndas";
import { Hero } from "@/components/Hero";
import { MaisVendidos } from "@/components/MaisVendidos";
import { MarcasMarquee } from "@/components/MarcasMarquee";
import { PerguntasFrequentes } from "@/components/PerguntasFrequentes";
import { SecaoPromocoes } from "@/components/promocoes/SecaoPromocoes";
import { Sobre } from "@/components/Sobre";
import { VisiteLoja } from "@/components/VisiteLoja";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return (
    <>
      <Hero />
      <Caminhos />
      <Categorias />
      <MaisVendidos />
      <SecaoPromocoes origem="home" />
      <Assistencia />

      {/* Sobre a empresa, marcas e avaliações numa faixa tint só. */}
      {/* Fundo de ondas na faixa inteira: no topo à direita e, invertidas, embaixo à esquerda. */}
      <section id="sobre" aria-labelledby="sobre-titulo" className="relative isolate overflow-hidden bg-tint pt-16 pb-16 lg:pt-24 lg:pb-32">
        <FundoOndas />
        <Sobre />
        <div className="container-site">
          <MarcasMarquee />
          <Avaliacoes />
        </div>
      </section>

      {/* Um só pedido de orçamento na home. Os 8 tipos em cards (com modal) ficam em /empresas. */}
      <CtaOrcamento />
      <VisiteLoja />
      <PerguntasFrequentes />
    </>
  );
}
