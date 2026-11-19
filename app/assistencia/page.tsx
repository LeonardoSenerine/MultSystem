import type { Metadata } from "next";
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
  title: "Assistência técnica",
  description:
    "Conserto de notebook e PC em Itatiba com a Total Tech, dentro da loja da Multsystems. Avaliação em 24h, orçamento do conserto antes de começar e 90 dias de garantia.",
  alternates: { canonical: "/assistencia" },
};

export default function AssistenciaPage() {
  const contato = getContato();

  return (
    <>
      <CabecalhoPagina
        eyebrow="Total Tech, dentro da nossa loja"
        titulo="Assistência técnica"
        texto="Notebook, computador e nobreak. Você conta o problema, o técnico faz a avaliação (paga) e envia o orçamento do conserto. O serviço só começa se você aprovar."
        imagem={{ src: "/img/caminhos/assistencia.jpg", posicao: "center 45%" }}
        pontos={["Avaliação em até 24 horas", "Orçamento do conserto antes de começar", "90 dias de garantia"]}
      >
        <Button href="#fale-com-o-tecnico" variante="branco" tamanho="lg" className="w-full sm:w-auto">
          Falar com o técnico
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
            <p className="text-eyebrow text-brand">Fale com o técnico</p>
            <h2 id="tecnico-titulo" className="mt-2 text-h2 text-balance text-ink">
              Conte o que está acontecendo com o seu equipamento
            </h2>
            <p className="mt-4 max-w-[44ch] text-body-lg text-muted">
              Preencha os dados e descreva o problema. A conversa com a Total Tech abre no WhatsApp com tudo escrito, e o
              técnico já responde sabendo do caso.
            </p>
            <p className="mt-6 text-small text-muted">
              A avaliação técnica é paga: o técnico informa o valor antes de começar. Atendemos notebook, computador de mesa e nobreak, na loja, por suporte remoto ou com visita técnica.
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
