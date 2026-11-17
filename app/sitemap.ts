import type { MetadataRoute } from "next";
import { departamentos } from "@/data/departamentos";
import { getProdutos } from "@/lib/catalogo";
import { urlDoSite } from "@/lib/site";

/**
 * sitemap.xml: páginas do site, departamentos e todos os produtos do catálogo.
 * O catálogo é lido do cache de 1 hora; se a API estiver fora do ar, o sitemap sai só com as páginas fixas.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const fixas: { caminho: string; prioridade: number; frequencia: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { caminho: "/", prioridade: 1, frequencia: "weekly" },
    { caminho: "/produtos", prioridade: 0.9, frequencia: "daily" },
    { caminho: "/empresas", prioridade: 0.8, frequencia: "monthly" },
    { caminho: "/assistencia", prioridade: 0.8, frequencia: "monthly" },
    { caminho: "/orcamento", prioridade: 0.7, frequencia: "monthly" },
    { caminho: "/como-comprar", prioridade: 0.7, frequencia: "monthly" },
    { caminho: "/sobre", prioridade: 0.5, frequencia: "yearly" },
    { caminho: "/contato", prioridade: 0.6, frequencia: "yearly" },
    { caminho: "/privacidade", prioridade: 0.2, frequencia: "yearly" },
    { caminho: "/cookies", prioridade: 0.2, frequencia: "yearly" },
  ];

  const paginas: MetadataRoute.Sitemap = fixas.map((p) => ({
    url: urlDoSite(p.caminho),
    changeFrequency: p.frequencia,
    priority: p.prioridade,
  }));

  const categorias: MetadataRoute.Sitemap = departamentos.map((d) => ({
    url: urlDoSite(`/categoria/${d.slug}`),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  let produtos: MetadataRoute.Sitemap = [];
  try {
    // Produtos com foto primeiro: são os que melhor aparecem nos resultados.
    produtos = (await getProdutos())
      .toSorted((a, b) => Number(b.temFoto) - Number(a.temFoto))
      .map((p) => ({ url: urlDoSite(`/produto/${p.slug}`), changeFrequency: "daily", priority: p.temFoto ? 0.6 : 0.4 }));
  } catch {
    // Catálogo indisponível: segue só com as páginas fixas.
  }

  return [...paginas, ...categorias, ...produtos];
}
