import Link from "next/link";
import type { Contato } from "@/types";

/** Faixa de atendimento (só desktop). Texto simples com separadores, sem ícones. */
export function TopBar({ contato }: { contato: Contato }) {
  return (
    <div className="on-dark hidden bg-navy text-white lg:block">
      <div className="container-site flex h-11 items-center justify-between text-small">
        <ul className="flex items-center text-white/85 [&>li]:flex [&>li]:items-center [&>li+li]:before:mx-3 [&>li+li]:before:text-white/35 [&>li+li]:before:content-['·']">
          <li>{contato.horario}</li>
          <li>
            <a href={contato.telefoneLink} className="inline-flex min-h-11 items-center hover:text-white">
              {contato.telefone}
            </a>
          </li>
          <li>{contato.cidade}</li>
        </ul>
        <ul className="flex items-center text-white/85 [&>li]:flex [&>li]:items-center [&>li+li]:before:mx-3 [&>li+li]:before:text-white/35 [&>li+li]:before:content-['·']">
          <li>
            <Link href="/como-comprar" className="flex min-h-11 items-center hover:text-white">
              Como comprar
            </Link>
          </li>
          <li>
            <a href={contato.mercadoLivreUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center hover:text-white">
              Loja oficial no Mercado Livre
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
