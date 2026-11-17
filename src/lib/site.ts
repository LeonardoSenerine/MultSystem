/*
 * Endereço público do site (sitemap, links absolutos, capa de link, dados estruturados).
 *
 * Ordem de escolha:
 * 1. NEXT_PUBLIC_SITE_URL, se estiver definida (use quando o domínio definitivo estiver no ar);
 * 2. na Vercel, o endereço de produção do próprio projeto (a Vercel informa em
 *    VERCEL_PROJECT_PRODUCTION_URL, ex.: multsystems.vercel.app), então a capa de link e o sitemap já
 *    funcionam no endereço de teste sem configurar nada;
 * 3. https://www.multsystems.com.br.
 *
 * TODO: confirmar o domínio final antes de publicar. Quando multsystems.com.br apontar para a Vercel,
 * defina NEXT_PUBLIC_SITE_URL com o endereço exato que deve valer (com ou sem "www").
 */
const definido = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const daVercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined;

export const SITE_URL = (definido || daVercel || "https://www.multsystems.com.br").replace(/\/$/, "");

export const urlDoSite = (caminho: string) => `${SITE_URL}${caminho}`;
