import type { Contato } from "@/types";

/*
 * Os números de WhatsApp vêm do .env.local (veja .env.example).
 *
 * TODO: dado real. Confirmar com a Multsystems:
 *  - Endereço, WhatsApp, Mercado Livre e Instagram foram tirados do site atual
 *    (multsystems.com.br). Confirmar se continuam valendo.
 *  - WhatsApp da Total Tech: ainda não temos. Enquanto não vier, cai no da Multsystems.
 */

const somenteDigitos = (valor: string | undefined) => (valor ?? "").replace(/\D/g, "");

const whatsapp = somenteDigitos(process.env.WHATSAPP_MULTSYSTEMS) || "551148948411";
const whatsappTotalTech = somenteDigitos(process.env.WHATSAPP_TOTALTECH) || whatsapp;

const endereco = "R. Campos Sales, 508, Centro, Itatiba/SP";
const enderecoBusca = encodeURIComponent("R. Campos Sales, 508 - Centro, Itatiba - SP");

export const contato: Contato = {
  whatsapp,
  whatsappTotalTech,
  telefone: "(11) 4894-8411",
  telefoneLink: "tel:+551148948411",
  email: "vendas@multsystems.com.br",
  // CNPJ enviado pelo cliente em 18/11/2026 (dígitos verificadores conferidos). TODO: ainda falta a razão social.
  cnpj: "62.115.431/0001-50",
  horario: "Seg a sex, 8h às 17h30 · Sáb, 9h às 12h",
  cidade: "Itatiba/SP",
  endereco,
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${enderecoBusca}`,
  mapsEmbedUrl: `https://www.google.com/maps?q=${enderecoBusca}&output=embed`,
  mercadoLivreUrl: "https://www.mercadolivre.com.br/pagina/multsystemsmeli",
  mercadoLivreNota: "5.0",
  // Link enviado pelo cliente em 17/11/2026 (busca da loja no Google). TODO: trocar pelo link direto das avaliações do Perfil da Empresa.
  googleAvaliacoesUrl: "https://share.google/8j2peydGwfXuTYEL3",
  instagramUrl: "https://www.instagram.com/multsystems_oficial/",
  instagramUsuario: "@multsystems_oficial",
};
