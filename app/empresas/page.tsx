import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/Button";
import { CabecalhoPagina } from "@/components/CabecalhoPagina";
import { CtaOrcamento } from "@/components/CtaOrcamento";
import { Faq } from "@/components/Faq";
import { WhatsAppIcon } from "@/components/icones-marca";
import { MarcasMarquee } from "@/components/MarcasMarquee";
import { Reveal } from "@/components/Reveal";
import { TiposOrcamento } from "@/components/TiposOrcamento";
import { perguntasEmpresas } from "@/data/faq-empresas";
import { getContato } from "@/lib/dados";
import { mensagens, whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Para empresas",
  description:
    "Informática para empresas em Itatiba: cotação com nota fiscal no CNPJ, condição para compra recorrente e um vendedor que acompanha o pedido do começo ao fim.",
  alternates: { canonical: "/empresas" },
};

const passos = [
  { titulo: "Conte o que precisa", detalhe: "Pelo formulário, pelo carrinho do site ou direto no WhatsApp. Pode ser um item ou uma lista." },
  { titulo: "Receba a cotação", detalhe: "Preço, prazo e condição por escrito, com nota fiscal no CNPJ, em horário comercial." },
  { titulo: "Aprove e combine o pagamento", detalhe: "O vendedor confirma estoque e a forma de pagamento. Nada é cobrado sem o seu ok." },
  { titulo: "Receba ou retire", detalhe: "Entrega em Itatiba e região, envio para o Brasil ou retirada no balcão." },
] as const;

// O que muda para quem compra como empresa. Mesmas promessas já usadas na home.
const diferenciais = [
  { titulo: "Nota fiscal no CNPJ", texto: "Toda venda com nota, emitida no CNPJ da empresa, para você lançar e depreciar sem dor de cabeça." },
  { titulo: "Um vendedor do começo ao fim", texto: "Quem monta a cotação acompanha o pedido até a entrega. Você fala sempre com a mesma pessoa." },
  { titulo: "Compra recorrente", texto: "Toner, cartucho, papel e peças de reposição com condição especial. Salve o carrinho como lista e repita o pedido com um clique." },
  { titulo: "Tudo no mesmo lugar", texto: "Máquinas, impressão, rede, câmeras e nobreaks numa cotação só, e a manutenção pela Total Tech." },
] as const;

export default function EmpresasPage() {
  const contato = getContato();

  return (
    <>
      <CabecalhoPagina
        titulo="Informática para a sua empresa"
        texto="Cotação com nota fiscal, condição especial para compra recorrente e um vendedor que acompanha o pedido do começo ao fim."
        imagem={{ src: "/img/categorias/wifi.jpg", posicao: "center 40%" }}
        pontos={["Nota fiscal no CNPJ", "Um vendedor do começo ao fim", "Entrega em Itatiba e região"]}
      >
        <Button href="#tipos-orcamento" variante="branco" tamanho="lg" className="w-full sm:w-auto">
          Pedir orçamento
        </Button>
        <Button
          href={whatsappLink(contato.whatsapp, mensagens.orcamento)}
          variante="whatsapp"
          tamanho="lg"
          className="w-full sm:w-auto"
          icone={<WhatsAppIcon className="size-5" />}
        >
          Falar com um vendedor
        </Button>
      </CabecalhoPagina>

      <section aria-labelledby="como-titulo" className="section-y">
        <div className="container-site">
          <Reveal className="max-w-[60ch]">
            <p className="text-eyebrow text-brand">Como funciona</p>
            <h2 id="como-titulo" className="mt-2 text-h2 text-balance text-ink">
              Da cotação à entrega, em quatro passos
            </h2>
          </Reveal>
          <ol className="mt-8 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
            {passos.map((p, i) => (
              <Reveal as="li" key={p.titulo} atraso={i * 90} className="group border-t-2 border-line pt-5 transition-colors duration-300 hover:border-brand">
                <span aria-hidden className="text-[34px] leading-10 font-extrabold tracking-tight text-brand/25 tabular-nums transition-colors duration-300 group-hover:text-brand">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-h3 text-ink">{p.titulo}</h3>
                <p className="mt-2 text-body text-muted">{p.detalhe}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="diferenciais-titulo" className="on-dark section-y bg-navy text-white">
        <div className="container-site grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <Reveal>
            <p className="text-eyebrow text-brand-light">Por que comprar aqui</p>
            <h2 id="diferenciais-titulo" className="mt-3 text-h2 text-balance">
              O que muda quando quem compra é a empresa
            </h2>
            <p className="mt-4 max-w-[44ch] text-body-lg text-white/85">
              Vender para empresas é a nossa especialidade. O atendimento é pensado para quem precisa decidir rápido e comprar certo.
            </p>
            <Link
              href="/assistencia"
              className="group mt-8 inline-flex min-h-11 items-center gap-2 font-bold text-white underline-offset-4 hover:underline"
            >
              Conheça a assistência técnica Total Tech
              <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Reveal>

          <ul className="divide-y divide-white/15 border-y border-white/15">
            {diferenciais.map((d, i) => (
              <Reveal as="li" key={d.titulo} atraso={i * 80} className="group grid gap-1 py-6 transition-colors sm:grid-cols-[14rem_1fr] sm:gap-8">
                <h3 className="text-h3 transition-transform duration-300 group-hover:translate-x-1">{d.titulo}</h3>
                <p className="text-body text-white/80">{d.texto}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* As marcas ficam dentro da seção dos tipos de orçamento, para o fundo de ondas cobrir as duas. */}
      <TiposOrcamento>
        <MarcasMarquee />
      </TiposOrcamento>

      <CtaOrcamento />

      <section id="perguntas-empresas" aria-labelledby="faq-empresas-titulo" className="section-y bg-tint">
        <div className="container-site">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-eyebrow text-brand">Perguntas frequentes</p>
            <h2 id="faq-empresas-titulo" className="mt-2 text-h2 text-balance text-ink">
              Dúvidas de quem compra para a empresa
            </h2>
          </Reveal>
          <Reveal className="mx-auto mt-6 max-w-3xl lg:mt-10" atraso={100}>
            <Faq perguntas={perguntasEmpresas} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
