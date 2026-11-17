"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Elemento HTML a renderizar (div por padrão). */
  as?: ElementType;
  /** Atraso em ms, para escalonar blocos vizinhos. */
  atraso?: number;
  /** Atributos de acessibilidade (aria-*, id, role) repassados ao elemento. */
  [atributo: `aria-${string}`]: string | undefined;
  id?: string;
  role?: string;
};

/**
 * Aparece com fade e subida de 16 px quando entra na tela, uma vez só.
 * Só esconde (data-reveal="pending") o que ainda está fora da tela depois da hidratação:
 * sem JavaScript nada some, o que já está visível não pisca e o hero nunca espera.
 * A checagem inicial usa o próprio IntersectionObserver (e não getBoundingClientRect),
 * para não forçar um layout por bloco durante a hidratação.
 * Com prefers-reduced-motion não faz nada.
 */
export function Reveal({ children, className = "", as: Tag = "div", atraso = 0, ...resto }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          // Já na tela (ou chegou nela): mostra e para de observar.
          if (el.dataset.reveal === "pending") el.dataset.reveal = "visible";
          observer.disconnect();
        } else if (!el.dataset.reveal) {
          // Primeira leitura e ainda fora da tela: esconde até entrar.
          el.dataset.reveal = "pending";
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${className}`} style={atraso ? { transitionDelay: `${atraso}ms` } : undefined} {...resto}>
      {children}
    </Tag>
  );
}
