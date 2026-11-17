import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { RastreadorCliques } from "@/components/analytics/RastreadorCliques";
import { AvisoCookies } from "@/components/cookies/AvisoCookies";
import { SincronizarCarrinho } from "@/components/carrinho/SincronizarCarrinho";
import { DadosEstruturados } from "@/components/DadosEstruturados";
import { Encerramento } from "@/components/Encerramento";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { getContato } from "@/lib/dados";
import { SITE_URL } from "@/lib/site";
import { mensagens, whatsappLink } from "@/lib/whatsapp";
import "./globals.css";

// Baixada no build e servida pelo próprio site (nada é pedido ao Google em tempo real).
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const descricao =
  "Loja de informática em Itatiba/SP desde 1995. Computadores, impressoras, redes e câmeras com nota fiscal. Orçamento para empresas e compra pelo WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Multsystems",
  title: {
    default: "Multsystems | Informática em Itatiba para empresas e para casa",
    template: "%s | Multsystems",
  },
  description: descricao,
  keywords: ["informática em Itatiba", "loja de informática", "notebook", "impressora", "câmeras de segurança", "assistência técnica", "orçamento para empresas"],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Multsystems",
    title: "Multsystems | Informática em Itatiba",
    description: descricao,
  },
  twitter: {
    card: "summary_large_image",
    title: "Multsystems | Informática em Itatiba",
    description: descricao,
  },
};

export const viewport: Viewport = {
  themeColor: "#1c2f5c",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const contato = getContato();

  return (
    <html lang="pt-BR" className={manrope.variable}>
      <body className="flex min-h-dvh flex-col">
        <DadosEstruturados />
        <Header />
        <main id="conteudo" className="flex-1">
          {children}
        </main>
        {/* O fecho "Fale com a gente" aparece em todas as páginas, logo antes do rodapé. */}
        <Encerramento />
        <Footer />
        <WhatsAppFab href={whatsappLink(contato.whatsapp, mensagens.geral)} />
        <SincronizarCarrinho />
        <RastreadorCliques />
        <AvisoCookies />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
