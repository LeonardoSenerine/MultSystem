import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
    // Fotos de produto do catálogo da loja.
    remotePatterns: [new URL("https://multsystems.com.br/focus/**")],
  },
  // Endereços do site antigo, para quem tem o link salvo e para o Google não cair em erro.
  async redirects() {
    return [
      { source: "/servicos", destination: "/assistencia", permanent: true },
      { source: "/escritorio", destination: "/empresas", permanent: true },
      // Os navegadores sempre pedem /favicon.ico; o ícone do site é o SVG, então aponta para ele (evita um 404 em toda visita).
      { source: "/favicon.ico", destination: "/icon.svg", permanent: false },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
