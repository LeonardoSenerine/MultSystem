import type { MetadataRoute } from "next";

/** Manifesto do site: nome e cor usados quando alguém adiciona o site à tela inicial do celular. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Multsystems | Informática em Itatiba",
    short_name: "Multsystems",
    description: "Loja de informática em Itatiba/SP desde 1995, especializada em B2B.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1c2f5c",
    lang: "pt-BR",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
