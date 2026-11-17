import Link from "next/link";
import { WhatsAppIcon } from "@/components/icones-marca";
import { getContato } from "@/lib/dados";
import { whatsappLink } from "@/lib/whatsapp";

function mensagemWhatsApp(termo: string) {
  return termo
    ? `Olá! Procurei "${termo}" no site da Multsystems e não encontrei. Vocês conseguem esse produto para mim?`
    : "Olá! Não encontrei no site o produto que preciso. Podem me ajudar a achar?";
}

/** Link para o orçamento por encomenda, já com o produto procurado escrito no pedido. */
export function urlEncomenda(termo: string) {
  return termo ? `/orcamento?encomenda=${encodeURIComponent(termo)}#orcamento` : "/orcamento#orcamento";
}

const botaoWhats =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-btn bg-whatsapp px-5 text-[15px] font-bold whitespace-nowrap text-ink transition-colors hover:bg-[#1fbe5a]";
const botaoEncomenda =
  "inline-flex min-h-12 items-center justify-center rounded-btn bg-brand px-5 text-[15px] font-bold whitespace-nowrap text-white transition-colors hover:bg-[#263b73]";

/**
 * O catálogo nunca termina em "nada encontrado": quando a busca não acha, oferece falar com um
 * atendente ou pedir o produto por encomenda. `vazio` é a versão grande (sem resultado);
 * `rodape` é a faixa discreta que fica no fim da lista quando há resultado.
 */
export function NaoAchou({
  termo,
  variante,
  limpar,
}: {
  termo: string;
  variante: "vazio" | "rodape";
  /** URL sem filtros, para o "Limpar filtros" da versão vazia. */
  limpar?: string;
}) {
  const contato = getContato();
  const whatsapp = whatsappLink(contato.whatsapp, mensagemWhatsApp(termo));

  if (variante === "rodape") {
    return (
      <aside
        aria-label="Não achou o que procurava?"
        className="mt-10 flex flex-col gap-4 rounded-card bg-white p-5 ring-1 ring-line sm:flex-row sm:items-center sm:justify-between lg:mt-12 lg:p-6"
      >
        <div>
          <p className="text-h3 text-ink">Não achou o que procurava?</p>
          <p className="mt-1 max-w-[52ch] text-small text-muted">
            Nem tudo da loja está no site. Fale com um atendente e a gente encontra o melhor produto para você, ou faz a
            encomenda.
          </p>
        </div>
        <div className="grid shrink-0 gap-2 sm:flex">
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={botaoWhats}>
            <WhatsAppIcon className="size-[18px]" />
            Falar com um atendente
          </a>
          <Link href={urlEncomenda(termo)} className={botaoEncomenda}>
            Pedir por encomenda
          </Link>
        </div>
      </aside>
    );
  }

  return (
    <section aria-labelledby="nao-achou-titulo" className="mt-5 overflow-hidden rounded-card bg-white ring-1 ring-line">
      <div className="p-6 lg:p-10">
        <p className="text-eyebrow text-brand">A gente procura para você</p>
        <h2 id="nao-achou-titulo" className="mt-2 max-w-[28ch] text-[22px] leading-7 font-extrabold tracking-tight text-balance [overflow-wrap:anywhere] text-ink lg:text-[28px] lg:leading-9">
          {termo ? <>Não encontramos &ldquo;{termo}&rdquo; no site, mas dá para conseguir.</> : "Nenhum produto com esses filtros, mas dá para conseguir."}
        </h2>
        <p className="mt-3 max-w-[56ch] text-body text-muted">
          Nem tudo o que a loja vende está online. Tire suas dúvidas com um atendente: ele confere o estoque, sugere o
          produto certo para o seu caso ou faz a encomenda com o fornecedor.
        </p>

        <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap">
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={botaoWhats}>
            <WhatsAppIcon className="size-5" />
            Falar com um atendente
          </a>
          <Link href={urlEncomenda(termo)} className={botaoEncomenda}>
            Pedir orçamento por encomenda
          </Link>
          {limpar && (
            <Link
              href={limpar}
              scroll={false}
              className="inline-flex min-h-12 items-center justify-center rounded-btn border border-line px-5 text-[15px] font-bold text-ink transition-colors hover:border-brand hover:text-brand"
            >
              Limpar filtros
            </Link>
          )}
        </div>

        <ol className="mt-8 grid gap-4 border-t border-line pt-6 text-small text-muted sm:grid-cols-3">
          <li>
            <strong className="block text-[15px] text-ink">1. Conte o que precisa</strong>
            Nome, modelo ou só para que vai usar.
          </li>
          <li>
            <strong className="block text-[15px] text-ink">2. A gente procura</strong>
            No estoque da loja e nos fornecedores.
          </li>
          <li>
            <strong className="block text-[15px] text-ink">3. Você recebe o orçamento</strong>
            Com preço, prazo e nota fiscal.
          </li>
        </ol>
      </div>
    </section>
  );
}
