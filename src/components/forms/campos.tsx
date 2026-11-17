import type { ReactNode } from "react";

/**
 * Peças compartilhadas dos formulários (orçamento, assistência, cadastro do carrinho).
 * Um campo é: rótulo em cima (que ganha a cor da marca quando o campo está em foco), caixa
 * de 48 px com borda que escurece no hover e anel suave no foco, e o erro logo abaixo.
 */

export const classeCampo =
  "w-full rounded-btn border-[1.5px] border-[#cfd8ec] bg-white px-4 text-body text-ink shadow-[inset_0_1px_0_rgb(28_47_92/0.03)] transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-[#7d89a6] hover:border-[#9fb0d6] focus:border-brand focus:ring-4 focus:ring-brand/12 focus:outline-none aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-50/40 aria-[invalid=true]:focus:ring-red-600/15";

/** Atributos de acessibilidade do controle, ligados à mensagem de erro do `Campo`. */
export function ariaCampo(id: string, erro?: string) {
  return {
    "aria-invalid": erro ? (true as const) : undefined,
    "aria-describedby": erro ? `${id}-erro` : undefined,
  };
}

export function Campo({
  id,
  rotulo,
  erro,
  dica,
  opcional = false,
  className = "",
  children,
}: {
  id: string;
  rotulo: string;
  erro?: string;
  dica?: string;
  opcional?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`group/campo ${className}`}>
      <label
        htmlFor={id}
        className="mb-1.5 flex items-baseline justify-between gap-2 text-small font-semibold text-ink transition-colors group-focus-within/campo:text-brand"
      >
        <span>{rotulo}</span>
        {opcional && <span className="text-[12px] leading-4 font-medium text-muted">opcional</span>}
      </label>
      {children}
      {erro ? (
        <p id={`${id}-erro`} role="alert" className="erro-campo mt-1.5 text-small text-red-700">
          {erro}
        </p>
      ) : dica ? (
        <p className="mt-1.5 text-[13px] leading-[18px] text-muted">{dica}</p>
      ) : null}
    </div>
  );
}

/** Aplica a máscara (11) 99999-9999 enquanto a pessoa digita. */
export function mascararTelefone(el: HTMLInputElement) {
  const n = el.value.replace(/\D/g, "").slice(0, 11);
  const ddd = n.slice(0, 2);
  const resto = n.slice(2);
  let texto = n;
  if (n.length > 2) {
    const corte = n.length > 10 ? 5 : 4;
    texto = `(${ddd}) ${resto.slice(0, corte)}${resto.length > corte ? `-${resto.slice(corte)}` : ""}`;
  } else if (n.length > 0) {
    texto = `(${n}`;
  }
  el.value = texto;
}
