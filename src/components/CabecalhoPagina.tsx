import Image from "next/image";
import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { ElipseMarca } from "@/components/Hero";
import { Migalhas } from "@/components/Migalhas";

/**
 * Topo das páginas internas: foto de fundo que aparece à direita (no desktop o navy cobre só o lado do texto e
 * vai abrindo para a foto), a elipse da marca bem fraca, trilha, título, uma explicação curta, os pontos-chave
 * em etiquetas com check e, se quiser, botões. A foto assenta devagar e o texto entra em fila, como no hero da home.
 * `imagem.posicao` escolhe que parte da foto fica visível (CSS object-position).
 */
export function CabecalhoPagina({
  titulo,
  texto,
  imagem,
  pontos,
  children,
}: {
  titulo: string;
  texto?: string;
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
            <div className="absolute inset-0 bg-navy/65 lg:hidden" />
            <div className="absolute inset-0 hidden bg-navy/10 lg:block" />
          </>
        ) : (
          <>
            {/* Celular: véu com degradê (mais escuro embaixo, onde está o texto). Desktop: navy firme à esquerda
                e a foto aparecendo bem à direita. */}
            <div className="absolute inset-0 bg-linear-to-b from-navy/70 via-navy/80 to-navy/95 lg:hidden" />
            <div className="absolute inset-0 hidden bg-linear-to-r from-navy from-25% via-navy/75 via-55% to-navy/5 lg:block" />
          </>
        )}
        {/* Brilho azul da marca no canto do texto, para o navy não ficar chapado. */}
        <div className="absolute -top-1/3 -left-1/4 h-[140%] w-[70%] rounded-full bg-[radial-gradient(closest-side,rgb(46_70_134/0.55),transparent)]" />
      </div>
      <ElipseMarca />

      <div className="container-site relative pt-4 pb-12 lg:pt-6 lg:pb-20">
        <Migalhas itens={[{ nome: "Início", href: "/" }, { nome: titulo }]} escuro />

        <div className="hero-texto mt-8 max-w-[640px] lg:mt-14">
          <h1 className="text-display text-balance">{titulo}</h1>
          {texto && <p className="mt-4 max-w-[52ch] text-body-lg text-white/85">{texto}</p>}

          {/* Etiquetas do mesmo tamanho: colunas iguais e mesma altura (o texto quebra dentro, se precisar). */}
          {pontos && pontos.length > 0 && (
            <ul className="mt-7 grid grid-cols-1 gap-2 sm:grid-cols-3 lg:mt-8">
              {pontos.map((p) => (
                <li
                  key={p}
                  className="flex h-full min-h-11 items-center gap-2.5 rounded-[14px] bg-white/10 py-2 pr-3 pl-2.5 text-small leading-5 text-white ring-1 ring-white/15 backdrop-blur-sm"
                >
                  <span aria-hidden className="grid size-5 shrink-0 place-items-center rounded-full bg-brand-light text-navy">
                    <Check className="size-3" strokeWidth={3.5} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          )}

          {children && <div className="mt-8 flex flex-col gap-3 sm:flex-row">{children}</div>}
        </div>
      </div>
    </header>
  );
}
