"use client";

import Image from "next/image";
import { useState } from "react";

type FotoProdutoProps = {
  src: string;
  alt: string;
  temFoto: boolean;
  sizes: string;
  className?: string;
  preload?: boolean;
  /** Miniaturas (carrinho, listas): sem foto mostra só o ícone, sem o texto "Foto em breve", que não cabe. */
  compacto?: boolean;
};

/**
 * Foto do produto em fundo branco, inteira (object-contain), como em marketplace.
 * Sem foto (ou se a imagem falhar no navegador), mostra um espaço neutro com o aviso.
 */
export function FotoProduto({ src, alt, temFoto, sizes, className = "", preload = false, compacto = false }: FotoProdutoProps) {
  const [falhou, setFalhou] = useState(false);

  if (!temFoto || !src || falhou) {
    return (
      <div className="absolute inset-0 grid place-items-center bg-tint/50" role="img" aria-label="Foto em breve">
        <span className="flex flex-col items-center gap-2 text-center">
          <svg
            aria-hidden
            viewBox="0 0 48 48"
            className={`${compacto ? "size-8 text-[#c3cde3]" : "size-10 text-line"}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <rect x="6" y="10" width="36" height="28" rx="4" />
            <circle cx="17" cy="20" r="3.5" />
            <path d="m6 33 10-9 8 7 6-5 12 9" strokeLinejoin="round" />
          </svg>
          {!compacto && <span className="text-[12px] leading-4 font-semibold text-muted">Foto em breve</span>}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      preload={preload}
      onError={() => setFalhou(true)}
      className={`object-contain ${className}`}
    />
  );
}
