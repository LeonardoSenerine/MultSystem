import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/Button";
import { CabecalhoPagina } from "@/components/CabecalhoPagina";
import { Faq } from "@/components/Faq";
import { WhatsAppIcon } from "@/components/icones-marca";
import { Reveal } from "@/components/Reveal";
import { perguntasCompra } from "@/data/faq-compra";
import { getContato } from "@/lib/dados";
import { mensagens, whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Como comprar, pagar e receber",
  description:
    "Como comprar na Multsystems: escolha no site, feche pelo WhatsApp, pague no PIX ou no cartão em até 3x sem juros e retire na loja de Itatiba ou receba.",
  alternates: { canonical: "/como-comprar" },
};

const passos = [
  { titulo: "Escolha no site", detalhe: "Navegue pelos departamentos ou busque por nome, marca ou código. O preço do site já é o valor do produto, com nota fiscal." },
  { titulo: "Monte o carrinho", detalhe: "Adicione os produtos, ajuste as quantidades (respeitando o estoque) e salve nos favoritos o que quiser acompanhar." },
  { titulo: "Feche pelo WhatsApp", detalhe: "O pedido vai para a conversa já escrito. O vendedor confirma estoque, entrega e forma de pagamento." },
  { titulo: "Pague e receba", detalhe: "Pague no PIX ou no cartão (até 3x sem juros) e retire na loja, em Itatiba, ou combine a entrega com o vendedor." },
] as const;

// Os blocos de informação: cada um com o essencial, sem repetir o que está nas perguntas.
const blocos = [
  {
    titulo: "Pagamento",
    itens: ["Preço do site: o valor do produto, com nota fiscal.", "Cartão: em até 3x sem juros. PIX também.", "Empresa: condição e nota no CNPJ pelo orçamento."],
  },
  {
    titulo: "Entrega e retirada",
    itens: ["Retirada na loja, em Itatiba, sem custo.", "Entrega em Itatiba e região, e envio para todo o Brasil.", "Valor do frete e prazo: combinados com o vendedor antes de pagar."],
  },
  {
    titulo: "Troca e garantia",
    itens: ["Arrependimento em até 7 dias após o recebimento, nas compras à distância.", "Garantia do fabricante em todos os produtos.", "Suporte no balcão e pelo WhatsApp depois da compra."],
  },
] as const;

export default function ComoComprarPage() {
  const contato = getContato();

  return (
    <>
      <CabecalhoPagina
        eyebrow="Compre com tranquilidade"
        titulo="Como comprar, pagar e receber"
        texto="Do site ao balcão em quatro passos. Aqui estão o pagamento, a entrega, a nota fiscal e o que fazer se algo não sair como esperado."
        imagem={{ src: "/img/caminhos/casa.jpg", posicao: "center 30%" }}
        pontos={["Cartão em até 3x sem juros", "Retirada na loja ou entrega", "Nota fiscal em toda venda"]}
      >
        <Button href="/produtos" variante="branco" tamanho="lg" className="w-full sm:w-auto">
          Ver produtos
        </Button>
        <Button
          href={whatsappLink(contato.whatsapp, mensagens.geral)}
          variante="whatsapp"
          tamanho="lg"
          className="w-full sm:w-auto"
          icone={<WhatsAppIcon className="size-5" />}
        >
          Tirar uma dúvida
        </Button>
      </CabecalhoPagina>

      <section aria-labelledby="passos-titulo" className="section-y">
        <div className="container-site">
          <Reveal className="max-w-[60ch]">
            <p className="text-eyebrow text-brand">Passo a passo</p>
            <h2 id="passos-titulo" className="mt-2 text-h2 text-balance text-ink">
              Quatro passos, sem cadastro
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

      <section aria-labelledby="blocos-titulo" className="section-y bg-tint">
        <div className="container-site">
          <Reveal className="max-w-[60ch]">
            <p className="text-eyebrow text-brand">O essencial</p>
            <h2 id="blocos-titulo" className="mt-2 text-h2 text-balance text-ink">
              Pagamento, entrega e garantia
            </h2>
          </Reveal>
          <ul className="mt-8 grid gap-4 lg:mt-12 lg:grid-cols-3 lg:gap-6">
            {blocos.map((b, i) => (
              <Reveal as="li" key={b.titulo} atraso={i * 90} className="flex flex-col rounded-card bg-white p-6 ring-1 ring-line lg:p-8">
                <h3 className="text-h3 text-ink lg:text-[22px] lg:leading-7">{b.titulo}</h3>
                <ul className="mt-4 divide-y divide-line border-t border-line">
                  {b.itens.map((t) => (
                    <li key={t} className="flex items-start gap-3 py-3 text-body text-ink">
                      <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand" />
                      {t}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </ul>
          <Reveal className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-small text-muted" atraso={150}>
            <span>Compra para empresa?</span>
            <Link href="/empresas" className="group inline-flex min-h-11 items-center gap-1.5 font-bold text-brand hover:underline">
              Veja o atendimento para empresas
              <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>
      </section>

      <section id="perguntas-compra" aria-labelledby="faq-compra-titulo" className="section-y">
        <div className="container-site">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-eyebrow text-brand">Perguntas frequentes</p>
            <h2 id="faq-compra-titulo" className="mt-2 text-h2 text-balance text-ink">
              Dúvidas de quem vai comprar
            </h2>
          </Reveal>
          <Reveal className="mx-auto mt-6 max-w-3xl lg:mt-10" atraso={100}>
            <Faq perguntas={perguntasCompra} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
