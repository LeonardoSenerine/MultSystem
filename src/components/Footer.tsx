import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { BotaoCookies } from "@/components/cookies/BotaoCookies";
import { ElipseMarca } from "@/components/Hero";
import { Logo } from "@/components/Logo";
import { departamentos } from "@/data/departamentos";
import { getContato } from "@/lib/dados";
import { mensagens, whatsappLink } from "@/lib/whatsapp";

const link =
  "group/link inline-flex min-h-11 min-w-11 items-center text-white/80 transition-[color,transform] duration-200 hover:translate-x-1 hover:text-white";
const titulo = "text-eyebrow text-white/60";
const baixo = "inline-flex min-h-11 items-center text-white/70 transition-colors hover:text-white hover:underline";
const chip =
  "inline-flex min-h-11 items-center rounded-full border border-white/25 px-4 text-[14px] font-bold text-white transition-[background-color,border-color,transform] duration-200 hover:border-white hover:bg-white/10 active:scale-95";

const institucional = [
  { label: "Assistência técnica", href: "/assistencia" },
  { label: "Para empresas", href: "/empresas" },
  { label: "Como comprar", href: "/como-comprar" },
  { label: "Pedir orçamento", href: "/orcamento" },
  { label: "Sobre a Multsystems", href: "/sobre" },
  { label: "Contato", href: "/contato" },
];

/**
 * Rodapé em quatro colunas de mesma largura de linha: marca (com atalhos), produtos, a empresa
 * e atendimento. A barra de baixo tem o copyright e o "Voltar ao topo".
 */
export function Footer() {
  const contato = getContato();

  return (
    <footer className="on-dark relative isolate overflow-hidden bg-navy text-white">
      <ElipseMarca />

      <div className="container-site relative grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[minmax(0,4fr)_minmax(0,3fr)_minmax(0,3fr)_minmax(0,3fr)] lg:gap-12 lg:py-16">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo variante="branco" className="h-14 w-auto" />
          <p className="mt-4 max-w-[36ch] text-body text-white/80">
            Loja de informática em Itatiba desde 1995, especializada em B2B e aberta também para quem compra para casa.
            Você fala com quem vende.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            <li>
              <a href={whatsappLink(contato.whatsapp, mensagens.geral)} target="_blank" rel="noopener noreferrer" className={chip}>
                WhatsApp
              </a>
            </li>
            <li>
              <a href={contato.instagramUrl} target="_blank" rel="noopener noreferrer" className={chip}>
                Instagram
              </a>
            </li>
            <li>
              <a href={contato.mercadoLivreUrl} target="_blank" rel="noopener noreferrer" className={chip}>
                Mercado Livre
              </a>
            </li>
          </ul>
        </div>

        <nav aria-label="Departamentos">
          <p className={titulo}>Produtos</p>
          <ul className="mt-3 flex flex-col">
            {departamentos.slice(0, 7).map((d) => (
              <li key={d.slug}>
                <Link href={`/categoria/${d.slug}`} className={link}>
                  {d.nome}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/produtos" className={`${link} font-bold text-white`}>
                Ver todos os produtos
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Institucional">
          <p className={titulo}>A Multsystems</p>
          <ul className="mt-3 flex flex-col">
            {institucional.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={link}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className={titulo}>Atendimento</p>
          <ul className="mt-3 flex flex-col">
            <li>
              <a href={contato.telefoneLink} className={link}>
                {contato.telefone}
              </a>
            </li>
            <li>
              <a href={`mailto:${contato.email}`} className={link}>
                {contato.email}
              </a>
            </li>
            <li className="pt-3 text-white/80">{contato.endereco}</li>
            <li className="pt-2 text-white/80">{contato.horario}</li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container-site flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-3 text-small text-white/60">
          <p>© 2026 Multsystems · Itatiba/SP</p>
          <ul className="flex flex-wrap items-center gap-x-5">
            <li>
              <Link href="/privacidade" className={baixo}>
                Política de Privacidade
              </Link>
            </li>
            <li>
              <Link href="/cookies" className={baixo}>
                Cookies
              </Link>
            </li>
            <li>
              <BotaoCookies className={baixo} />
            </li>
            <li>
              <a href="#conteudo" className={`${baixo} group/topo gap-2 font-bold text-white/80`}>
                Voltar ao topo
                <ArrowUp aria-hidden className="size-4 transition-transform duration-200 group-hover/topo:-translate-y-0.5" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
