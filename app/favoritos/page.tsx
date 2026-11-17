import type { Metadata } from "next";
import { PaginaFavoritos } from "@/components/carrinho/PaginaFavoritos";
import { Migalhas } from "@/components/Migalhas";

export const metadata: Metadata = {
  title: "Favoritos",
  robots: { index: false },
};

export default function FavoritosPage() {
  return (
    <div className="bg-tint">
      <div className="container-site pt-4 pb-16 lg:pt-6 lg:pb-24">
        <Migalhas itens={[{ nome: "Início", href: "/" }, { nome: "Favoritos" }]} />
        <h1 className="mt-1 text-[26px] leading-8 font-extrabold tracking-tight text-ink lg:mt-2 lg:text-[34px] lg:leading-[42px]">
          Favoritos
        </h1>
        <p className="mt-1 mb-6 text-small text-muted lg:mb-8">
          Produtos que você guardou, com o preço de hoje comparado ao do dia em que salvou.
        </p>
        <PaginaFavoritos />
      </div>
    </div>
  );
}