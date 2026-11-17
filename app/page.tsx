import type { Metadata } from "next";
import { Assistencia } from "@/components/Assistencia";
import { Avaliacoes } from "@/components/Avaliacoes";
import { Caminhos } from "@/components/Caminhos";
import { Categorias } from "@/components/Categorias";
import { CtaOrcamento } from "@/components/CtaOrcamento";
import { Hero } from "@/components/Hero";
import { MaisVendidos } from "@/components/MaisVendidos";
import { MarcasMarquee } from "@/components/MarcasMarquee";
import { PerguntasFrequentes } from "@/components/PerguntasFrequentes";
import { SecaoPromocoes } from "@/components/promocoes/SecaoPromocoes";
import { Sobre } from "@/components/Sobre";
import { TiposOrcamento } from "@/components/TiposOrcamento";
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
      <section id="sobre" aria-labelledby="sobre-titulo" className="section-y bg-tint">
        <Sobre />
        <div className="container-site">
          <MarcasMarquee />
          <Avaliacoes />
        </div>
      </section>

      <TiposOrcamento />
      <CtaOrcamento />
      <VisiteLoja />
      <PerguntasFrequentes />
    </>
  );
}
