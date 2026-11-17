import type { Metadata } from "next";
import Image from "next/image";
import { Avaliacoes } from "@/components/Avaliacoes";
import { Button } from "@/components/Button";
import { CabecalhoPagina } from "@/components/CabecalhoPagina";
import { Categorias } from "@/components/Categorias";
import { WhatsAppIcon } from "@/components/icones-marca";
import { MarcasMarquee } from "@/components/MarcasMarquee";
import { Reveal } from "@/components/Reveal";
import { QuemSomos } from "@/components/sobre/QuemSomos";
import { VisiteLoja } from "@/components/VisiteLoja";
import { getContato } from "@/lib/dados";
import { mensagens, whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Sobre a Multsystems",
  description: "Loja de informática em Itatiba desde 1995, especializada em atendimento para empresas, com loja física no Centro.",
  alternates: { canonical: "/sobre" },
};

// Como a loja trabalha: três compromissos tirados do que o site já promete (quem atende é quem vende,
// preço com nota, pós-venda no balcão). TODO: dado real. Pedir à Multsystems a história (quem fundou,
// como começou, marcos) e fotos da equipe e da loja para completar esta página.
const principios = [
  { titulo: "Quem atende é quem vende", texto: "Você explica o que precisa e quem conhece o produto diz, sem rodeio, o que vale a pena. Sem script e sem empurrar o mais caro." },
  { titulo: "Preço claro, com nota fiscal", texto: "O valor que aparece é o valor do produto, e dá para parcelar em até 3x sem juros. Toda venda sai com nota fiscal, para pessoa física ou para o CNPJ da empresa." },
  { titulo: "Depois da compra, a gente continua", texto: "Deu problema ou ficou uma dúvida? Volte ao balcão ou chame no WhatsApp. A assistência técnica funciona dentro da própria loja." },
] as const;

// O que a Total Tech faz (mesmas informações da página de assistência).
const servicosTotalTech = [
  "Conserto de notebook, computador de mesa e nobreak",
  "Atendimento na loja, suporte remoto e visita técnica",
  "Avaliação em até 24 horas (paga) e orçamento do conserto",
  "90 dias de garantia em todo serviço",
] as const;

export default function SobrePage() {
  const contato = getContato();

  return (
    <>
      <CabecalhoPagina
        eyebrow="Desde 1995"
        titulo="Sobre a Multsystems"
        texto="Loja de informática no Centro de Itatiba, com atendimento de balcão e foco em quem compra para a empresa."
        imagem={{ src: "/img/fachada-noite.jpg", posicao: "center 45%", lado: true }}
        pontos={["Loja física no Centro", "Atendimento de balcão", "Especialistas em B2B"]}
      />

      <QuemSomos />

      {/* Como trabalhamos: três cartões do mesmo tamanho, cada um com número, título e texto. */}
      <section aria-labelledby="principios-titulo" className="section-y bg-tint">
        <div className="container-site">
          <Reveal className="max-w-[60ch]">
            <p className="text-eyebrow text-brand">Como trabalhamos</p>
            <h2 id="principios-titulo" className="mt-2 text-h2 text-balance text-ink">
              Três compromissos que não mudam
            </h2>
          </Reveal>
          <ol className="mt-8 grid gap-4 lg:mt-12 lg:grid-cols-3 lg:gap-6">
            {principios.map((p, i) => (
              <Reveal
                as="li"
                key={p.titulo}
                atraso={i * 90}
                className="barra-topo group flex flex-col rounded-card bg-white p-6 ring-1 ring-line transition-[box-shadow,transform,--tw-ring-color] duration-300 hover:shadow-card hover:ring-brand/30 lg:p-8 lg:hover:-translate-y-0.5"
              >
                <span aria-hidden className="text-[34px] leading-10 font-extrabold tracking-tight text-brand/25 tabular-nums transition-colors duration-300 group-hover:text-brand">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-h3 text-ink lg:text-[22px] lg:leading-7">{p.titulo}</h3>
                <p className="mt-3 text-body text-muted">{p.texto}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <Categorias />

      {/* Total Tech: foto à esquerda e texto à direita, nas duas colunas com a mesma altura. */}
      <section aria-labelledby="totaltech-titulo" className="on-dark section-y bg-navy text-white">
        <div className="container-site grid gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-16">
          <Reveal className="foto-revela relative aspect-[4/3] overflow-hidden rounded-photo lg:aspect-auto lg:min-h-[460px]">
            <Image
              src="/img/bancada.jpg"
              alt="Técnico da Total Tech trabalhando na bancada"
              fill
              quality={85}
              sizes="(min-width: 1200px) 568px, (min-width: 1024px) 46vw, 100vw"
              className="object-cover"
            />
          </Reveal>

          <Reveal className="flex flex-col justify-center" atraso={120}>
            <p className="text-eyebrow text-brand-light">Parceira dentro da loja</p>
            <h2 id="totaltech-titulo" className="mt-3 text-h2 text-balance">
              A assistência técnica é da Total Tech
            </h2>
            <p className="mt-4 max-w-[48ch] text-body-lg text-white/85">
              Empresa parceira, separada da Multsystems, que funciona no mesmo endereço. Você compra aqui e, se o equipamento
              precisar de conserto, a bancada fica a poucos passos.
            </p>

            <ul className="mt-6 divide-y divide-white/15 border-y border-white/15">
              {servicosTotalTech.map((s, i) => (
                <Reveal as="li" key={s} atraso={i * 90} className="group flex items-center gap-3 py-3 text-body text-white/90">
                  <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-brand-light transition-transform duration-300 group-hover:scale-150" />
                  <span className="transition-transform duration-300 group-hover:translate-x-1">{s}</span>
                </Reveal>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/assistencia" variante="branco" tamanho="lg" className="w-full sm:w-auto">
                Ver a assistência técnica
              </Button>
              <Button
                href={whatsappLink(contato.whatsappTotalTech, mensagens.totalTech)}
                variante="contorno-branco"
                tamanho="lg"
                className="w-full sm:w-auto"
                icone={<WhatsAppIcon className="size-5" />}
              >
                Falar com a Total Tech
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section aria-label="Marcas e avaliações" className="section-y bg-tint">
        {/* O carrossel e as avaliações trazem uma margem de topo pensada para a home: aqui ela é descontada. */}
        <div className="container-site -mt-20 lg:-mt-32">
          <MarcasMarquee />
          <Avaliacoes />
        </div>
      </section>

      <VisiteLoja />
    </>
  );
}
