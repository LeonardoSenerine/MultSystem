import { z } from "zod";

const valor = z.union([z.string().max(200), z.number(), z.boolean()]);

const eventoSchema = z.object({
  nome: z.string().max(60),
  dados: z.record(z.string().max(40), valor.optional()).optional().default({}),
  pagina: z.string().max(300).optional(),
});

/**
 * POST /api/eventos: eventos do funil (ver produto, adicionar ao carrinho, clicar no WhatsApp, buscar sem
 * resultado...). Registra no log do servidor, uma linha por evento, para dar para contar o funil
 * mesmo sem o Google Analytics. Não guarda nada que identifique a pessoa.
 * TODO: gravar num banco para montar relatórios.
 */
export async function POST(request: Request) {
  try {
    const resultado = eventoSchema.safeParse(JSON.parse(await request.text()));
    if (resultado.success) console.info("[evento]", resultado.data.nome, resultado.data.dados, resultado.data.pagina ?? "");
  } catch {
    // Evento inválido: ignora, o rastreamento nunca pode atrapalhar o site.
  }
  return new Response(null, { status: 204 });
}
