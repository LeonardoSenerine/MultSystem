"use client";

import Image from "next/image";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

/*
 * Banner no alto da página de produtos: um destaque por vez, que explica para quem é a loja (empresa,
 * pessoa física) e como funciona a compra. Os destaques ficam empilhados e trocam com um fade suave
 * (a capa dá um leve zoom-out e o texto sobe em fila). Passa sozinho; também troca pelas setas e
 * deslizando o dedo para o lado.
 *
 * Cada destaque usa uma CAPA (imagem de fundo, em public/img/vitrine/) recebida em `capas`, pelo id do
 * destaque (a lista fica em Catalogo.tsx). Sem a capa, mostra uma colagem de fotos de produtos. O texto é sempre HTML (editável, lido por leitor de tela e pelo Google).
 * Só usa o que o site já afirma em outras páginas (cartão em até 3x sem juros, retirada em Itatiba,
 * frete e prazos a combinar com o vendedor).
 */

const TEMPO = 7000;

/** Cor de fundo das capas (todas terminam nela à esquerda): o banner inteiro usa essa cor. */
const FUNDO_CAPA = "bg-[#ebf0f6]";

/**
 * Posição das 5 fotos da colagem numa grade de 4 colunas x 3 linhas: uma grande, uma larga, uma alta
 * e duas pequenas. A segunda versão espelha a primeira.
 */
const COLAGEM = [
  [
    "col-start-1 col-span-2 row-start-1 row-span-3",
    "col-start-3 col-span-2 row-start-1",
    "col-start-3 row-start-2 row-span-2",
    "col-start-4 row-start-2",
    "col-start-4 row-start-3",
  ],
  [
    "col-start-3 col-span-2 row-start-1 row-span-3",
    "col-start-1 col-span-2 row-start-1",
    "col-start-2 row-start-2 row-span-2",
    "col-start-1 row-start-2",
    "col-start-1 row-start-3",
  ],
] as const;

/** Foto da colagem: produto (fundo branco, aparece inteiro) ou foto da loja (preenche o quadro). */
type Foto = { src: string; loja?: boolean };
const produto = (codigo: string): Foto => ({ src: `/img/vitrine/${codigo}.png` });

type Destaque = {
  id: string;
  etiqueta: string;
  titulo: string;
  texto: string;
  itens: string[];
  numerado?: boolean;
  fotos: [Foto, Foto, Foto, Foto, Foto];
  espelho?: boolean;
  /** Esconde as setas neste destaque (elas cobririam os produtos da capa). */
  semSetas?: boolean;
};

const destaques: Destaque[] = [
  {
    id: "empresas",
    etiqueta: "Para empresas",
    titulo: "Orçamento para a sua empresa",
    texto: "Computadores, impressoras, redes e câmeras em quantidade, com nota fiscal e um vendedor que acompanha o pedido.",
    itens: ["Cotação com condição especial", "Nota fiscal no CNPJ", "Atendimento direto com o vendedor"],
    fotos: [produto("0014409"), produto("0014443"), produto("0014795"), produto("0014497"), produto("0013694")],
  },
  {
    id: "pessoa-fisica",
    etiqueta: "Para você",
    titulo: "Compre para casa ou para o trabalho",
    texto: "Veja o preço de cada produto no site, monte o carrinho e feche com o vendedor pelo WhatsApp.",
    itens: ["Cartão em até 3x sem juros", "Retirada na loja, em Itatiba", "Frete a combinar com o vendedor"],
    fotos: [produto("0014721"), produto("0014472"), produto("0014593"), produto("0014656"), produto("0013798")],
    espelho: true,
  },
  {
    id: "como-funciona",
    etiqueta: "Como funciona",
    titulo: "Do site até a sua mão, em 3 passos",
    texto: "Sem cadastro e sem pagar nada no site: o pedido é fechado com o vendedor.",
    itens: [
      "Escolha os produtos e coloque no carrinho",
      "Envie o pedido pelo WhatsApp: o vendedor confirma estoque e valores",
      "Retire na loja ou combine a entrega",
    ],
    numerado: true,
    semSetas: true,
    fotos: [{ src: "/img/fachada-noite.jpg", loja: true }, produto("0014464"), produto("0014466"), produto("0013318"), produto("0014228")],
  },
];

const semMovimento = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const seta =
  "pointer-events-auto grid size-11 place-items-center rounded-full bg-white/65 text-ink/60 backdrop-blur-[2px] transition-[background-color,color,transform] duration-200 hover:bg-white hover:text-brand active:scale-90";

