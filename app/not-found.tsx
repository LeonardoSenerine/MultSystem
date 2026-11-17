import type { Metadata } from "next";
import Link from "next/link";
import { BuscaComSugestoes } from "@/components/BuscaComSugestoes";
import { Button } from "@/components/Button";
import { WhatsAppIcon } from "@/components/icones-marca";
import { departamentos } from "@/data/departamentos";
import { getContato } from "@/lib/dados";
import { mensagens, whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false, follow: true },
};

/** 404: nunca deixa a pessoa num beco sem saída. Tem busca, os departamentos e o WhatsApp. */
export default function NaoEncontrada() {
  const contato = getContato();

  return (
    <section aria-labelledby="erro-titulo" className="bg-tint">
      <div className="container-site grid grid-cols-1 gap-10 py-14 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-center lg:gap-16 lg:py-24">
        <div>
          <p className="text-eyebrow text-brand">Erro 404</p>
          <h1 id="erro-titulo" className="mt-2 max-w-[16ch] text-display text-balance text-ink">
            Essa página não existe, ou mudou de lugar.
          </h1>
          <p className="mt-4 max-w-[48ch] text-body-lg text-muted">
            O endereço pode estar errado, ou o produto saiu do catálogo. Procure abaixo ou fale com a gente que ajudamos a encontrar.
          </p>

          <div className="relative z-10 mt-8 max-w-[520px]">
            <BuscaComSugestoes id="busca-404" fundoBranco />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button href="/" variante="primario" tamanho="lg" className="w-full sm:w-auto">
              Ir para o início
            </Button>
            <Button
              href={whatsappLink(contato.whatsapp, mensagens.geral)}
              variante="whatsapp"
              tamanho="lg"
              className="w-full sm:w-auto"
              icone={<WhatsAppIcon className="size-5" />}
            >
              Chamar no WhatsApp
            </Button>
          </div>
        </div>

        <nav aria-label="Departamentos" className="rounded-card bg-white p-5 ring-1 ring-line lg:p-7">
          <p className="text-[17px] font-extrabold text-ink">Ou escolha um departamento</p>
          <ul className="mt-3 divide-y divide-line">
            {departamentos.slice(0, 7).map((d) => (
              <li key={d.slug}>
                <Link
                  href={`/categoria/${d.slug}`}
                  className="group flex min-h-12 items-center justify-between gap-3 text-body text-ink transition-colors hover:text-brand"
                >
                  <span>
                    {d.nome}
                    <span className="block text-[13px] leading-[18px] text-muted">{d.descricao}</span>
                  </span>
                  <span aria-hidden className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/produtos" className="mt-3 inline-flex min-h-11 items-center text-[15px] font-bold text-brand hover:underline">
            Ver todos os produtos
          </Link>
        </nav>
      </div>
    </section>
  );
}
