"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

const chaveDe = (caminho: string, busca: URLSearchParams) => `${caminho}?${busca.toString()}`;

/** Distância do topo da janela até a grade quando se troca de página (deixa o cabeçalho fixo de fora). */
const FOLGA_TOPO = 128;

/**
 * Trocar de departamento é trocar de página (/produtos -> /categoria/...): a grade antiga some e uma nova aparece.
 * Quem clica avisa por aqui, e a grade nova leva a janela até o começo dela (vale por poucos segundos).
 */
const AVISO_OUTRA_LISTA = "catalogo:levar-a-grade";
const avisar = () => {
  try {
    window.sessionStorage.setItem(AVISO_OUTRA_LISTA, String(Date.now()));
  } catch {
    /* sem armazenamento: a janela só não é levada até a grade */
  }
};
const receberAviso = () => {
  try {
    const quando = Number(window.sessionStorage.getItem(AVISO_OUTRA_LISTA));
    window.sessionStorage.removeItem(AVISO_OUTRA_LISTA);
    return quando > 0 && Date.now() - quando < 10_000;
  } catch {
    return false;
  }
};

/**
 * Envolve a grade de produtos. Cada filtro é um link comum (a página é renderizada no servidor),
 * então a troca leva um instante. Enquanto isso a grade esmaece um pouco e uma barra corre no topo.
 *
 * Para a troca não parecer uma "recarga":
 * - a grade NÃO é remontada: os cards que continuam no resultado ficam parados, só os novos aparecem;
 * - a rolagem acompanha a grade: se algo acima dela some ou muda de tamanho (o banner de apresentação sai
 *   quando se aplica um filtro), a página é ajustada na mesma medida, e o que a pessoa estava vendo não se mexe;
 * - ao trocar de página da lista (paginação), a janela vai para o começo da grade, e não para o topo do site.
 * Nada disso muda o que o link faz sem JavaScript.
 */
export function AreaResultados({ children }: { children: ReactNode }) {
  const caminho = usePathname();
  const busca = useSearchParams();
  const chave = chaveDe(caminho, busca);
  const pagina = busca.get("pagina") ?? "1";
  // Guarda a URL em que o clique aconteceu: "pendente" é só "ainda estou nela". Quando a URL muda, deixa de ser.
  const [pendenteEm, setPendenteEm] = useState<string | null>(null);
  const limite = useRef<number | undefined>(undefined);
  const area = useRef<HTMLDivElement>(null);
  const topoVisto = useRef<number | null>(null);
  const paginaAnterior = useRef(pagina);
  const primeiraVez = useRef(true);

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
      if (destino.pathname !== window.location.pathname) avisar();
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

  // Memoriza onde a grade está na janela (atualizado ao rolar e ao redimensionar), para saber, quando o
  // resultado novo chegar, quanto ela se deslocou.
  useEffect(() => {
    let quadro = 0;
    const medir = () => {
      window.cancelAnimationFrame(quadro);
      quadro = window.requestAnimationFrame(() => {
        if (area.current) topoVisto.current = area.current.getBoundingClientRect().top;
      });
    };
    medir();
    window.addEventListener("scroll", medir, { passive: true });
    window.addEventListener("resize", medir);
    return () => {
      window.cancelAnimationFrame(quadro);
      window.removeEventListener("scroll", medir);
      window.removeEventListener("resize", medir);
    };
  }, []);

  // Resultado novo na tela: mantém a grade onde estava (ou leva ao começo dela, se mudou de página).
  // O navegador ainda mexe na rolagem por conta própria logo depois (ancoragem, imagens), então a posição é
  // conferida de novo por uns instantes, até a pessoa tocar na tela ou rolar.
  useLayoutEffect(() => {
    const el = area.current;
    if (!el) return;
    const mudouDePagina = paginaAnterior.current !== pagina;
    paginaAnterior.current = pagina;
    const veioDeOutraLista = primeiraVez.current && receberAviso();
    const desejado = mudouDePagina || veioDeOutraLista ? FOLGA_TOPO : primeiraVez.current ? null : topoVisto.current;

    if (desejado === null) {
      primeiraVez.current = false;
      topoVisto.current = el.getBoundingClientRect().top;
      return;
    }
    primeiraVez.current = false;

    const corrigir = () => {
      const desvio = el.getBoundingClientRect().top - desejado;
      if (Math.abs(desvio) > 2) window.scrollBy({ top: desvio, behavior: "auto" });
    };
    let parou = false;
    const parar = () => {
      parou = true;
    };
    const eventos = ["wheel", "touchstart", "keydown", "mousedown"] as const;
    eventos.forEach((e) => window.addEventListener(e, parar, { once: true, passive: true }));
    const refazer = () => {
      if (!parou) corrigir();
    };
    corrigir();
    const quadro = window.requestAnimationFrame(refazer);
    const t1 = window.setTimeout(refazer, 120);
    const t2 = window.setTimeout(() => {
      refazer();
      topoVisto.current = el.getBoundingClientRect().top;
    }, 400);
    return () => {
      window.cancelAnimationFrame(quadro);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      eventos.forEach((e) => window.removeEventListener(e, parar));
    };
  }, [chave, pagina]);
  const pendente = pendenteEm === chave;

  return (
    <div ref={area} className="relative" aria-busy={pendente}>
      <div aria-hidden data-ativa={pendente} className="barra-carregando" />
      <div data-pendente={pendente} className="resultado-entra">
        {children}
      </div>
    </div>
  );
}
