"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

const chaveDe = (caminho: string, busca: URLSearchParams) => `${caminho}?${busca.toString()}`;

/**
 * Envolve a grade de produtos. Cada filtro é um link comum (a página é renderizada no
 * servidor), então a troca leva um instante: ao clicar num link do catálogo, a grade antiga
 * esmaece e uma barra corre no topo; quando o resultado novo chega, a grade é remontada e os
 * cards sobem em fila. Nada disso muda o que o link faz sem JavaScript.
 */
export function AreaResultados({ children }: { children: ReactNode }) {
  const caminho = usePathname();
  const busca = useSearchParams();
  const chave = chaveDe(caminho, busca);
  // Guarda a URL em que o clique aconteceu: "pendente" é só "ainda estou nela". Quando a URL muda, deixa de ser.
  const [pendenteEm, setPendenteEm] = useState<string | null>(null);
  const limite = useRef<number | undefined>(undefined);

  useEffect(() => {
    const aoClicar = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.target === "_blank" || !link.closest("[data-catalogo-raiz]")) return;
      const destino = new URL(link.href, window.location.href);
      if (destino.origin !== window.location.origin) return;
      // Só listas: abrir um produto é outra página, sem esmaecer a grade.
      if (!(destino.pathname === "/produtos" || destino.pathname.startsWith("/categoria/"))) return;
      const atual = chaveDe(window.location.pathname, new URLSearchParams(window.location.search));
      if (chaveDe(destino.pathname, destino.searchParams) === atual) return;
      setPendenteEm(atual);
      window.clearTimeout(limite.current);
      // Se algo travar, não deixa a grade apagada para sempre.
      limite.current = window.setTimeout(() => setPendenteEm(null), 10_000);
    };
    // Na fase de captura: o <Link> do Next cancela o clique padrão antes de ele chegar até aqui na subida.
    document.addEventListener("click", aoClicar, true);
    return () => {
      document.removeEventListener("click", aoClicar, true);
      window.clearTimeout(limite.current);
    };
  }, []);

  const pendente = pendenteEm === chave;

  return (
    <div className="relative" aria-busy={pendente}>
      <div aria-hidden data-ativa={pendente} className="barra-carregando" />
      <div key={chave} data-pendente={pendente} className="resultado-entra">
        {children}
      </div>
    </div>
  );
}
