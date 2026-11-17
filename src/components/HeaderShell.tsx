"use client";

import { useEffect, useState, type ReactNode } from "react";

/** Topo fixo: ao rolar a página, ganha borda inferior. */
export function HeaderShell({ children }: { children: ReactNode }) {
  const [rolou, setRolou] = useState(false);

  useEffect(() => {
    const atualizar = () => setRolou(window.scrollY > 8);
    atualizar();
    window.addEventListener("scroll", atualizar, { passive: true });
    return () => window.removeEventListener("scroll", atualizar);
  }, []);

  return (
    <header
      data-rolou={rolou}
      className="sticky top-0 z-40 border-b border-transparent bg-white transition-colors duration-200 data-[rolou=true]:border-line"
    >
      {children}
    </header>
  );
}
