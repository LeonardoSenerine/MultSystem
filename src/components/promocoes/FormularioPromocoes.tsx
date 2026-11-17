"use client";

import Link from "next/link";
import { Check, CircleCheck, LoaderCircle } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { Campo, ariaCampo, classeCampo, mascararTelefone } from "@/components/forms/campos";
import { evento } from "@/lib/eventos";
import { useHidratado } from "@/lib/loja-local";
import { guardarInscricao, useInscricao } from "@/lib/promocoes";

type Canal = "whatsapp" | "email";
type Erros = Partial<Record<"contato" | "consentimento" | "envio", string>>;

/**
 * Inscrição em promoções e avisos: a pessoa escolhe WhatsApp ou e-mail, digita o contato, marca (se quiser)
 * o que lhe interessa e aceita ser contatada. Sem o aceite não envia. Depois de inscrita, a seção mostra
 * "você já está na lista", com a opção de cadastrar outro contato.
 */
export function FormularioPromocoes({ origem, interesses }: { origem: string; interesses: { slug: string; nome: string }[] }) {
  const id = useId();
  const hidratado = useHidratado();
  const inscricao = useInscricao();
  const [canal, setCanal] = useState<Canal>("whatsapp");
  const [escolhidos, setEscolhidos] = useState<string[]>([]);
  const [erros, setErros] = useState<Erros>({});
  const [enviando, setEnviando] = useState(false);
  const [outro, setOutro] = useState(false);
  const [recemInscrito, setRecemInscrito] = useState(false);

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const dados = new FormData(form);
    const contato = String(dados.get("contato") ?? "").trim();
    const consentiu = dados.get("consentimento") === "on";

    const novos: Erros = {};
    if (canal === "whatsapp" && contato.replace(/\D/g, "").length < 10) novos.contato = "Informe o WhatsApp com DDD.";
    if (canal === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contato)) novos.contato = "Informe um e-mail válido.";
    if (!consentiu) novos.consentimento = "Marque a caixinha para receber as novidades.";
    setErros(novos);
    if (novos.contato) return form.querySelector<HTMLElement>("[name=contato]")?.focus();
    if (novos.consentimento) return form.querySelector<HTMLElement>("[name=consentimento]")?.focus();

    setEnviando(true);
    try {
      const r = await fetch("/api/promocoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ canal, contato, interesses: escolhidos, consentiu: true, origem }),
      });
      if (!r.ok) throw new Error(String(r.status));
      guardarInscricao({ canal, contato });
      evento("inscrever_promocoes", { canal, origem, interesses: escolhidos.length }, true);
      setRecemInscrito(true);
      setOutro(false);
      form.reset();
      setEscolhidos([]);
    } catch {
      setErros({ envio: "Não conseguimos registrar agora. Tente de novo em instantes." });
    } finally {
      setEnviando(false);
    }
  }

  // Antes da hidratação mostra o formulário (igual ao servidor); depois, se já houver inscrição, mostra o aviso.
  if (hidratado && inscricao && !outro) {
    return (
      <div role="status" className="erro-campo flex flex-col items-start gap-2 text-ink">
        <CircleCheck aria-hidden className="size-9 text-[#00875a]" />
        <p className="text-h3">{recemInscrito ? "Pronto, você está na lista!" : "Você já está na lista."}</p>
        <p className="text-body text-muted">
          Vamos avisar pelo {inscricao.canal === "whatsapp" ? "WhatsApp" : "e-mail"} <strong className="text-ink">{inscricao.contato}</strong> quando
          entrar promoção ou novidade. Dá para sair quando quiser, é só pedir.
        </p>
        <button
          type="button"
          onClick={() => {
            setOutro(true);
            setRecemInscrito(false);
          }}
          className="min-h-11 font-bold text-brand hover:underline"
        >
          Cadastrar outro contato
        </button>
      </div>
    );
  }

  const alternar = (slug: string) => setEscolhidos((l) => (l.includes(slug) ? l.filter((s) => s !== slug) : [...l, slug]));

  return (
    <form onSubmit={enviar} noValidate className="grid gap-4 text-ink">
      <fieldset>
        <legend className="mb-2 text-small font-semibold text-ink">Como você prefere receber?</legend>
        <div role="radiogroup" className="grid grid-cols-2 gap-1 rounded-btn bg-tint p-1">
          {(
            [
              ["whatsapp", "WhatsApp"],
              ["email", "E-mail"],
            ] as const
          ).map(([valor, rotulo]) => (
            <label key={valor} className="cursor-pointer">
              <input
                type="radio"
                name="canal"
                value={valor}
                checked={canal === valor}
                onChange={() => {
                  setCanal(valor);
                  setErros((e) => ({ ...e, contato: undefined }));
                }}
                className="peer sr-only"
              />
              <span className="flex min-h-11 items-center justify-center rounded-[10px] text-[14px] font-bold text-muted transition-[background-color,color,box-shadow] duration-200 select-none peer-checked:bg-white peer-checked:text-brand peer-checked:shadow-[0_1px_4px_rgb(28_47_92/0.14)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-1 peer-focus-visible:outline-brand">
                {rotulo}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <Campo id={`${id}-contato`} rotulo={canal === "whatsapp" ? "Seu WhatsApp com DDD" : "Seu e-mail"} erro={erros.contato}>
        <input
          key={canal}
          id={`${id}-contato`}
          name="contato"
          type={canal === "whatsapp" ? "tel" : "email"}
          inputMode={canal === "whatsapp" ? "tel" : "email"}
          autoComplete={canal === "whatsapp" ? "tel" : "email"}
          placeholder={canal === "whatsapp" ? "(11) 99999-9999" : "voce@empresa.com.br"}
          onInput={canal === "whatsapp" ? (e) => mascararTelefone(e.currentTarget) : undefined}
          className={`${classeCampo} h-12`}
          {...ariaCampo(`${id}-contato`, erros.contato)}
        />
      </Campo>

      <fieldset>
        <legend className="mb-2 flex w-full items-baseline justify-between text-small font-semibold text-ink">
          O que te interessa?
          <span className="text-[12px] leading-4 font-medium text-muted">opcional</span>
        </legend>
        <ul className="flex flex-wrap gap-2">
          {interesses.map((i) => {
            const marcado = escolhidos.includes(i.slug);
            return (
              <li key={i.slug}>
                <label className="cursor-pointer">
                  <input type="checkbox" checked={marcado} onChange={() => alternar(i.slug)} className="peer sr-only" />
                  <span className="inline-flex min-h-11 items-center gap-1.5 rounded-full border-[1.5px] border-[#cfd8ec] bg-white px-3.5 text-[13px] font-semibold text-ink transition-[background-color,border-color,color,transform] duration-200 select-none hover:border-brand active:scale-95 peer-checked:border-brand peer-checked:bg-brand peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand">
                    {marcado && <Check aria-hidden className="size-3.5" strokeWidth={3} />}
                    {i.nome}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>

      <div>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="consentimento"
            aria-invalid={erros.consentimento ? true : undefined}
            aria-describedby={erros.consentimento ? `${id}-consentimento-erro` : undefined}
            onChange={() => setErros((e) => ({ ...e, consentimento: undefined }))}
            className="peer sr-only"
          />
          <span
            aria-hidden
            className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-[7px] border-[1.5px] border-[#b9c3dc] bg-white text-white transition-[background-color,border-color] duration-200 peer-checked:border-brand peer-checked:bg-brand peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand peer-aria-[invalid=true]:border-red-600 [&>svg]:scale-0 [&>svg]:transition-transform peer-checked:[&>svg]:scale-100"
          >
            <Check className="size-4" strokeWidth={3} />
          </span>
          <span className="text-[13px] leading-[18px] text-muted">
            Quero receber promoções e avisos da Multsystems por esse contato. Posso sair quando quiser. Veja a{" "}
            <Link href="/privacidade" className="font-bold text-brand hover:underline">
              Política de Privacidade
            </Link>
            .
          </span>
        </label>
        {erros.consentimento && (
          <p id={`${id}-consentimento-erro`} role="alert" className="erro-campo mt-1.5 text-small text-red-700">
            {erros.consentimento}
          </p>
        )}
      </div>

      {erros.envio && (
        <p role="alert" className="erro-campo rounded-btn bg-red-50 px-4 py-3 text-small text-red-700">
          {erros.envio}
        </p>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="inline-flex min-h-13 items-center justify-center gap-2 rounded-btn bg-brand px-6 text-body font-bold text-white transition-[background-color,transform] hover:bg-[#263b73] active:scale-[0.98] disabled:opacity-70"
      >
        {enviando && <LoaderCircle aria-hidden className="size-5 animate-spin" />}
        {enviando ? "Enviando..." : "Quero receber as novidades"}
      </button>
    </form>
  );
}
