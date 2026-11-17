import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

/*
 * Hierarquia (regra 9): o azul cheio ("primario") é só para a ação mais importante da seção.
 * WhatsApp usa o verde oficial com texto ink: branco sobre #25D366 não passa no contraste (1,98:1).
 */
const variantes = {
  primario: "bg-brand text-white hover:bg-[#263b73]",
  branco: "bg-white text-navy hover:bg-tint",
  "contorno-branco": "border border-white/70 text-white hover:bg-white/10 hover:border-white",
  contorno: "border border-line text-ink hover:border-brand hover:text-brand",
  whatsapp: "bg-whatsapp text-ink hover:bg-[#1fbe5a]",
} as const;

export type ButtonVariante = keyof typeof variantes;

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variante?: ButtonVariante;
  tamanho?: "md" | "lg";
  larguraTotal?: boolean;
  icone?: ReactNode;
};

export function Button({
  variante = "primario",
  tamanho = "md",
  larguraTotal = false,
  icone,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const externo = /^https?:\/\//.test(props.href);
  // Páginas do próprio site navegam sem recarregar (next/link); o resto é <a> comum.
  const Tag = props.href.startsWith("/") ? Link : "a";
  return (
    <Tag
      {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-btn font-bold whitespace-nowrap",
        "transition-[background-color,border-color,color,transform] duration-200 ease-out active:scale-[0.98] motion-safe:hover:-translate-y-px",
        tamanho === "lg" ? "min-h-13 px-6 text-body" : "min-h-11 px-5 text-[15px] leading-5",
        larguraTotal ? "w-full" : "",
        variantes[variante],
        className,
      ].join(" ")}
    >
      {icone}
      {children}
    </Tag>
  );
}
