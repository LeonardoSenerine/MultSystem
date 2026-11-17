"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { Campo, ariaCampo, classeCampo, mascararTelefone } from "@/components/forms/campos";
import { salvarCadastro } from "@/lib/cadastro";
import { evento } from "@/lib/eventos";

type Erros = Partial<Record<"whatsapp" | "email", string>>;

/**
 * Contato OPCIONAL no carrinho: quem quiser deixa WhatsApp e e-mail para a loja avisar se o carrinho
 * ficar parado. Fechado por padrão, para não atrapalhar quem só quer finalizar.
 */
export function ContatoCarrinho() {
  const [aberto, setAberto] = useState(false);
  const [erros, setErros] = useState<Erros>({});
  const id = useId();

  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    const novos: Erros = {};
    if (d.whatsapp.replace(/\D/g, "").length < 10) novos.whatsapp = "Informe o WhatsApp com DDD.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) novos.email = "Informe um e-mail válido.";
    setErros(novos);
    const primeiro = Object.keys(novos)[0];
    if (primeiro) return form.querySelector<HTMLElement>(`[name="${primeiro}"]`)?.focus();
    salvarCadastro({ nome: d.nome.trim(), whatsapp: d.whatsapp.trim(), email: d.email.trim() });
    evento("deixar_contato_carrinho", {}, true);
  }

  return (
    <div className="mt-5 border-t border-line pt-4">
      <button
        type="button"
        aria-expanded={aberto}
        aria-controls={`${id}-form`}
        onClick={() => setAberto((a) => !a)}
        className="flex min-h-11 w-full items-center justify-between gap-3 text-left"
      >
        <span>
          <span className="block text-small font-bold text-ink">Quer um lembrete do seu carrinho?</span>
          <span className="block text-[13px] leading-[18px] text-muted">Opcional: a gente avisa se ele ficar parado.</span>
        </span>
        <ChevronDown aria-hidden className={`size-5 shrink-0 text-muted transition-transform duration-300 ${aberto ? "rotate-180" : ""}`} />
      </button>

      {aberto && (
        <form id={`${id}-form`} onSubmit={enviar} noValidate className="erro-campo mt-3 grid gap-3">
          <Campo id={`${id}-nome`} rotulo="Seu nome" opcional>
            <input id={`${id}-nome`} name="nome" autoComplete="name" className={`${classeCampo} h-12`} />
          </Campo>
          <Campo id={`${id}-whatsapp`} rotulo="WhatsApp com DDD" erro={erros.whatsapp}>
            <input
              id={`${id}-whatsapp`}
              name="whatsapp"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="(11) 99999-9999"
              onInput={(e) => mascararTelefone(e.currentTarget)}
              className={`${classeCampo} h-12`}
              {...ariaCampo(`${id}-whatsapp`, erros.whatsapp)}
            />
          </Campo>
          <Campo id={`${id}-email`} rotulo="E-mail" erro={erros.email}>
            <input
              id={`${id}-email`}
              name="email"
              type="email"
              autoComplete="email"
              className={`${classeCampo} h-12`}
              {...ariaCampo(`${id}-email`, erros.email)}
            />
          </Campo>
          <button
            type="submit"
            className="inline-flex min-h-12 items-center justify-center rounded-btn bg-brand px-5 font-bold text-white transition-[background-color,transform] hover:bg-[#263b73] active:scale-[0.98]"
          >
            Quero o lembrete
          </button>
          <p className="text-[13px] leading-[18px] text-muted">
            Ao salvar, você autoriza a Multsystems a falar com você por WhatsApp e e-mail sobre os produtos do carrinho. Sem propaganda, e você pode
            pedir para apagar quando quiser. Veja a{" "}
            <Link href="/privacidade" className="font-bold text-brand hover:underline">
              Política de Privacidade
            </Link>
            .
          </p>
        </form>
      )}
    </div>
  );
}
