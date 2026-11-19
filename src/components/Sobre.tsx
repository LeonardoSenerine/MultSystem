import { Building2, Headset, Star, Store, type LucideIcon } from "lucide-react";
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

// Ícone de cada resumo, na mesma ordem de `provas`.
const icones: LucideIcon[] = [Building2, Store, Star, Headset];

/**
 * Sobre a empresa, em resumos: à esquerda o título e um parágrafo curto; à direita quatro cartões brancos
 * (ícone, título e uma linha). No celular os cartões viram linhas compactas, com o ícone ao lado do texto.
 * As marcas e as avaliações entram logo abaixo, na mesma faixa tint.
 */
export function Sobre() {
  return (
    <div className="container-site grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-16">
      {/* TODO: dado real. Texto escrito só com o que já sabemos da empresa; pedir à Multsystems
          a história (quem fundou, como começou) para completar este bloco. */}
      <Reveal>
        <p className="text-eyebrow text-brand">Sobre a Multsystems</p>
        <h2 id="sobre-titulo" className="mt-2 text-h2 text-ink text-balance">
          31 anos vendendo informática em Itatiba
        </h2>
        <p className="mt-4 max-w-[46ch] text-body-lg text-muted">
          Hoje a maior parte do trabalho é com empresas: equipar escritórios, montar redes e instalar câmeras. Mas a porta continua
          aberta para quem compra para casa, e a Total Tech conserta aqui mesmo.
        </p>
      </Reveal>

      <ul className="grid gap-3 sm:grid-cols-2 lg:gap-4">
        {provas.map((p, i) => {
          const Icone = icones[i];
          return (
            <Reveal
              as="li"
              key={p.titulo}
              atraso={i * 90}
              className="group flex gap-4 rounded-card bg-white p-4 ring-1 ring-line transition-[box-shadow,transform,--tw-ring-color] duration-300 hover:shadow-card hover:ring-brand/30 sm:flex-col sm:gap-3 sm:p-5 lg:p-6 lg:hover:-translate-y-0.5"
            >
              <span
                aria-hidden
                className="grid size-11 shrink-0 place-items-center rounded-full bg-tint text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white"
              >
                <Icone className="size-5" />
              </span>
              <div className="min-w-0">
                <h3 className="text-[17px] leading-6 font-bold text-ink">{p.titulo}</h3>
                <p className="mt-1 text-small text-muted">{p.texto}</p>
              </div>
            </Reveal>
          );
        })}
      </ul>
    </div>
  );
}
