import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { urlDoSite } from "@/lib/site";

export type Migalha = { nome: string; href?: string };

/** Trilha "Início › Produtos › Redes e Wi-Fi". O último item é a página atual. `escuro` é para fundo navy. */
export function Migalhas({ itens, escuro = false }: { itens: Migalha[]; escuro?: boolean }) {
  // Trilha também em dados estruturados, para o Google mostrá-la no resultado da busca.
  const dados = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: itens.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.nome,
      ...(item.href ? { item: urlDoSite(item.href) } : {}),
    })),
  };

  return (
    <nav aria-label="Você está em">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(dados).replace(/</g, "\\u003c") }} />
      <ol className={`flex flex-wrap items-center gap-x-1 text-[13px] leading-5 ${escuro ? "text-white/75" : "text-muted"}`}>
        {itens.map((item, i) => (
          <li key={item.nome} className="flex items-center gap-1">
            {i > 0 && <ChevronRight aria-hidden className={`size-3.5 ${escuro ? "text-white/45" : "text-muted/70"}`} />}
            {item.href ? (
              <Link
                href={item.href}
                className={`inline-flex min-h-11 items-center hover:underline ${escuro ? "hover:text-white" : "hover:text-brand"}`}
              >
                {item.nome}
              </Link>
            ) : (
              <span aria-current="page" className={escuro ? "text-white" : "text-ink"}>
                {item.nome}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
