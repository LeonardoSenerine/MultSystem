import type { ReactNode } from "react";
import { Migalhas } from "@/components/Migalhas";

/** Moldura das páginas de texto (privacidade, cookies): topo claro com título e data, e coluna de leitura de 720 px. */
export function PaginaLegal({
  titulo,
  resumo,
  atualizadoEm,
  children,
}: {
  titulo: string;
  resumo: string;
  atualizadoEm: string;
  children: ReactNode;
}) {
  return (
    <>
      <header className="border-b border-line bg-tint">
        <div className="container-site pt-4 pb-10 lg:pt-6 lg:pb-14">
          <Migalhas itens={[{ nome: "Início", href: "/" }, { nome: titulo }]} />
          <h1 className="mt-6 max-w-[22ch] text-display text-balance text-ink lg:mt-8">{titulo}</h1>
          <p className="mt-4 max-w-[60ch] text-body-lg text-muted">{resumo}</p>
          <p className="mt-4 text-small text-muted">Atualizada em {atualizadoEm}</p>
        </div>
      </header>

      <div className="container-site section-y">
        <div className="mx-auto max-w-[720px] [&_a]:font-bold [&_a]:text-brand [&_a:hover]:underline [&_h2]:mt-10 [&_h2]:text-[22px] [&_h2]:leading-7 [&_h2]:font-extrabold [&_h2]:tracking-tight [&_h2]:text-ink [&_h2]:scroll-mt-28 [&_h2:first-child]:mt-0 [&_h3]:mt-6 [&_h3]:text-[17px] [&_h3]:leading-6 [&_h3]:font-bold [&_h3]:text-ink [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:text-body [&_ol]:text-ink/90 [&_li]:mt-2 [&_p]:mt-3 [&_p]:text-body [&_p]:text-ink/90 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-body [&_ul]:text-ink/90">
          {children}
        </div>
      </div>
    </>
  );
}
