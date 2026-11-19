"use client";

import { Menu, X } from "lucide-react";
import { IconesConta } from "@/components/carrinho/IconesConta";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/Button";
import { WhatsAppIcon } from "@/components/icones-marca";
import { Logo } from "@/components/Logo";
import { HorarioTexto } from "@/components/loja/HorarioTexto";
import type { LinkNav } from "@/types";

type MobileNavProps = {
  links: LinkNav[];
  whatsappHref: string;
  telefone: string;
  telefoneLink: string;
};

const iconeBotao =
  "inline-flex size-11 items-center justify-center rounded-btn text-ink transition-colors hover:bg-tint";

/** Ícones do topo no celular + menu em tela cheia. */
export function MobileNav({ links, whatsappHref, telefone, telefoneLink }: MobileNavProps) {
  const [aberto, setAberto] = useState(false);
  const fecharRef = useRef<HTMLButtonElement>(null);
  const abrirRef = useRef<HTMLButtonElement>(null);

  const fechar = useCallback(() => {
    setAberto(false);
    abrirRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!aberto) return;
    const html = document.documentElement;
    const overflowAnterior = html.style.overflow;
    html.style.overflow = "hidden";
    // Espera o menu ficar visível antes de focar.
    const t = window.setTimeout(() => fecharRef.current?.focus(), 50);

    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") fechar();
    };
    window.addEventListener("keydown", aoTeclar);
    return () => {
      html.style.overflow = overflowAnterior;
      window.clearTimeout(t);
      window.removeEventListener("keydown", aoTeclar);
    };
  }, [aberto, fechar]);

  // Se a tela crescer para desktop com o menu aberto, fecha.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 64rem)");
    const aoMudar = () => mq.matches && setAberto(false);
    mq.addEventListener("change", aoMudar);
    return () => mq.removeEventListener("change", aoMudar);
  }, []);

  return (
    <div className="flex items-center gap-1 lg:hidden">
      <IconesConta />
      <button
        ref={abrirRef}
        type="button"
        className={iconeBotao}
        aria-label="Abrir menu"
        aria-haspopup="dialog"
        aria-expanded={aberto}
        aria-controls="menu-celular"
        onClick={() => setAberto(true)}
      >
        <Menu aria-hidden className="size-6" />
      </button>

      <div
        id="menu-celular"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        data-open={aberto}
        inert={!aberto}
        className="mobile-menu fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white"
      >
        <div className="container-site flex h-16 shrink-0 items-center justify-between border-b border-line">
          <Link href="/" onClick={fechar} aria-label="Multsystems, voltar ao início">
            <Logo className="h-11 w-auto" />
          </Link>
          <button ref={fecharRef} type="button" className={iconeBotao} aria-label="Fechar menu" onClick={fechar}>
            <X aria-hidden className="size-6" />
          </button>
        </div>

        <div className="container-site flex flex-1 flex-col gap-8 py-6">
          <nav aria-label="Principal">
            <ul className="flex flex-col">
              {links.map((link, i) => (
                <li key={link.href} className="menu-item border-b border-line" style={{ ["--i" as string]: i }}>
                  <Link
                    href={link.href}
                    onClick={fechar}
                    className="flex min-h-14 items-center text-[22px] leading-7 font-bold tracking-tight text-ink hover:text-brand"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="menu-item mt-auto flex flex-col gap-3" style={{ ["--i" as string]: links.length }}>
            <Button href="/orcamento" onClick={fechar} variante="primario" tamanho="lg" larguraTotal>
              Pedir orçamento
            </Button>
            <Button
              href={whatsappHref}
              variante="whatsapp"
              tamanho="lg"
              larguraTotal
              icone={<WhatsAppIcon className="size-5" />}
            >
              Chamar no WhatsApp
            </Button>
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 pt-2 text-small text-muted">
              <a href={telefoneLink} className="flex min-h-11 items-center font-bold text-ink">
                {telefone}
              </a>
              <span>
                <HorarioTexto />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
