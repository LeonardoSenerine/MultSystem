import Image from "next/image";

// TODO: os SVGs do logo são uma vetorização feita a partir de uma imagem pequena.
// Pedir à Multsystems o vetor original (SVG, AI ou PDF) e trocar os arquivos em public/img/.

type LogoProps = {
  variante?: "azul" | "branco";
  className?: string;
  /** Logo do topo da página (acima da dobra): carrega na hora, sem esperar a rolagem. */
  carregarJa?: boolean;
};

export function Logo({ variante = "azul", className, carregarJa = false }: LogoProps) {
  return (
    <Image
      src={variante === "azul" ? "/img/logo-azul.svg" : "/img/logo-branco.svg"}
      alt="Multsystems"
      width={300}
      height={277}
      unoptimized
      loading={carregarJa ? "eager" : undefined}
      className={className}
    />
  );
}
