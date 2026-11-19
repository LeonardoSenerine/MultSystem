"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/icones-marca";

/**
 * Botão redondo fixo. Na home aparece depois que o hero (#inicio) sai da tela; nas outras
 * páginas, depois de rolar um pouco.
 */
export function WhatsAppFab({ href }: { href: string }) {
  const [visivel, setVisivel] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const hero = document.getElementById("inicio");
    if (!hero) {
      const atualizar = () => setVisivel(window.scrollY > 240);
      atualizar();
      window.addEventListener("scroll", atualizar, { passive: true });
      return () => window.removeEventListener("scroll", atualizar);
    }
    // Desconta a altura do topo fixo: o hero "saiu" quando some por trás dele.
    const observer = new IntersectionObserver(([entrada]) => setVisivel(!entrada.isIntersecting), {
      rootMargin: "-140px 0px 0px 0px",
      threshold: 0,
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar no WhatsApp"
      data-visible={visivel}
      aria-hidden={!visivel}
      tabIndex={visivel ? 0 : -1}
      className="fab alinha-direita fixed right-4 bottom-4 z-30 flex size-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-card hover:bg-[#1fbe5a] lg:bottom-8 lg:size-12 min-[1400px]:size-16"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <WhatsAppIcon className="size-7 lg:size-6 min-[1400px]:size-8" />
    </a>
  );
}