/** `capas`: caminho da capa de cada destaque (pelo id), para os que já têm a imagem pronta. */
export function VitrineProdutos({ capas = {} }: { capas?: Record<string, string> }) {
  const [indice, setIndice] = useState(0);
  const [pausado, setPausado] = useState(false);
  const toque = useRef<{ x: number; y: number } | null>(null);

  const ir = useCallback((i: number) => setIndice((i + destaques.length) % destaques.length), []);

  // Passa sozinho a cada TEMPO. Qualquer troca (setas ou dedo) reinicia a contagem. Fica parado com o
  // mouse em cima, com o foco dentro ou com movimento reduzido ativado.
  useEffect(() => {
    if (pausado || semMovimento()) return;
    const t = window.setTimeout(() => ir(indice + 1), TEMPO);
    return () => window.clearTimeout(t);
  }, [pausado, indice, ir]);

  // Deslizar para o lado troca o destaque: só conta se o gesto for mais horizontal que vertical.
  const aoSoltar = (e: React.PointerEvent) => {
    const inicio = toque.current;
    toque.current = null;
    if (!inicio) return;
    const dx = e.clientX - inicio.x;
    const dy = e.clientY - inicio.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) ir(indice + (dx < 0 ? 1 : -1));
  };

  return (
    <section
      aria-roledescription="carrossel"
      aria-label="Como comprar na Multsystems"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
      onPointerDown={(e) => (toque.current = { x: e.clientX, y: e.clientY })}
      onPointerUp={aoSoltar}
      onPointerCancel={() => (toque.current = null)}
      className={`relative touch-pan-y overflow-hidden rounded-card ring-1 ring-line ${FUNDO_CAPA}`}
    >
      {/* Os destaques ocupam a mesma célula da grade: o mais alto define a altura do banner. */}
      <div aria-live={pausado ? "polite" : "off"} className="grid">
        {destaques.map((d, i) => {
          const capa = capas[d.id];
          const posicoes = COLAGEM[d.espelho ? 1 : 0];
          return (
            <div
              key={d.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} de ${destaques.length}`}
              inert={i !== indice}
              data-ativo={i === indice}
              className={`vitrine-slide relative col-start-1 row-start-1 grid grid-cols-1 lg:min-h-[360px] ${
                capa ? "" : "bg-white lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]"
              }`}
            >
              {capa ? (
                /* Capa: no celular fica em cima do texto (com a base esmaecendo na cor do fundo); no desktop
                   é o fundo do banner inteiro. */
                <div aria-hidden className="relative aspect-[16/9] overflow-hidden lg:absolute lg:inset-0 lg:aspect-auto">
                  <div className="vitrine-capa absolute inset-0">
                    <Image
                      src={capa}
                      alt=""
                      fill
                      quality={85}
                      preload={i === 0}
                      sizes="(min-width: 1200px) 1152px, 100vw"
                      className="object-cover object-right"
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#ebf0f6] to-transparent lg:hidden" />
                </div>
              ) : (
                /* Sem capa: colagem de fotos de produtos. */
                <div
                  aria-hidden
                  className="grid h-[210px] grid-cols-4 grid-rows-3 gap-1.5 bg-tint p-2 sm:h-[260px] sm:gap-2 sm:p-3 lg:order-2 lg:h-auto lg:gap-2.5 lg:p-4"
                >
                  {d.fotos.map((foto, n) => (
                    <div
                      key={foto.src}
                      style={{ "--i": n } as React.CSSProperties}
                      className={`vitrine-tile relative overflow-hidden rounded-[14px] bg-white ${posicoes[n]}`}
                    >
                      <Image
                        src={foto.src}
                        alt=""
                        fill
                        quality={75}
                        preload={i === 0 && n === 0}
                        sizes={n === 0 ? "(min-width: 1200px) 340px, (min-width: 1024px) 28vw, 50vw" : "(min-width: 1024px) 200px, 30vw"}
                        className={foto.loja ? "object-cover" : "object-contain p-1.5 sm:p-2.5 lg:p-3"}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div
                className={`vitrine-texto relative flex flex-col justify-center p-5 sm:p-6 lg:order-1 lg:p-10 ${
                  capa ? "lg:max-w-[48%] lg:pl-16" : ""
                }`}
              >
                <p className="text-[12px] leading-4 font-bold tracking-[0.08em] text-brand uppercase">{d.etiqueta}</p>
                {/* Não é um título (h2): o banner vem antes do h1 da página, o que bagunçaria a ordem dos títulos. */}
                <p className="mt-2 text-[22px] leading-7 font-extrabold tracking-tight text-balance text-ink lg:text-[28px] lg:leading-9">{d.titulo}</p>
                <p className="mt-2 text-body text-muted">{d.texto}</p>

                <ul className="mt-4 space-y-2 text-small text-ink">
                  {d.itens.map((item, n) => (
                    <li key={item} className="flex items-start gap-2.5">
                      {d.numerado ? (
                        <span aria-hidden className="mt-px grid size-5 shrink-0 place-items-center rounded-full bg-brand text-[12px] leading-none font-bold text-white">
                          {n + 1}
                        </span>
                      ) : (
                        <Check aria-hidden strokeWidth={3} className="mt-0.5 size-4 shrink-0 text-[#00734c]" />
                      )}
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Setas simples nas laterais. No celular ficam na altura da capa (16:9); no desktop, no meio do banner. */}
      <div
        inert={destaques[indice].semSetas}
        className={`pointer-events-none absolute inset-x-0 top-0 z-20 flex aspect-[16/9] items-center justify-between px-1 transition-opacity duration-500 lg:inset-y-0 lg:aspect-auto lg:px-3 ${
          destaques[indice].semSetas ? "opacity-0" : ""
        }`}
      >
        <button type="button" onClick={() => ir(indice - 1)} aria-label="Destaque anterior" className={seta}>
          <ChevronLeft aria-hidden className="size-7" strokeWidth={2} />
        </button>
        <button type="button" onClick={() => ir(indice + 1)} aria-label="Próximo destaque" className={seta}>
          <ChevronRight aria-hidden className="size-7" strokeWidth={2} />
        </button>
      </div>
    </section>
  );
}
