import { Star } from "lucide-react";
import { CarrosselAvaliacoes } from "@/components/CarrosselAvaliacoes";
import { Reveal } from "@/components/Reveal";
import { getAvaliacoes, getContato } from "@/lib/dados";

function Estrelas() {
  return (
    <span className="flex gap-0.5" role="img" aria-label="5 de 5 estrelas">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} aria-hidden className="size-4 fill-amber text-amber" />
      ))}
    </span>
  );
}

export function Avaliacoes() {
  const contato = getContato();
  // Só aparecem avaliações REAIS. Os textos de exemplo de src/data/avaliacoes.ts (exemplo: true) ficam fora do site
  // até a loja mandar depoimentos de verdade; enquanto isso, o bloco leva às avaliações do Mercado Livre.
  const avaliacoes = getAvaliacoes().filter((a) => !a.exemplo);

  if (avaliacoes.length === 0) {
    return (
      <Reveal className="mt-20 lg:mt-32">
        <div className="flex flex-col gap-5 rounded-card border border-line bg-white p-6 sm:flex-row sm:items-center sm:justify-between lg:p-8">
          <div>
            <Estrelas />
            <h3 id="avaliacoes-titulo" className="mt-3 text-h3 text-ink lg:text-[24px] lg:leading-8">
              Veja o que os clientes dizem
            </h3>
            {/* TODO: dado real. A nota 5.0 vem do site antigo; confirmar no Mercado Livre. */}
            <p className="mt-1 max-w-[52ch] text-body text-muted">
              As avaliações são dos próprios clientes, no Google e na nossa loja oficial no Mercado Livre (nota {contato.mercadoLivreNota}).
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:items-stretch">
            <a
              href={contato.googleAvaliacoesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-btn bg-brand px-6 text-[15px] font-bold text-white transition-[background-color,transform] hover:bg-[#263b73] active:scale-[0.98]"
            >
              Ver avaliações no Google
            </a>
            <a
              href={contato.mercadoLivreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-btn border border-line px-6 text-[15px] font-bold text-ink transition-[border-color,color,transform] hover:border-brand hover:text-brand active:scale-[0.98]"
            >
              Ver no Mercado Livre
            </a>
          </div>
        </div>
      </Reveal>
    );
  }

  return (
    <Reveal className="mt-20 lg:mt-32">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div>
          <Estrelas />
          <h3 id="avaliacoes-titulo" className="mt-3 text-h2 text-ink">
            Avaliações no Google
          </h3>
          <p className="mt-2 max-w-[56ch] text-body text-muted">
            {avaliacoes.length} avaliações de clientes no Google, todas com 5 estrelas. Veja também a nossa loja oficial no Mercado Livre
            (nota {contato.mercadoLivreNota}).
          </p>
        </div>
        <div className="flex flex-wrap gap-x-5">
          <a
            href={contato.googleAvaliacoesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center text-[15px] leading-5 font-bold text-brand hover:underline"
          >
            Ver no Google
          </a>
          <a
            href={contato.mercadoLivreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center text-[15px] leading-5 font-bold text-brand hover:underline"
          >
            Ver no Mercado Livre
          </a>
        </div>
      </div>

      <div className="mt-5 lg:mt-8">
        <CarrosselAvaliacoes avaliacoes={avaliacoes} />
      </div>

    </Reveal>
  );
}