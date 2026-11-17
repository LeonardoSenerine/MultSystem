"use client";

import { useRef, useState, type ReactNode } from "react";

/**
 * Lupa da foto do produto: no desktop (mouse), ao passar o cursor a foto cresce e acompanha
 * o movimento. No celular (toque) não faz nada, a foto fica inteira.
 */
export function FotoZoom({ children, className = "" }: { children: ReactNode; className?: string }) {
  const caixa = useRef<HTMLDivElement>(null);
  const [ativo, setAtivo] = useState(false);
  const [origem, setOrigem] = useState("50% 50%");

  return (
    <div
      ref={caixa}
      className={`${className} lg:cursor-zoom-in`}
      onPointerEnter={(e) => e.pointerType === "mouse" && setAtivo(true)}
      onPointerLeave={() => setAtivo(false)}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !caixa.current) return;
        const r = caixa.current.getBoundingClientRect();
        setOrigem(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
      }}
    >
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{ transform: ativo ? "scale(1.9)" : "none", transformOrigin: origem }}
      >
        {children}
      </div>
    </div>
  );
}
