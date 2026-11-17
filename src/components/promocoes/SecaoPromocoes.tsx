import { FormularioPromocoes } from "@/components/promocoes/FormularioPromocoes";
import { Reveal } from "@/components/Reveal";
import { departamentos } from "@/data/departamentos";

/**
 * Convite para receber promoções e avisos (WhatsApp ou e-mail).
 * `tom="escuro"`: painel azul da marca, para a home. `tom="claro"`: painel claro, para o catálogo.
 * Nos dois, o texto fica à esquerda e o formulário (cartão branco) à direita.
 */
export function SecaoPromocoes({
  origem,
  tom = "escuro",
  aninhada = false,
}: {
  origem: string;
  tom?: "escuro" | "claro";
  /** true quando já está dentro de um container da página (catálogo): sem margem de seção e sem container próprio. */
  aninhada?: boolean;
}) {
  const escuro = tom === "escuro";
  const interesses = departamentos.slice(0, 7).map((d) => ({ slug: d.slug, nome: d.nome }));

  return (
    <section aria-labelledby={`promocoes-titulo-${origem}`} className={aninhada ? "mt-12 lg:mt-16" : "section-y"}>
      <div className={aninhada ? "" : "container-site"}>
        <Reveal
          className={`grid grid-cols-1 gap-8 rounded-photo p-6 sm:p-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-center lg:gap-14 lg:p-14 ${
            escuro ? "on-dark bg-brand text-white" : "border border-line bg-tint text-ink"
          }`}
        >
          <div>
            <p className={`text-eyebrow ${escuro ? "text-white/70" : "text-brand"}`}>Promoções e avisos</p>
            <h2 id={`promocoes-titulo-${origem}`} className="mt-2 text-h2 text-balance">
              Receba as ofertas antes de acabarem
            </h2>
            <p className={`mt-4 max-w-[44ch] text-body-lg ${escuro ? "text-white/85" : "text-muted"}`}>
              Deixe o seu WhatsApp ou e-mail e a gente avisa quando entrar promoção ou chegar o que você procura. Só o que interessa, e você
              sai da lista quando quiser.
            </p>
          </div>

          <div className="rounded-card bg-white p-5 text-ink ring-1 ring-line lg:p-7">
            <FormularioPromocoes origem={origem} interesses={interesses} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
