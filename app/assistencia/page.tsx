import type { Metadata } from "next";
import { Info } from "lucide-react";
import { Assistencia } from "@/components/Assistencia";
import { Button } from "@/components/Button";
import { FormularioTecnico } from "@/components/assistencia/FormularioTecnico";
import { CabecalhoPagina } from "@/components/CabecalhoPagina";
import { Faq } from "@/components/Faq";
import { FundoOndas } from "@/components/FundoOndas";
import { Reveal } from "@/components/Reveal";
import { perguntasAssistencia } from "@/data/faq-assistencia";
import { getContato } from "@/lib/dados";

// TODO (etapa 4): serviços em detalhe, com prazos, e fotos reais da bancada da Total Tech.
export const metadata: Metadata = {
  title: "Assistência técnica Total Tech",
  description:
    "Conserto de notebook e PC em Itatiba com a Total Tech, empresa parceira que atende dentro da loja da Multsystems. Avaliação em 24h, orçamento do conserto antes de começar e 90 dias de garantia.",
  alternates: { canonical: "/assistencia" },
};

export default function AssistenciaPage() {
  const contato = getContato();

  return (
    <>
      <CabecalhoPagina
        titulo="Assistência técnica Total Tech"
        texto="Quem faz o conserto é a Total Tech, empresa parceira que atende dentro da loja da Multsystems. Ela cuida da avaliação (paga), do orçamento, do conserto e da garantia. A Multsystems não faz o serviço técnico."
        imagem={{ src: "/img/caminhos/assistencia.jpg", posicao: "center 45%" }}
        pontos={["Avaliação em até 24 horas", "Orçamento do conserto antes de começar", "90 dias de garantia Total Tech"]}
      >
        <Button href="#fale-com-o-tecnico" variante="branco" tamanho="lg" className="w-full sm:w-auto">
          Falar com a Total Tech
        </Button>
        <Button href="#perguntas-assistencia" variante="contorno-branco" tamanho="lg" className="w-full sm:w-auto">
          Ver perguntas frequentes
        </Button>
      </CabecalhoPagina>

      {/* Fale com o técnico: texto à esquerda, formulário à direita. */}
      {/* Mesmo fundo de ondas do Sobre da home (topo à direita e, invertidas, embaixo à esquerda). */}
      <section id="fale-com-o-tecnico" aria-labelledby="tecnico-titulo" className="relative isolate overflow-hidden section-y">
        <FundoOndas />
        <div className="container-site grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <Reveal>
            <p className="text-eyebrow text-brand">Fale com a Total Tech</p>
            <h2 id="tecnico-titulo" className="mt-2 text-h2 text-balance text-ink">
              Conte o que está acontecendo com o seu equipamento
            </h2>
            <p className="mt-4 max-w-[44ch] text-body-lg text-muted">
              Preencha os dados e descreva o problema. A conversa abre no WhatsApp da Total Tech com tudo escrito, e o técnico
              já responde sabendo do caso.
            </p>

            {/* Aviso: deixa claro que o serviço é da Total Tech, não da Multsystems. */}
            <div className="mt-6 flex max-w-[48ch] gap-3 rounded-card bg-white/80 p-4 ring-1 ring-line backdrop-blur-sm">
              <Info aria-hidden className="mt-0.5 size-5 shrink-0 text-brand" />
              <p className="text-small text-ink">
                <strong>O serviço é da Total Tech.</strong> É uma empresa parceira, separada da Multsystems, que atende dentro
                da nossa loja. A avaliação, o orçamento, o conserto e a garantia são feitos pela Total Tech. A Multsystems vende
                os produtos e não faz conserto.
              </p>
            </div>

            <p className="mt-5 text-small text-muted">
              A avaliação técnica é paga: o técnico informa o valor antes de começar. A Total Tech atende notebook, computador
              de mesa e nobreak, na loja, por suporte remoto ou com visita técnica.
            </p>
          </Reveal>
          <Reveal atraso={100}>
            <FormularioTecnico whatsapp={contato.whatsappTotalTech.replace(/\D/g, "")} />
          </Reveal>
        </div>
      </section>

      <Assistencia />

      <section id="perguntas-assistencia" aria-labelledby="faq-assistencia-titulo" className="section-y bg-tint">
        <div className="container-site">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-eyebrow text-brand">Perguntas frequentes</p>
            <h2 id="faq-assistencia-titulo" className="mt-2 text-h2 text-balance text-ink">
              Dúvidas sobre o conserto
            </h2>
          </Reveal>
          <Reveal className="mx-auto mt-6 max-w-3xl lg:mt-10" atraso={100}>
            <Faq perguntas={perguntasAssistencia} />
          </Reveal>
          <p className="mx-auto mt-6 max-w-3xl text-center text-small text-muted">
            Ficou outra dúvida?{" "}
            <a href="#fale-com-o-tecnico" className="inline-flex min-h-11 items-center font-bold text-brand hover:underline">
              Pergunte direto ao técnico
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
