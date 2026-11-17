"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const semMovimento = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Ícone do carrinho que está na tela agora (o do topo do desktop ou o do menu do celular). */
function alvoDoCarrinho(): HTMLElement | null {
  for (const el of document.querySelectorAll<HTMLElement>("[data-alvo-carrinho]")) {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0 && r.bottom > 0) return el;
  }
  return null;
}

/** Posição (centro) de um elemento, para usar como ponto de partida do voo. */
export function centroDe(el: Element) {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

/**
 * Uma bolinha sai do botão "Adicionar" e voa até o ícone do carrinho no topo.
 * Só enfeita: sem movimento reduzido e sem o ícone na tela, não faz nada.
 */
export function voarParaCarrinho(origem: { x: number; y: number }) {
  if (semMovimento()) return;
  const alvo = alvoDoCarrinho();
  if (!alvo) return;
  const destino = centroDe(alvo);

  const bolinha = document.createElement("span");
  bolinha.className = "bolinha-voo";
  document.body.appendChild(bolinha);

  const dx = destino.x - origem.x;
  const dy = destino.y - origem.y;
  // O arco: no meio do caminho a bolinha sobe um pouco acima da reta.
  const arco = Math.min(120, Math.abs(dx) * 0.25 + 40);

  const voo = bolinha.animate(
    [
      { transform: `translate(${origem.x}px, ${origem.y}px) scale(1)`, opacity: 1 },
      { transform: `translate(${origem.x + dx * 0.5}px, ${origem.y + dy * 0.5 - arco}px) scale(1.15)`, opacity: 1, offset: 0.5 },
      { transform: `translate(${destino.x}px, ${destino.y}px) scale(0.35)`, opacity: 0.4 },
    ],
    { duration: 640, easing: "cubic-bezier(0.45, 0.05, 0.35, 1)" },
  );
  voo.onfinish = () => bolinha.remove();
  voo.oncancel = () => bolinha.remove();
}

/**
 * Lista com saída animada: o item some com fade e recuo, e os vizinhos deslizam para ocupar
 * o espaço (técnica FLIP: mede antes, tira o item, mede depois e anima a diferença).
 * Cada filho direto da lista precisa de `data-id`.
 *
 * Use `ref` na lista, `saindo` para marcar o item (`data-saindo`) e `remover(id, acao)`
 * no lugar de chamar a ação direto: ele anima, espera e só então executa `acao`.
 */
export function useListaAnimada<T extends HTMLElement>(tamanho: number) {
  const ref = useRef<T>(null);
  const [saindo, setSaindo] = useState<ReadonlySet<string>>(new Set());
  const antes = useRef<Map<string, DOMRect> | null>(null);

  const remover = useCallback((id: string, acao: () => void) => {
    const lista = ref.current;
    if (!lista || semMovimento()) {
      acao();
      return;
    }
    setSaindo((s) => new Set(s).add(id));
    window.setTimeout(() => {
      const posicoes = new Map<string, DOMRect>();
      for (const filho of Array.from(lista.children) as HTMLElement[]) {
        if (filho.dataset.id && filho.dataset.id !== id) posicoes.set(filho.dataset.id, filho.getBoundingClientRect());
      }
      antes.current = posicoes;
      acao();
      setSaindo((s) => {
        const novo = new Set(s);
        novo.delete(id);
        return novo;
      });
    }, 260);
  }, []);

  /** Tira a lista inteira: todos os itens fazem a saída ao mesmo tempo e só então `acao` roda. */
  const removerTodos = useCallback((acao: () => void) => {
    const lista = ref.current;
    if (!lista || semMovimento()) {
      acao();
      return;
    }
    const ids = (Array.from(lista.children) as HTMLElement[]).map((f) => f.dataset.id).filter((x): x is string => Boolean(x));
    setSaindo(new Set(ids));
    window.setTimeout(() => {
      acao();
      setSaindo(new Set());
    }, 260);
  }, []);

  // Depois que o item sai do DOM, cada vizinho anima da posição antiga para a nova.
  useLayoutEffect(() => {
    const lista = ref.current;
    const posicoes = antes.current;
    if (!lista || !posicoes) return;
    antes.current = null;
    for (const filho of Array.from(lista.children) as HTMLElement[]) {
      const antigo = posicoes.get(filho.dataset.id ?? "");
      if (!antigo) continue;
      const novo = filho.getBoundingClientRect();
      const dx = antigo.left - novo.left;
      const dy = antigo.top - novo.top;
      if (!dx && !dy) continue;
      filho.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], {
        duration: 380,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      });
    }
  }, [tamanho]);

  return { ref, saindo, remover, removerTodos };
}

/** Verdadeiro por um instante cada vez que `valor` muda (menos na primeira leitura). */
export function useAvisoDeMudanca(valor: number, aumentou = true) {
  const anterior = useRef<number | null>(null);
  const [aviso, setAviso] = useState(false);

  useEffect(() => {
    const antes = anterior.current;
    anterior.current = valor;
    if (antes === null || (aumentou && valor <= antes)) return;
    setAviso(true);
    const t = window.setTimeout(() => setAviso(false), 560);
    return () => window.clearTimeout(t);
  }, [valor, aumentou]);

  return aviso;
}
