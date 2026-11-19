import type { Metadata } from "next";
import Image from "next/image";
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
      <section id="sobre" aria-labelledby="sobre-titulo" className="bg-tint pb-10 lg:pb-24">
        {/* Bloco "Sobre" com o fundo de ondas suaves; ele se dissolve no tint embaixo, antes das marcas. */}
        <div className="relative isolate overflow-hidden pt-10 pb-4 lg:pt-24 lg:pb-8">
          <Image
            src="/img/fundo-sobre.jpg"
            alt=""
            fill
            quality={80}
            sizes="100vw"
            className="-z-10 object-cover object-center"
          />
          <span aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-b from-transparent to-tint" />
          <Sobre />
        </div>
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
