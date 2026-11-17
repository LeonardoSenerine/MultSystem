/** Endereço público do site (sitemap, links absolutos, dados estruturados). TODO: confirmar o domínio final antes de publicar. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.multsystems.com.br").replace(/\/$/, "");

export const urlDoSite = (caminho: string) => `${SITE_URL}${caminho}`;
