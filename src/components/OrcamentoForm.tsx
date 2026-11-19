"use client";

import { CircleCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { WhatsAppIcon } from "@/components/icones-marca";
import { Campo, ariaCampo, classeCampo, mascararTelefone } from "@/components/forms/campos";
import { Seletor } from "@/components/forms/Seletor";
import { itensDoCarrinho, textoDoCarrinho } from "@/lib/carrinho";
import { evento } from "@/lib/eventos";
import { listaPorId } from "@/lib/listas";
import { PREFIXO_ANCORA_TIPO, tiposOrcamento, valoresTipoOrcamento, type TipoOrcamento } from "@/data/orcamento";

const ehTipo = (v: string): v is TipoOrcamento => (valoresTipoOrcamento as readonly string[]).includes(v);

type Campos = "nome" | "empresa" | "tipo" | "telefone" | "email" | "mensagem";
type Erros = Partial<Record<Campos, string>>;

function validar(d: Record<Campos, string>): Erros {
  const erros: Erros = {};
  if (d.nome.trim().length < 2) erros.nome = "Informe seu nome.";
  if (d.empresa.trim().length < 2) erros.empresa = "Informe o nome da empresa.";
  if (d.telefone.replace(/\D/g, "").length < 10) erros.telefone = "Informe um telefone com DDD.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) erros.email = "Informe um e-mail válido.";
  if (!ehTipo(d.tipo)) erros.tipo = "Escolha o tipo de orçamento.";
  if (d.mensagem.trim().length < 10) erros.mensagem = "Conte um pouco do que você precisa.";
  return erros;
}

function montarMensagem(d: Record<Campos, string>) {
  const tipo = tiposOrcamento.find((t) => t.valor === d.tipo)?.rotulo ?? d.tipo;
  return [
    "Olá, Multsystems! Vim pelo site e quero pedir um orçamento.",
    "",
    `Nome: ${d.nome.trim()}`,
    `Empresa: ${d.empresa.trim()}`,
    `Telefone: ${d.telefone.trim()}`,
    `E-mail: ${d.email.trim()}`,
    `Tipo de orçamento: ${tipo}`,
    "",
    "O que preciso:",
    d.mensagem.trim(),
  ].join("\n");
}

/**
 * Formulário do orçamento. Ao enviar, valida, abre o WhatsApp da Multsystems com o pedido
 * já escrito e também registra o pedido no servidor (POST /api/orcamento).
 * `whatsapp` é o número da loja, só com dígitos.
 */
export function OrcamentoForm({
  whatsapp,
  tipoFixo,
  aoFechar,
}: {
  whatsapp: string;
  /** Modo modal: o tipo já vem escolhido (some a escolha), sem moldura e sem ler a URL. */
  tipoFixo?: TipoOrcamento;
  /** Modo modal: botão "Fechar" na tela de pronto. */
  aoFechar?: () => void;
}) {
  const [erros, setErros] = useState<Erros>({});
  const [tipo, setTipo] = useState<TipoOrcamento | "">(tipoFixo ?? "");
  const exemplos = tiposOrcamento.find((t) => t.valor === tipoFixo)?.exemplos;
  const [enviado, setEnviado] = useState<string | null>(null);
  const [encomenda, setEncomenda] = useState("");
  const mensagemRef = useRef<HTMLTextAreaElement>(null);
  const [tamanho, setTamanho] = useState(0);
  const id = useId();

  // Os cards de "Tipos de orçamento" apontam para #cotar-<tipo>: aqui o formulário
  // escolhe o tipo e rola até ele.
  useEffect(() => {
    if (tipoFixo) return;
    const aplicarHash = () => {
      const hash = window.location.hash;
      if (!hash.startsWith(PREFIXO_ANCORA_TIPO)) return;
      const valor = hash.slice(PREFIXO_ANCORA_TIPO.length);
      if (!ehTipo(valor)) return;
      setTipo(valor);
      setErros((e) => ({ ...e, tipo: undefined }));
      setEnviado(null);
      document.getElementById("orcamento")?.scrollIntoView({ block: "start" });
    };
    aplicarHash();
    window.addEventListener("hashchange", aplicarHash);
    return () => window.removeEventListener("hashchange", aplicarHash);
  }, [tipoFixo]);

  // Veio do catálogo ("Pedir por encomenda") ou do carrinho: já escreve o pedido.
  useEffect(() => {
    if (tipoFixo) return;
    const busca = new URLSearchParams(window.location.search);
    const escrever = (texto: string) => {
      if (mensagemRef.current && !mensagemRef.current.value) {
        mensagemRef.current.value = texto;
        setTamanho(texto.length);
      }
    };
    if (busca.get("carrinho") === "1") {
      const itens = itensDoCarrinho();
      if (itens.length) escrever(`Quero um orçamento destes itens:\n${textoDoCarrinho(itens)}`);
      return;
    }
    // Veio de uma lista de compra recorrente ("Pedir orçamento" na lista): a lista inteira entra no pedido.
    const idLista = busca.get("lista");
    if (idLista) {
      const lista = listaPorId(idLista);
      if (lista) escrever(`Quero um orçamento da lista "${lista.nome}" (compra recorrente):\n${textoDoCarrinho(lista.itens)}\n\nPrazo e condição: `);
      return;
    }
    // Veio da página de um produto ("Pedir orçamento deste produto"): escreve o item e já escolhe o tipo.
    const produto = busca.get("produto")?.trim().slice(0, 160);
    if (produto) {
      const quantidade = Number(busca.get("qtd"));
      const tipoUrl = busca.get("tipo") ?? "";
      // A busca da URL só existe no navegador, depois da hidratação: por isso é lida aqui.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (ehTipo(tipoUrl)) setTipo(tipoUrl);
      escrever(
        `Quero um orçamento deste produto:\n• ${Number.isFinite(quantidade) && quantidade > 1 ? `${quantidade}x ` : ""}${produto}\n\nQuantidade e prazo: `,
      );
      return;
    }
    const termo = busca.get("encomenda")?.trim().slice(0, 120);
    if (!termo) return;
    setEncomenda(termo);
    setTipo("outro");
    escrever(`Procurei no site e não encontrei: ${termo}. Gostaria de um orçamento por encomenda.`);
  }, [tipoFixo]);

  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const dados = Object.fromEntries(new FormData(form).entries()) as Record<Campos, string>;
    dados.tipo = tipo;
    const encontrados = validar(dados);
    setErros(encontrados);
    const primeiro = Object.keys(encontrados)[0];
    if (primeiro) {
      (form.querySelector<HTMLElement>(`[name="${primeiro}"]`) ?? form.querySelector<HTMLElement>(`[name="tipo"]`))?.focus();
      return;
    }

    const link = `https://wa.me/${whatsapp}?text=${encodeURIComponent(montarMensagem(dados))}`;
    // Abre o WhatsApp ainda dentro do clique (senão o navegador bloqueia a nova aba).
    window.open(link, "_blank", "noopener,noreferrer");
    // Registra o pedido; se falhar, a conversa no WhatsApp já resolve.
    fetch("/api/orcamento", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    }).catch(() => {});
    evento("enviar_orcamento", { tipo, origem: tipoFixo ? "modal" : "pagina" }, true);
    setEnviado(link);
    form.reset();
    setTipo(tipoFixo ?? "");
    setTamanho(0);
  }

  // Dentro do modal a moldura é do próprio modal.
  const moldura = tipoFixo ? "" : "rounded-card bg-white p-5 lg:p-8";

  if (enviado) {
    return (
      <div role="status" className={`erro-campo flex flex-col items-start gap-3 text-ink ${tipoFixo ? "" : "rounded-card bg-white p-6 lg:p-8"}`}>
        <CircleCheck aria-hidden className="size-10 text-[#00875a]" />
        <p className="text-h3 text-ink">Pronto! O pedido abriu no WhatsApp.</p>
        <p className="text-body text-muted">
          É só enviar a mensagem que já está escrita e um vendedor responde em horário comercial. Se o WhatsApp não abriu, toque no botão.
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
        <button type="button" onClick={aoFechar ?? (() => setEnviado(null))} className="min-h-11 font-bold text-brand hover:underline">
          {aoFechar ? "Fechar" : "Fazer outro pedido"}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} noValidate className={`grid gap-5 text-ink ${moldura}`}>
      {encomenda && (
        <p className="erro-campo rounded-btn bg-tint px-4 py-3 text-small [overflow-wrap:anywhere] text-ink">
          Pedido por encomenda de <strong>&ldquo;{encomenda}&rdquo;</strong>. Complete seus dados e a gente procura o
          produto para você.
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Campo id={`${id}-nome`} rotulo="Seu nome" erro={erros.nome}>
          <input id={`${id}-nome`} name="nome" autoComplete="name" className={`${classeCampo} h-12`} {...ariaCampo(`${id}-nome`, erros.nome)} />
        </Campo>
        <Campo id={`${id}-empresa`} rotulo="Empresa" erro={erros.empresa}>
          <input id={`${id}-empresa`} name="empresa" autoComplete="organization" className={`${classeCampo} h-12`} {...ariaCampo(`${id}-empresa`, erros.empresa)} />
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
        <Campo id={`${id}-email`} rotulo="E-mail" erro={erros.email}>
          <input id={`${id}-email`} name="email" type="email" autoComplete="email" className={`${classeCampo} h-12`} {...ariaCampo(`${id}-email`, erros.email)} />
        </Campo>
      </div>

      {/* Tipo de orçamento: um botão que abre a lista e mostra só o tipo escolhido (no lugar de uma fileira de botões). */}
      {!tipoFixo && (
        <div>
          <Seletor
            rotulo="Tipo de orçamento"
            nome="tipo"
            vazio="Escolha o tipo de orçamento"
            opcoes={tiposOrcamento.map((t) => ({ valor: t.valor, rotulo: t.rotulo }))}
            valor={tipo ? [tipo] : []}
            aoMudar={([v]) => {
              if (v && ehTipo(v)) setTipo(v);
              setErros((e) => ({ ...e, tipo: undefined }));
            }}
            erro={erros.tipo}
            idErro={`${id}-tipo-erro`}
          />
          {erros.tipo && (
            <p id={`${id}-tipo-erro`} role="alert" className="erro-campo mt-1.5 text-small text-red-700">
              {erros.tipo}
            </p>
          )}
        </div>
      )}

      <Campo id={`${id}-mensagem`} rotulo="O que você precisa?" erro={erros.mensagem}>
        <textarea
          ref={mensagemRef}
          id={`${id}-mensagem`}
          name="mensagem"
          rows={4}
          maxLength={3000}
          onInput={(e) => setTamanho(e.currentTarget.value.length)}
          placeholder={exemplos ? `Ex.: ${exemplos[0]} e ${exemplos[1].toLowerCase()}. Conte modelos e quantidades.` : "Ex.: 5 notebooks para o escritório e 2 impressoras com toner."}
          className={`${classeCampo} resize-y py-3`}
          {...ariaCampo(`${id}-mensagem`, erros.mensagem)}
        />
        <p aria-hidden className="mt-1 text-right text-[12px] leading-4 text-muted tabular-nums">
          {tamanho > 0 ? `${tamanho}/3000` : "Quanto mais detalhe, mais rápido o preço"}
        </p>
      </Campo>

      <button
        type="submit"
        className="inline-flex min-h-13 items-center justify-center gap-2 rounded-btn bg-whatsapp px-6 text-body font-bold text-ink transition-[background-color,transform] hover:bg-[#1fbe5a] active:scale-[0.98]"
      >
        <WhatsAppIcon className="size-5" />
        Enviar pedido pelo WhatsApp
      </button>
      <p className="text-small text-muted">
        Ao enviar, o WhatsApp abre com o pedido já escrito e um vendedor responde em horário comercial. Veja como tratamos seus dados na{" "}
        <Link href="/privacidade" className="font-bold text-brand hover:underline">
          Política de Privacidade
        </Link>
        .
      </p>
    </form>
  );
}
