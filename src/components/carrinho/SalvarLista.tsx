"use client";

import { Check, ListPlus } from "lucide-react";
import { useId, useState } from "react";
import { evento } from "@/lib/eventos";
import { salvarListaDoCarrinho } from "@/lib/listas";

/** "Salvar como lista": pede um nome e guarda o carrinho para repetir o pedido depois (compra recorrente). */
export function SalvarLista() {
  const [aberto, setAberto] = useState(false);
  const [salva, setSalva] = useState(false);
  const id = useId();

  if (salva) {
    return (
      <p role="status" className="erro-campo inline-flex min-h-11 items-center gap-1.5 text-[13px] font-bold text-[#00734c]">
        <Check aria-hidden className="size-4" strokeWidth={3} />
        Lista salva. Ela fica logo abaixo.
      </p>
    );
  }

  if (!aberto) {
    return (
      <button
        type="button"
        onClick={() => setAberto(true)}
        className="inline-flex min-h-11 items-center gap-1.5 text-[13px] font-bold text-brand transition-colors hover:underline"
      >
        <ListPlus aria-hidden className="size-4" />
        Salvar como lista
      </button>
    );
  }

  return (
    <form
      className="erro-campo flex flex-wrap items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        const nome = String(new FormData(e.currentTarget).get("nome") ?? "");
        if (salvarListaDoCarrinho(nome)) {
          evento("salvar_lista", {}, true);
          setSalva(true);
          window.setTimeout(() => {
            setSalva(false);
            setAberto(false);
          }, 3000);
        }
      }}
    >
      <label htmlFor={id} className="sr-only">
        Nome da lista
      </label>
      <input
        id={id}
        name="nome"
        autoFocus
        maxLength={60}
        placeholder="Ex.: Toner do escritório"
        className="h-11 min-w-0 flex-1 rounded-btn border-[1.5px] border-[#cfd8ec] bg-white px-3 text-[14px] text-ink transition-[border-color,box-shadow] placeholder:text-[#7d89a6] hover:border-[#9fb0d6] focus:border-brand focus:ring-4 focus:ring-brand/12 focus:outline-none"
      />
      <button
        type="submit"
        className="inline-flex min-h-11 items-center rounded-btn bg-brand px-4 text-[14px] font-bold text-white transition-[background-color,transform] hover:bg-[#263b73] active:scale-[0.98]"
      >
        Salvar
      </button>
    </form>
  );
}
