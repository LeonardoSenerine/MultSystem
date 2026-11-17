import { z } from "zod";
import { enviarParaBotConversa, normalizarTelefone } from "@/lib/botconversa";

const contatoSchema = z.object({
  nome: z.string().trim().min(2).max(120),
  telefone: z.string().trim().regex(/^[\d\s()+-]{10,20}$/),
  assunto: z.string().trim().min(2).max(60),
  mensagem: z.string().trim().min(5).max(3000),
});

/** POST /api/contato: registra a mensagem do formulário da página de contato e avisa o BotConversa. */
export async function POST(request: Request) {
  let corpo: unknown;
  try {
    corpo = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  const resultado = contatoSchema.safeParse(corpo);
  if (!resultado.success) return Response.json({ ok: false }, { status: 422 });

  const d = resultado.data;
  console.info("[contato] nova mensagem", { ...d, recebidoEm: new Date().toISOString() });
  enviarParaBotConversa({
    tipo: "contato",
    telefone: normalizarTelefone(d.telefone),
    nome: d.nome,
    resumo: `${d.assunto}: ${d.mensagem}`.slice(0, 900),
    extra: { assunto: d.assunto },
  });
  return Response.json({ ok: true }, { status: 201 });
}
