import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { CabecalhoPagina } from "@/components/CabecalhoPagina";
import { FormularioContato } from "@/components/contato/FormularioContato";
import { FundoOndas } from "@/components/FundoOndas";
import { HorarioTexto } from "@/components/loja/HorarioTexto";
import { PerguntasFrequentes } from "@/components/PerguntasFrequentes";
import { Reveal } from "@/components/Reveal";
import { VisiteLoja } from "@/components/VisiteLoja";
import { getContato } from "@/lib/dados";
import { mensagens, whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contato",
  description: "WhatsApp, telefone, e-mail e endereço da Multsystems no Centro de Itatiba/SP. Fale com a loja ou com a assistência técnica.",
  alternates: { canonical: "/contato" },
};

export default function ContatoPage() {
  const contato = getContato();

  // Cada canal: o que é, para que serve e para onde leva. Mesmos dados de contato do resto do site.
  const canais = [
    { nome: "WhatsApp da loja", detalhe: "Vendas, preços e pedidos", href: whatsappLink(contato.whatsapp, mensagens.geral), externo: true },
    { nome: "WhatsApp da assistência", detalhe: "Total Tech, conserto de notebook e PC", href: whatsappLink(contato.whatsappTotalTech, mensagens.totalTech), externo: true },
    { nome: contato.telefone, detalhe: "Ligar para a loja", href: contato.telefoneLink, externo: false },
    { nome: contato.email, detalhe: "Orçamentos e documentos", href: `mailto:${contato.email}`, externo: false },
    { nome: "Mercado Livre", detalhe: `Loja oficial, nota ${contato.mercadoLivreNota}`, href: contato.mercadoLivreUrl, externo: true },
    { nome: contato.instagramUsuario, detalhe: "Novidades e ofertas", href: contato.instagramUrl, externo: true },
  ];

  return (
    <>
      <CabecalhoPagina
        eyebrow="Fale com a gente"
        titulo="Contato"
        texto="WhatsApp, telefone ou na loja: quem atende é quem vende. Escolha o canal mais fácil e conte o que você precisa."
        imagem={{ src: "/img/caminhos/casa.jpg", posicao: "center 30%" }}
        pontos={["Resposta em horário comercial", "WhatsApp, telefone e e-mail", "Loja no Centro de Itatiba"]}
      />

      {/* Mesmo fundo de ondas da home, da assistência e de empresas. */}
      <section aria-labelledby="canais-titulo" className="relative isolate overflow-hidden section-y">
        <FundoOndas />
        <div className="container-site grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <Reveal>
              <h2 id="canais-titulo" className="text-h2 text-balance text-ink">
                Escolha o jeito mais fácil para você
              </h2>
              <p className="mt-4 max-w-[44ch] text-body-lg text-muted">
                <HorarioTexto />
              </p>
            </Reveal>
            <ul className="mt-8 divide-y divide-line border-y border-line">
              {canais.map((c, i) => (
                <Reveal as="li" key={c.nome} atraso={i * 60}>
                  <a
                    href={c.href}
                    {...(c.externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex min-h-16 items-center justify-between gap-4 py-3 transition-colors"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-body font-bold text-ink transition-colors group-hover:text-brand">{c.nome}</span>
                      <span className="block text-small text-muted">{c.detalhe}</span>
                    </span>
                    <ArrowUpRight
                      aria-hidden
                      className="size-5 shrink-0 text-muted transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand"
                    />
                  </a>
                </Reveal>
              ))}
            </ul>
          </div>

          <Reveal atraso={100}>
            <FormularioContato
              whatsappLoja={contato.whatsapp.replace(/\D/g, "")}
              whatsappTotalTech={contato.whatsappTotalTech.replace(/\D/g, "")}
            />
          </Reveal>
        </div>
      </section>

      <VisiteLoja />
      <PerguntasFrequentes />
    </>
  );
}
