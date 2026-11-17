import { z } from "zod";
import { equipamentosAssistencia } from "@/data/assistencia";
import { enviarParaBotConversa, normalizarTelefone } from "@/lib/botconversa";

const texto = (erro: string) => z.string({ error: erro }).trim();

const chamadoSchema = z.object({
  nome: texto("Informe seu nome.").min(2, "Informe seu nome.").max(120),
  email: z.email({ error: "Informe um e-mail válido." }).max(160),
  telefone: texto("Informe um WhatsApp com DDD.").regex(/^[\d\s()+-]{10,20}$/, "Informe um WhatsApp com DDD."),
  equipamento: z.enum(equipamentosAssistencia, { error: "Escolha o equipamento." }),
  problema: texto("Conte o que está acontecendo.").min(10, "Conte um pouco mais do que está acontecendo.").max(3000),
});

/** POST /api/assistencia: registra o chamado enviado pelo formulário da assistência técnica. */
export async function POST(request: Request) {
  let corpo: unknown;
  try {
    corpo = await request.json();
  } catch {
    return Response.json({ ok: false, erro: "Corpo da requisição inválido." }, { status: 400 });
  }

  const resultado = chamadoSchema.safeParse(corpo);
  if (!resultado.success) {
    return Response.json({ ok: false, erros: z.flattenError(resultado.error).fieldErrors }, { status: 422 });
  }

  // TODO: enviar por e-mail para a Total Tech. Por enquanto só registra no log e avisa o BotConversa.
  console.info("[assistencia] novo chamado", { ...resultado.data, recebidoEm: new Date().toISOString() });

  const d = resultado.data;
  enviarParaBotConversa({
    tipo: "assistencia",
    telefone: normalizarTelefone(d.telefone),
    nome: d.nome,
    email: d.email,
    resumo: `${d.equipamento}: ${d.problema}`.slice(0, 900),
    extra: { equipamento: d.equipamento },
  });
  return Response.json({ ok: true }, { status: 201 });
}
