import Link from "next/link";
import { Button } from "@/components/Button";
import { BuscaTopo } from "@/components/BuscaTopo";
import { HeaderShell } from "@/components/HeaderShell";
import { WhatsAppIcon } from "@/components/icones-marca";
import { Logo } from "@/components/Logo";
import { MobileNav } from "@/components/MobileNav";
import { TopBar } from "@/components/TopBar";
import { IconesConta } from "@/components/carrinho/IconesConta";
import { navegacao } from "@/data/navegacao";
import { getContato } from "@/lib/dados";
import { mensagens, whatsappLink } from "@/lib/whatsapp";

/**
 * Topo fixo de uma linha: logo, menu e ações (favoritos, carrinho, WhatsApp, orçamento).
 * A busca fica numa faixa logo abaixo, que rola junto com a página (e some no catálogo,
 * onde a busca já está junto dos produtos). Assim o topo fixo continua fino.
 */
export function Header() {
  const contato = getContato();
  const whatsappHref = whatsappLink(contato.whatsapp, mensagens.geral);

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:rounded-btn focus:bg-white focus:px-4 focus:py-3 focus:font-bold focus:text-ink"
      >
        Pular para o conteúdo
      </a>
      <TopBar contato={contato} />
      <HeaderShell>
        <div className="container-site flex h-16 items-center justify-between gap-6 lg:h-[84px] lg:gap-4 xl:gap-8">
          <Link href="/" className="shrink-0" aria-label="Multsystems, página inicial">
            <Logo carregarJa className="h-11 w-auto lg:h-[52px]" />
          </Link>

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-0.5 xl:gap-2">
              {navegacao.map((link) => (
                <li key={link.href} className={link.soXl ? "hidden 2xl:block" : undefined}>
                  <Link
                    href={link.href}
                    className="relative flex min-h-12 items-center px-2 text-[15px] leading-5 font-semibold whitespace-nowrap text-ink transition-colors after:absolute after:inset-x-2 after:bottom-1.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-brand after:transition-transform after:duration-300 after:ease-out hover:text-brand hover:after:scale-x-100 xl:px-3.5 xl:after:inset-x-3.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden shrink-0 items-center gap-1.5 lg:flex">
            <IconesConta />
            {/* WhatsApp só com o ícone até 1536 px, para o menu caber numa linha. */}
            <Button
              href={whatsappHref}
              variante="whatsapp"
              aria-label="WhatsApp"
              className="ml-2 px-3 2xl:px-5"
              icone={<WhatsAppIcon className="size-[18px]" />}
            >
              <span className="hidden 2xl:inline">WhatsApp</span>
            </Button>
            <Button href="/orcamento" variante="primario" className="ml-1 px-4 xl:px-5">
              Pedir orçamento
            </Button>
          </div>

          <MobileNav
            links={navegacao}
            whatsappHref={whatsappHref}
            telefone={contato.telefone}
            telefoneLink={contato.telefoneLink}
            horario={contato.horario}
          />
        </div>
      </HeaderShell>
      <BuscaTopo />
    </>
  );
}
