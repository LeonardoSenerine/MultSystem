import { after } from "next/server";

/*
 * Envio dos contatos do site para o BotConversa (webhook do plano Pro).
 * O site manda um JSON simples para a URL de BOTCONVERSA_WEBHOOK_URL; no BotConversa, o fluxo
 * ligado a esse webhook cria/atualiza o contato e decide o que fazer (avisar o vendedor, lembrar
 * o cliente depois de algumas horas, etc.). Sem a variável, o evento só vai para o log.
 *
 * Campos enviados (veja o README para mapeá-los no BotConversa):
 *   phone/telefone (+55...), nome, email, tipo, prioridade, resumo, total, link, origem, enviado_em
 */

export type TipoEvento =
  | "orcamento"
  | "assistencia"
  | "contato"
  | "carrinho"
  | "carrinho_finalizado"
  | "favoritos"
  | "promocoes";

export type EventoLead = {
  tipo: TipoEvento;
  /** Vazio quando a pessoa se inscreveu só com e-mail (o BotConversa precisa de telefone para criar o contato). */
  telefone: string;
  nome?: string;
  email?: string;
  prioridade?: "normal" | "alta";
  /** Texto curto do pedido (o que a pessoa quer), já pronto para o vendedor ler. */
  resumo?: string;
  total?: number;
  /** Página do site relacionada (ex.: o carrinho). */
  link?: string;
  extra?: Record<string, string | number | boolean>;
};

export { urlDoSite } from "@/lib/site";

/** "(19) 99999-8888" → "+5519999998888". Já com 55 na frente, só ganha o "+". */
export function normalizarTelefone(bruto: string) {
  const d = bruto.replace(/\D/g, "");
  if (d.startsWith("55") && (d.length === 12 || d.length === 13)) return `+${d}`;
  return `+55${d}`;
}

async function postar(evento: EventoLead) {
  const payload = {
    phone: evento.telefone,
    telefone: evento.telefone,
    nome: evento.nome ?? "",
    email: evento.email ?? "",
    tipo: evento.tipo,
    prioridade: evento.prioridade ?? "normal",
    resumo: evento.resumo ?? "",
    total: evento.total ?? 0,
    link: evento.link ?? "",
    origem: "site-multsystems",
    enviado_em: new Date().toISOString(),
    ...evento.extra,
  };

  const url = process.env.BOTCONVERSA_WEBHOOK_URL;
  if (!url) {
    console.info("[botconversa] webhook não configurado; evento só no log", payload);
    return;
  }

  try {
    const controle = new AbortController();
    const limite = setTimeout(() => controle.abort(), 6000);
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controle.signal,
    });
    clearTimeout(limite);
    if (!r.ok) console.error("[botconversa] resposta inesperada", r.status, evento.tipo);
  } catch (erro) {
    console.error("[botconversa] falha ao enviar", evento.tipo, erro);
  }
}

/** Envia depois de responder ao cliente, para o formulário não esperar o BotConversa. Só em Route Handlers. */
export function enviarParaBotConversa(evento: EventoLead) {
  after(() => postar(evento));
}

// ---------- Regras de apoio ----------

const ultimosEnvios = new Map<string, { conteudo: string; em: number }>();

/**
 * Evita mandar o mesmo carrinho várias vezes: só envia se o conteúdo mudou E já passou o
 * intervalo (em minutos) desde o último envio daquela chave. É na memória do servidor, então
 * é um limitador "de melhor esforço" (o BotConversa deve tratar repetições mesmo assim).
 */
export function deveEnviar(chave: string, conteudo: string, intervaloMin: number) {
  const anterior = ultimosEnvios.get(chave);
  const agora = Date.now();
  if (anterior && (anterior.conteudo === conteudo || agora - anterior.em < intervaloMin * 60_000)) return false;
  ultimosEnvios.set(chave, { conteudo, em: agora });
  return true;
}

export function esquecerEnvio(chave: string) {
  ultimosEnvios.delete(chave);
}

/**
 * Pedido grande vai para a frente da fila do vendedor: 5 unidades ou mais no total
 * ("3x Notebook", "10 câmeras") ou um carrinho acima de R$ 5.000.
 */
export function prioridadeDoPedido(texto: string, total = 0): "normal" | "alta" {
  if (total >= 5000) return "alta";
  const quantidades = [...texto.matchAll(/\b(\d{1,3})\s*(?:x|un\b|unid\w*|pe[çc]as|notebooks?|computadores?|desktops?|monitores?|impressoras?|c[âa]meras?|nobreaks?|licen[çc]as?|pontos?)/gi)].map((m) =>
    Number(m[1]),
  );
  return quantidades.reduce((soma, n) => soma + n, 0) >= 5 ? "alta" : "normal";
}
