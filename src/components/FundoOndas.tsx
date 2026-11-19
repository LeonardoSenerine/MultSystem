/**
 * Fundo decorativo de ondas suaves (feito em SVG, sem imagem): camadas em azul-claro da marca que descem do
 * canto de cima à direita e sobem do canto de baixo à esquerda, deixando o centro limpo para o conteúdo.
 * Cada canto é uma peça com proporção fixa (não estica com a seção, então não distorce) e com largura
 * relativa à tela, para aparecer bem também no celular. A peça de baixo some num degradê, sem corte seco.
 * Uso: dentro de um elemento `relative isolate overflow-hidden`.
 */
function Canto({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 400" fill="none" aria-hidden focusable="false" className={`block h-auto w-full ${className}`}>
      <g style={{ filter: "drop-shadow(0 8px 14px rgb(44 68 130 / 0.07))" }}>
        <path d="M600 0H70C130 70 230 78 320 118C420 162 470 262 600 352Z" fill="#a9bbea" fillOpacity="0.16" />
        <path d="M600 0H215C262 58 338 78 410 106C496 140 530 218 600 268Z" fill="#a9bbea" fillOpacity="0.22" />
        <path d="M600 0H352C384 44 432 62 482 82C540 106 566 150 600 182Z" fill="#a9bbea" fillOpacity="0.3" />
        <path d="M600 0H468C486 26 512 38 540 50C572 64 588 86 600 102Z" fill="#8fa6e0" fillOpacity="0.28" />
      </g>
    </svg>
  );
}

export function FundoOndas() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      {/* Base: tint que clareia para quase branco no meio. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_55%_45%,#fbfcff_0%,#f4f7fd_45%,var(--color-tint)_100%)]" />

      <div className="absolute top-0 right-0 w-[92%] max-w-[860px] sm:w-[70%] lg:w-[52%]">
        <Canto />
      </div>

      {/* Só no celular/tablet, onde a foto cobre o canto de cima: uma onda a mais ao lado do texto, surgindo
          num degradê (o topo reto da peça fica invisível). */}
      <div className="absolute top-[44%] right-0 w-[88%] [mask-image:linear-gradient(to_bottom,transparent,#000_45%)] sm:w-[60%] lg:hidden">
        <Canto />
      </div>

      <div className="absolute bottom-0 left-0 w-[96%] max-w-[860px] [mask-image:linear-gradient(to_top,transparent,#000_40%)] sm:w-[70%] lg:w-[50%]">
        <Canto className="rotate-180" />
      </div>
    </div>
  );
}
