import { Faq } from "@/components/Faq";
import { Reveal } from "@/components/Reveal";
import { getPerguntas } from "@/lib/dados";

/**
 * Pedido do cliente: 5 perguntas, centralizadas e animadas, no fim da página.
 * O "e se a dúvida for outra?" fica na seção de encerramento, logo abaixo.
 */
export function PerguntasFrequentes() {
  const perguntas = getPerguntas();

  return (
    <section id="perguntas" aria-labelledby="faq-titulo" className="section-y bg-tint">
      <div className="container-site">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-eyebrow text-brand">Perguntas frequentes</p>
          <h2 id="faq-titulo" className="mt-2 text-h2 text-ink text-balance">
            O que mais perguntam no balcão
          </h2>
        </Reveal>

        <Reveal className="mx-auto mt-6 max-w-3xl lg:mt-10" atraso={100}>
          <Faq perguntas={perguntas} />
        </Reveal>
      </div>
    </section>
  );
}
