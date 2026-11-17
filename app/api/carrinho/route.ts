import { z } from "zod";
import { deveEnviar, enviarParaBotConversa, esquecerEnvio, normalizarTelefone, urlDoSite } from "@/lib/botconversa";

const item = z.object({
  codigo: z.string().max(20),
  nome: z.string().max(200),
  quantidade: z.number().int().min(1).max(999),
  preco: z.number().min(0),
});

const favorito = z.object({
  codigo: z.string().max(20),
  nome: z.string().max(200),
  preco: z.number().min(0),
  precoSalvo: z.number().min(0),
});

const carrinhoSchema = z.object({
  cadastro: z.object({
    nome: z.string().trim().max(120).optional().default(""),
    whatsapp: z.string().trim().regex(/^[\d\s()+-]{10,20}$/),
    email: z.email().max(160),
    consentiuEm: z.string().max(40),
  }),
  itens: z.array(item).max(200),
  favoritos: z.array(favorito).max(100).optional(),
  total: z.number().min(0),
  pagina: z.string().max(300).optional(),
  /** "finalizado": o cliente seguiu para o WhatsApp ou pediu orçamento; o BotConversa cancela o lembrete. */
  evento: z.enum(["finalizado"]).optional(),
  via: z.string().max(30).optional(),
});

const resumoDe = (itens: { quantidade: number; nome: string }[]) => itens.map((i) => `${i.quantidade}x ${i.nome}`).join("; ").slice(0, 900);

/**
 * POST /api/carrinho: recebe o carrinho (e os favoritos) de quem deixou o contato, a cada mudança.
 * Repassa ao BotConversa, que lembra o cliente se o carrinho ficar parado:
 *  - "carrinho": itens atuais (no máximo um envio a cada 20 min por pessoa, e só se mudou);
 *  - "favoritos": lista guardada (no máximo um envio por hora);
 *  - "carrinho_finalizado": a pessoa fechou o pedido, o lembrete deve ser cancelado.
 * TODO: gravar também num banco, para o vendedor ver os carrinhos fora do BotConversa.
 */
export async function POST(request: Request) {
  let corpo: unknown;
  try {
    corpo = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  const resultado = carrinhoSchema.safeParse(corpo);
  if (!resultado.success) return Response.json({ ok: false }, { status: 422 });

  const { cadastro, itens, favoritos, total, evento, via } = resultado.data;
  const telefone = normalizarTelefone(cadastro.whatsapp);
  const base = { telefone, nome: cadastro.nome, email: cadastro.email };
  const unidades = itens.reduce((s, i) => s + i.quantidade, 0);

  console.info("[carrinho]", evento ?? "atualizado", { telefone, itens: itens.length, total });

  if (evento === "finalizado") {
    esquecerEnvio(`c:${telefone}`);
    enviarParaBotConversa({
      ...base,
      tipo: "carrinho_finalizado",
      resumo: resumoDe(itens),
      total,
      link: urlDoSite("/carrinho"),
      extra: { via: via ?? "" },
    });
    return Response.json({ ok: true });
  }

  if (itens.length > 0 && deveEnviar(`c:${telefone}`, JSON.stringify(itens), 20)) {
    enviarParaBotConversa({
      ...base,
      tipo: "carrinho",
      prioridade: unidades >= 5 || total >= 5000 ? "alta" : "normal",
      resumo: resumoDe(itens),
      total,
      link: urlDoSite("/carrinho"),
      extra: { unidades, itens: itens.length },
    });
  }

  if (favoritos && favoritos.length > 0 && deveEnviar(`f:${telefone}`, JSON.stringify(favoritos), 60)) {
    enviarParaBotConversa({
      ...base,
      tipo: "favoritos",
      resumo: favoritos.map((f) => `${f.nome} (R$ ${f.precoSalvo.toFixed(2)} ao salvar)`).join("; ").slice(0, 900),
      link: urlDoSite("/favoritos"),
      extra: { quantidade: favoritos.length },
    });
  }

  return Response.json({ ok: true });
}
