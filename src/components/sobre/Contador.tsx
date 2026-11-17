"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Número que sobe de 0 até `valor` quando aparece na tela (uma vez só). O servidor e quem
 * prefere menos movimento veem o número final desde o início.
 */
export function Contador({ valor, duracao = 1400 }: { valor: number; duracao?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(valor);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let quadro = 0;
    const observer = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) {
          // Ainda fora da tela: deixa em zero, pronto para subir quando chegar.
          setN(0);
          return;
        }
        observer.disconnect();
        const inicio = performance.now();
        const passo = (agora: number) => {
          const t = Math.min(1, (agora - inicio) / duracao);
          // Começa rápido e desacelera no fim.
          setN(Math.round(valor * (1 - Math.pow(1 - t, 3))));
          if (t < 1) quadro = requestAnimationFrame(passo);
        };
        quadro = requestAnimationFrame(passo);
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(quadro);
    };
  }, [valor, duracao]);

  return (
    <span ref={ref} className="tabular-nums">
      <span className="sr-only">{valor}</span>
      <span aria-hidden>{n}</span>
    </span>
  );
}
