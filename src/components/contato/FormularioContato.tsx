"use client";

import { ChevronDown, CircleCheck } from "lucide-react";
import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import { WhatsAppIcon } from "@/components/icones-marca";
import { Campo, ariaCampo, classeCampo, mascararTelefone } from "@/components/forms/campos";
import { evento } from "@/lib/eventos";

type Chave = "nome" | "telefone" | "assunto" | "mensagem";
type Erros = Partial<Record<Chave, string>>;

const assuntos = [
  { valor: "comprar", rotulo: "Comprar um produto", destino: "loja" },
  { valor: "orcamento", rotulo: "Orçamento para empresa", destino: "loja" },
  { valor: "assistencia", rotulo: "Assistência técnica", destino: "totaltech" },
  { valor: "pedido", rotulo: "Dúvida sobre um pedido", destino: "loja" },
  { valor: "outro", rotulo: "Outro assunto", destino: "loja" },
] as const;

function validar(d: Record<Chave, string>): Erros {
  const erros: Erros = {};
  if (d.nome.trim().length < 2) erros.nome = "Informe seu nome.";
  if (d.telefone.replace(/\D/g, "").length < 10) erros.telefone = "Informe um telefone com DDD.";
  if (!assuntos.some((a) => a.valor === d.assunto)) erros.assunto = "Escolha o assunto.";
  if (d.mensagem.trim().length < 5) erros.mensagem = "Escreva sua mensagem.";
  return erros;
}

/**
 * Formulário de contato: a pessoa escolhe o assunto e a conversa abre no WhatsApp já escrita.
 * "Assistência técnica" vai para o número da Total Tech; os demais, para a loja.
 */
export function FormularioContato({ whatsappLoja, whatsappTotalTech }: { whatsappLoja: string; whatsappTotalTech: string }) {
  const [erros, setErros] = useState<Erros>({});
  const [enviado, setEnviado] = useState<string | null>(null);
  const id = useId();

  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = Object.fromEntries(new FormData(form).entries()) as Record<Chave, string>;
    const encontrados = validar(d);
    setErros(encontrados);
    const primeiro = Object.keys(encontrados)[0];
    if (primeiro) {
      form.querySelector<HTMLElement>(`[name="${primeiro}"]`)?.focus();
      return;
    }

    const assunto = assuntos.find((a) => a.valor === d.assunto)!;
    const numero = assunto.destino === "totaltech" ? whatsappTotalTech : whatsappLoja;
    const texto = [
      `Olá! Vim pelo site da Multsystems. Assunto: ${assunto.rotulo}.`,
      "",
      `Nome: ${d.nome.trim()}`,
      `Telefone: ${d.telefone.trim()}`,
      "",
      d.mensagem.trim(),
    ].join("\n");
    const link = `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
    // Abre o WhatsApp ainda dentro do clique (senão o navegador bloqueia a nova aba).
    window.open(link, "_blank", "noopener,noreferrer");
    // Registra a mensagem e avisa o BotConversa; se falhar, a conversa no WhatsApp já resolve.
    fetch("/api/contato", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: d.nome, telefone: d.telefone, assunto: assunto.rotulo, mensagem: d.mensagem }),
    }).catch(() => {});
    evento("enviar_contato", { assunto: assunto.valor }, true);
    setEnviado(link);
    form.reset();
  }

  if (enviado) {
    return (
      <div role="status" className="erro-campo flex flex-col items-start gap-3 rounded-card bg-white p-6 ring-1 ring-line lg:p-8">
        <CircleCheck aria-hidden className="size-10 text-[#00875a]" />
        <p className="text-h3 text-ink">Pronto! A conversa abriu no WhatsApp.</p>
        <p className="text-body text-muted">É só enviar a mensagem que já está escrita. Se o WhatsApp não abriu, toque no botão.</p>
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
          Mandar outra mensagem
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
        <Campo id={`${id}-telefone`} rotulo="Telefone com DDD" erro={erros.telefone}>
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
      </div>
      <Campo id={`${id}-assunto`} rotulo="Assunto" erro={erros.assunto}>
        <div className="relative">
          <select id={`${id}-assunto`} name="assunto" defaultValue="" className={`${classeCampo} h-12 cursor-pointer appearance-none pr-11`} {...ariaCampo(`${id}-assunto`, erros.assunto)}>
            <option value="" disabled>
              Escolha
            </option>
            {assuntos.map((a) => (
              <option key={a.valor} value={a.valor}>
                {a.rotulo}
              </option>
            ))}
          </select>
          <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-muted transition-colors group-focus-within/campo:text-brand" />
        </div>
      </Campo>
      <Campo id={`${id}-mensagem`} rotulo="Mensagem" erro={erros.mensagem}>
        <textarea
          id={`${id}-mensagem`}
          name="mensagem"
          rows={4}
          placeholder="Conte o que você precisa."
          className={`${classeCampo} resize-y py-3`}
          {...ariaCampo(`${id}-mensagem`, erros.mensagem)}
        />
      </Campo>
      <button
        type="submit"
        className="inline-flex min-h-13 items-center justify-center gap-2 rounded-btn bg-whatsapp px-6 text-body font-bold text-ink transition-[background-color,transform] hover:bg-[#1fbe5a] active:scale-[0.98]"
      >
        <WhatsAppIcon className="size-5" />
        Enviar pelo WhatsApp
      </button>
      <p className="text-small text-muted">
        Ao enviar, o WhatsApp abre com a sua mensagem já escrita. Veja como tratamos seus dados na{" "}
        <Link href="/privacidade" className="font-bold text-brand hover:underline">
          Política de Privacidade
        </Link>
        .
      </p>
    </form>
  );
}
