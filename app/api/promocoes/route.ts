import { z } from "zod";
import { departamentos } from "@/data/departamentos";
import { enviarParaBotConversa, normalizarTelefone } from "@/lib/botconversa";

const interesses = departamentos.map((d) => d.slug) as [string, ...string[]];

const inscricaoSchema = z
  .object({
    canal: z.enum(["whatsapp", "email"]),
    contato: z.string().trim().min(5).max(160),
    interesses: z.array(z.enum(interesses)).max(12).optional().default([]),
    consentiu: z.literal(true),
    origem: z.string().trim().max(30).optional().default("site"),
  })
  .refine((d) => (d.canal === "email" ? z.email().safeParse(d.contato).success : /^[\d\s()+-]{10,20}$/.test(d.contato)), {
    message: "Contato inválido.",
    path: ["contato"],
  });

/**
 * POST /api/promocoes: inscrição para receber promoções e avisos por WhatsApp ou e-mail.
 * Só aceita com o consentimento marcado. Registra no log e avisa o BotConversa (tipo "promocoes");
 * quem se inscreve só com e-mail vai sem telefone. TODO: gravar num banco e emitir um link de descadastro.
 */
export async function POST(request: Request) {
  let corpo: unknown;
  try {
    corpo = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  const resultado = inscricaoSchema.safeParse(corpo);
  if (!resultado.success) return Response.json({ ok: false, erros: z.flattenError(resultado.error).fieldErrors }, { status: 422 });

  const d = resultado.data;
  const interessesTexto = d.interesses.map((s) => departamentos.find((x) => x.slug === s)?.nome ?? s).join(", ");
  console.info("[promocoes] nova inscrição", { canal: d.canal, contato: d.contato, interesses: d.interesses, origem: d.origem, consentiuEm: new Date().toISOString() });

  enviarParaBotConversa({
    tipo: "promocoes",
    telefone: d.canal === "whatsapp" ? normalizarTelefone(d.contato) : "",
    email: d.canal === "email" ? d.contato : "",
    resumo: interessesTexto ? `Interesse em: ${interessesTexto}` : "Sem interesse informado",
    extra: { canal: d.canal, interesses: interessesTexto, origem_inscricao: d.origem, consentimento: true },
  });

  return Response.json({ ok: true }, { status: 201 });
}
