import type { Metadata } from "next";
import { PaginaCarrinho } from "@/components/carrinho/PaginaCarrinho";
import { Migalhas } from "@/components/Migalhas";
import { getContato } from "@/lib/dados";

export const metadata: Metadata = {
  title: "Carrinho",
  robots: { index: false },
};

export default function CarrinhoPage() {
  const contato = getContato();
  return (
    <div className="bg-tint">
      <div className="container-site pt-4 pb-16 lg:pt-6 lg:pb-24">
        <Migalhas itens={[{ nome: "Início", href: "/" }, { nome: "Carrinho" }]} />
        <h1 className="mt-1 mb-6 text-[26px] leading-8 font-extrabold tracking-tight text-ink lg:mt-2 lg:mb-8 lg:text-[34px] lg:leading-[42px]">
          Seu carrinho
        </h1>
        <PaginaCarrinho whatsapp={contato.whatsapp.replace(/\D/g, "")} />
      </div>
    </div>
  );
}