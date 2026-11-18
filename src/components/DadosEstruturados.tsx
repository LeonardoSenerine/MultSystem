import { funcionamento } from "@/data/horario-loja";
import { getContato } from "@/lib/dados";
import { SITE_URL, urlDoSite } from "@/lib/site";

const hhmm = (min: number) => `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

/**
 * Dados estruturados da loja (schema.org "ComputerStore") para o Google mostrar endereço, telefone e horário.
 * Vem do mesmo `getContato()` e dos horários de src/data/horario-loja.ts, então não há dado duplicado.
 */
export function DadosEstruturados() {
  const contato = getContato();
  const dias = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const dados = {
    "@context": "https://schema.org",
    "@type": "ComputerStore",
    "@id": `${SITE_URL}/#loja`,
    name: "Multsystems",
    description: "Loja de informática em Itatiba/SP desde 1995, especializada em B2B, com assistência técnica parceira (Total Tech).",
    url: SITE_URL,
    logo: urlDoSite("/img/logo-azul.svg"),
    image: urlDoSite("/img/fachada-noite.jpg"),
    telephone: `+${contato.telefoneLink.replace(/\D/g, "")}`,
    email: contato.email,
    foundingDate: "1995",
    taxID: contato.cnpj,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "R. Campos Sales, 508",
      addressLocality: "Itatiba",
      addressRegion: "SP",
      addressCountry: "BR",
    },
    openingHoursSpecification: funcionamento
      .filter((f) => f.abre !== undefined && f.fecha !== undefined)
      .map((f) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: f.dias.map((d) => dias[d]),
        opens: hhmm(f.abre!),
        closes: hhmm(f.fecha!),
      })),
    sameAs: [contato.instagramUrl, contato.mercadoLivreUrl],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(dados).replace(/</g, "\\u003c") }} />;
}
