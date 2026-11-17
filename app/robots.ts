import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/** robots.txt: libera o site e esconde o que não deve aparecer no Google (API, carrinho, favoritos). */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/carrinho", "/favoritos"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
