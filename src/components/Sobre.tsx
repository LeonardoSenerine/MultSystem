import { Reveal } from "@/components/Reveal";

type Prova = { titulo: string; texto: string };

// Para cada número aparecer uma vez só (regra 6.2): "31 anos" vive no título daqui,
// "desde 1995" no selo do hero e o "5.0" nesta lista.
export const provas: Prova[] = [
  { titulo: "Atendimento para empresas", texto: "Cotação com nota no CNPJ, faturamento e entrega em Itatiba e região." },
  { titulo: "Loja física no Centro", texto: "Atendimento no balcão, retirada na loja e suporte presencial." },
  // TODO: dado real. Confirmar a nota no Mercado Livre antes de publicar.
  { titulo: "5.0 no Mercado Livre", texto: "Nota dada pelos próprios clientes na nossa loja oficial." },
  { titulo: "Pós-venda de verdade", texto: "Precisou de ajuda depois da compra? Volte ao balcão ou chame no WhatsApp." },
];

/** Sobre a empresa + provas. As marcas e as avaliações entram logo abaixo, na mesma faixa tint. */
export function Sobre() {
  return (
    <div className="container-site">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <Reveal>
          <p className="text-eyebrow text-brand">Sobre a Multsystems</p>
          <h2 id="sobre-titulo" className="mt-2 text-h2 text-ink text-balance">
            31 anos vendendo informática em Itatiba
          </h2>
        </Reveal>

        {/* TODO: dado real. Texto escrito só com o que já sabemos da empresa; pedir à Multsystems
            a história (quem fundou, como começou) para completar este bloco. */}
        <Reveal className="space-y-4 text-body-lg text-ink lg:pt-9" atraso={100}>
          <p>
            A Multsystems é uma loja de informática no Centro de Itatiba. Hoje a maior parte do nosso trabalho é com
            empresas: equipar escritórios, montar redes, instalar câmeras e manter tudo funcionando, com nota fiscal e um
            vendedor que acompanha o pedido do começo ao fim.
          </p>
          <p className="text-muted">
            A porta continua aberta para quem compra para casa. Você vê o produto no balcão, tira a dúvida com quem vende e,
            se algo der problema, a Total Tech conserta aqui mesmo.
          </p>
        </Reveal>
      </div>

      <ul className="mt-12 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
        {provas.map((p, i) => (
          <Reveal as="li" key={p.titulo} className="border-t-2 border-brand pt-5" atraso={i * 90}>
            <h3 className="text-h3 text-ink">{p.titulo}</h3>
            <p className="mt-2 text-body text-muted">{p.texto}</p>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
