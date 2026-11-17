import Image from "next/image";
import type { ReactNode } from "react";
import { ElipseMarca } from "@/components/Hero";
import { Migalhas } from "@/components/Migalhas";

/**
 * Topo das páginas internas: foto de fundo sob uma camada navy (para o texto ler bem), trilha,
 * título, uma explicação curta do que a página é, três pontos-chave e, se quiser, botões.
 * A foto assenta devagar e o texto entra em fila, como no hero da home.
 * `imagem.posicao` escolhe que parte da foto fica visível (CSS object-position).
 */
export function CabecalhoPagina({
  titulo,
  texto,
  eyebrow,
  imagem,
  pontos,
  children,
}: {
  titulo: string;
  texto?: string;
  eyebrow?: string;
  /**
   * `lado: true` guarda a foto na metade direita do topo no desktop, sem véu por cima, para fotos
   * em que o assunto (uma placa, uma fachada) não pode ficar escondido atrás do texto.
   */
  imagem: { src: string; posicao?: string; lado?: boolean };
  pontos?: readonly string[];
  children?: ReactNode;
}) {
  const lado = imagem.lado === true;

  return (
    <header className="on-dark relative isolate overflow-hidden bg-navy text-white">
      {lado && <ElipseMarca />}
      <div aria-hidden className={`hero-foto absolute inset-0 -z-10 ${lado ? "foto-lado lg:left-auto lg:w-[68%]" : ""}`}>
        <Image
          src={imagem.src}
          alt=""
          fill
          priority
          quality={85}
          sizes={lado ? "(min-width: 1024px) 68vw, 100vw" : "100vw"}
          className={`object-cover ${lado ? "foto-respira" : ""}`}
          style={{ objectPosition: imagem.posicao ?? "center" }}
        />
        {lado ? (
          <>
            {/* Celular: véu médio. Desktop: a foto nasce do navy por uma máscara longa e suave (sem borda visível). */}
            <div className="absolute inset-0 bg-navy/60 lg:hidden" />
            <div className="absolute inset-0 hidden bg-navy/10 lg:block" />
          </>
        ) : (
          <>
            {/* Celular: véu único. Desktop: o navy cobre a esquerda (texto) e abre para a foto à direita. */}
            <div className="absolute inset-0 bg-navy/80 lg:hidden" />
            <div className="absolute inset-0 hidden bg-linear-to-r from-navy from-30% via-navy/85 to-navy/25 lg:block" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-navy/60 to-transparent" />
          </>
        )}
      </div>

      <div className="container-site pt-4 pb-10 lg:pt-6 lg:pb-16">
        <Migalhas itens={[{ nome: "Início", href: "/" }, { nome: titulo }]} escuro />

        <div className="hero-texto mt-6 max-w-[640px] lg:mt-12">
          {eyebrow && (
            <p className="inline-flex rounded-btn border border-white/25 px-3 py-1.5 text-small text-white">{eyebrow}</p>
          )}
          <h1 className={`${eyebrow ? "mt-4 lg:mt-5" : ""} text-display text-balance`}>{titulo}</h1>
          {texto && <p className="mt-4 max-w-[52ch] text-body-lg text-white/85">{texto}</p>}

          {pontos && pontos.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/20 pt-5 text-small text-white/90 lg:mt-8">
              {pontos.map((p) => (
                <li key={p} className="flex items-center gap-2">
                  <span aria-hidden className="size-1.5 rounded-full bg-brand-light" />
                  {p}
                </li>
              ))}
            </ul>
          )}

          {children && <div className="mt-7 flex flex-col gap-3 sm:flex-row">{children}</div>}
        </div>
      </div>
    </header>
  );
}
