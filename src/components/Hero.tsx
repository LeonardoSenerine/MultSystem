import Image from "next/image";
import { Button } from "@/components/Button";
import { getContato } from "@/lib/dados";

// A foto original da fachada tinha só 646 px (guardada em public/img/fachada-original.jpg).
// Esta versão foi ampliada 4x por IA (ESRGAN) e reduzida para 2400 px. Fica melhor, mas não
// inventa detalhe: TODO pedir à Multsystems uma foto nova com pelo menos 2000 px.

/** Elipse em pincelada do logo: traço branco bem fraco que se desenha ao carregar. */
export function ElipseMarca() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1000 640"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      className="hero-ellipse pointer-events-none absolute inset-0 h-full w-full"
    >
      <g transform="translate(120 10) rotate(-12 500 320)">
        <path
          pathLength={1}
          d="M140 430C58 318 176 150 432 86c260-64 500 2 540 136 40 134-136 290-398 346C316 622 214 520 140 430Z"
          stroke="#fff"
          strokeOpacity={0.08}
          strokeWidth={22}
          strokeLinecap="round"
        />
        <path
          pathLength={1}
          d="M186 458C106 344 228 186 468 128c244-58 462 2 498 124 36 122-128 266-370 318-218 46-350-26-410-112"
          stroke="#fff"
          strokeOpacity={0.06}
          strokeWidth={6}
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

export function Hero() {
  const contato = getContato();

  return (
    <section id="inicio" aria-labelledby="hero-titulo" className="on-dark relative isolate overflow-hidden bg-navy text-white">
      <ElipseMarca />

      <div className="container-site relative grid gap-y-8 pt-8 pb-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,580px)] lg:gap-x-14 lg:gap-y-8 lg:py-12">
        <div className="hero-texto lg:col-start-1 lg:row-start-1 lg:self-end">
          <p className="inline-flex flex-wrap items-center gap-x-2 rounded-btn border border-white/25 px-3 py-1.5 text-small text-white">
            <span>Desde 1995 em Itatiba</span>
            <span aria-hidden className="text-white/40">·</span>
            <span>Especialistas em B2B</span>
          </p>

          <h1 id="hero-titulo" className="mt-5 text-display text-balance lg:mt-6">
            Informática para sua empresa <span className="block text-brand-light">e para sua casa</span>
          </h1>

          <p className="mt-4 max-w-[42ch] text-body-lg text-white/85 lg:mt-6">
            Computadores, impressoras, redes e câmeras com nota fiscal, garantia e atendimento de quem entende.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="#orcamento" variante="branco" tamanho="lg" className="w-full sm:w-auto">
              Pedir orçamento
            </Button>
            <Button href="/produtos" variante="contorno-branco" tamanho="lg" className="w-full sm:w-auto">
              Ver produtos
            </Button>
          </div>
        </div>

        <figure className="hero-foto lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
          <Image
            src="/img/fachada.jpg"
            alt="Fachada da loja Multsystems em Itatiba, com o letreiro azul acima da entrada"
            width={2400}
            height={1757}
            preload
            fetchPriority="high"
            quality={85}
            sizes="(min-width: 1024px) 580px, (min-width: 768px) 720px, 100vw"
            className="aspect-[2400/1757] h-auto w-full rounded-photo object-cover"
          />
          <figcaption className="mt-3 text-small text-white/85">
            Nossa loja: <span className="text-white">{contato.endereco}</span>
          </figcaption>
        </figure>

        <ul className="flex flex-wrap items-center gap-y-1 border-t border-white/15 pt-5 text-small text-white/85 lg:col-start-1 lg:row-start-2 lg:self-start [&>li+li]:before:mx-2 [&>li+li]:before:text-white/40 [&>li+li]:before:content-['·']">
          <li className="whitespace-nowrap">
            <a
              href={contato.mercadoLivreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center underline-offset-4 hover:text-white hover:underline"
            >
              Loja oficial no Mercado Livre
            </a>
          </li>
          <li className="whitespace-nowrap">Nota fiscal e garantia</li>
          <li className="whitespace-nowrap">Retirada na loja</li>
        </ul>
      </div>
    </section>
  );
}
