"use client";

import { ChevronDown, CircleCheck } from "lucide-react";
import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import { WhatsAppIcon } from "@/components/icones-marca";
import { Campo, ariaCampo, classeCampo, mascararTelefone } from "@/components/forms/campos";
import { equipamentosAssistencia } from "@/data/assistencia";
import { evento } from "@/lib/eventos";

type Chave = "nome" | "email" | "telefone" | "equipamento" | "problema";
type Erros = Partial<Record<Chave, string>>;

function validar(d: Record<Chave, string>): Erros {
  const erros: Erros = {};
  if (d.nome.trim().length < 2) erros.nome = "Informe seu nome.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) erros.email = "Informe um e-mail válido.";
  if (d.telefone.replace(/\D/g, "").length < 10) erros.telefone = "Informe um WhatsApp com DDD.";
  if (!d.equipamento) erros.equipamento = "Escolha o equipamento.";
  if (d.problema.trim().length < 10) erros.problema = "Conte um pouco mais do que está acontecendo.";
  return erros;
}

function mensagem(d: Record<Chave, string>) {
  return [
    "Olá, Total Tech! Vim pelo site da Multsystems e preciso de assistência técnica.",
    "",
    `Nome: ${d.nome.trim()}`,
    `E-mail: ${d.email.trim()}`,
    `WhatsApp: ${d.telefone.trim()}`,
    `Equipamento: ${d.equipamento}`,
    `Problema: ${d.problema.trim()}`,
  ].join("\n");
}

/**
 * "Fale com o técnico": a pessoa conta o problema e, ao enviar, a conversa com a Total Tech
 * abre no WhatsApp já com tudo escrito. O chamado também é registrado no servidor.
 * `whatsapp` é o número da Total Tech, só com dígitos.
 */
export function FormularioTecnico({ whatsapp }: { whatsapp: string }) {
  const [erros, setErros] = useState<Erros>({});
  const [enviado, setEnviado] = useState<string | null>(null);
  const id = useId();

  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const dados = Object.fromEntries(new FormData(form).entries()) as Record<Chave, string>;
    const encontrados = validar(dados);
    setErros(encontrados);
    if (Object.keys(encontrados).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(encontrados)[0]}"]`)?.focus();
      return;
    }

    const link = `https://wa.me/${whatsapp}?text=${encodeURIComponent(mensagem(dados))}`;
    // Abre o WhatsApp ainda dentro do clique (senão o navegador bloqueia a nova aba).
    window.open(link, "_blank", "noopener,noreferrer");
    // Registra o chamado; se falhar, a conversa no WhatsApp já resolve.
    fetch("/api/assistencia", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    }).catch(() => {});
    evento("enviar_assistencia", { equipamento: dados.equipamento }, true);
    setEnviado(link);
    form.reset();
  }

  if (enviado) {
    return (
      <div role="status" className="erro-campo flex flex-col items-start gap-3 rounded-card bg-white p-6 ring-1 ring-line lg:p-8">
        <CircleCheck aria-hidden className="size-10 text-[#00875a]" />
        <p className="text-h3 text-ink">Pronto! A conversa com o técnico abriu no WhatsApp.</p>
        <p className="text-body text-muted">
          É só enviar a mensagem que já está escrita. Se o WhatsApp não abriu, toque no botão abaixo.
        </p>
        <a
          href={enviado}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex min-h-12 items-center gap-2 rounded-btn bg-whatsapp px-5 font-bold text-ink transition-[background-color,transform] hover:bg-[#1fbe5a] active:scale-[0.98]"
        >
          <WhatsAppIcon className="size-5" />
          Abrir o WhatsApp
        </a>
        <button type="button" onClick={() => setEnviado(null)} className="min-h-11 font-bold text-brand hover:underline">
          Enviar outro chamado
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="grid gap-5 rounded-card bg-white p-5 ring-1 ring-line lg:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Campo id={`${id}-nome`} rotulo="Seu nome" erro={erros.nome}>
          <input id={`${id}-nome`} name="nome" autoComplete="name" className={`${classeCampo} h-12`} {...ariaCampo(`${id}-nome`, erros.nome)} />
        </Campo>
        <Campo id={`${id}-telefone`} rotulo="WhatsApp com DDD" erro={erros.telefone}>
          <input
            id={`${id}-telefone`}
            name="telefone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(11) 99999-9999"
            onInput={(e) => mascararTelefone(e.currentTarget)}
            className={`${classeCampo} h-12`}
            {...ariaCampo(`${id}-telefone`, erros.telefone)}
          />
        </Campo>
        <Campo id={`${id}-email`} rotulo="E-mail" erro={erros.email}>
          <input id={`${id}-email`} name="email" type="email" autoComplete="email" className={`${classeCampo} h-12`} {...ariaCampo(`${id}-email`, erros.email)} />
        </Campo>
        <Campo id={`${id}-equipamento`} rotulo="Equipamento" erro={erros.equipamento}>
          <div className="relative">
            <select
              id={`${id}-equipamento`}
              name="equipamento"
              defaultValue=""
              className={`${classeCampo} h-12 cursor-pointer appearance-none pr-11 invalid:text-muted`}
              {...ariaCampo(`${id}-equipamento`, erros.equipamento)}
            >
              <option value="" disabled>
                Escolha
              </option>
              {equipamentosAssistencia.map((eq) => (
                <option key={eq} value={eq}>
                  {eq}
                </option>
              ))}
            </select>
            <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-muted transition-colors group-focus-within/campo:text-brand" />
          </div>
        </Campo>
      </div>
      <Campo id={`${id}-problema`} rotulo="O que está acontecendo?" erro={erros.problema}>
        <textarea
          id={`${id}-problema`}
          name="problema"
          rows={4}
          placeholder="Ex.: o notebook liga, mas a tela fica preta. Começou depois de uma queda de energia."
          className={`${classeCampo} resize-y py-3`}
          {...ariaCampo(`${id}-problema`, erros.problema)}
        />
      </Campo>

      <button
        type="submit"
        className="inline-flex min-h-13 items-center justify-center gap-2 rounded-btn bg-whatsapp px-6 text-body font-bold text-ink transition-[background-color,transform] hover:bg-[#1fbe5a] active:scale-[0.98]"
      >
        <WhatsAppIcon className="size-5" />
        Enviar e conversar com o técnico
      </button>
      <p className="text-small text-muted">
        Ao enviar, o WhatsApp abre com o seu relato já escrito. A avaliação do técnico é paga: ele informa o valor antes de começar. Veja como tratamos seus dados na{" "}
        <Link href="/privacidade" className="font-bold text-brand hover:underline">
          Política de Privacidade
        </Link>
        .
      </p>
    </form>
  );
}
