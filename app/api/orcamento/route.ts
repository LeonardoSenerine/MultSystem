import { z } from "zod";
import { tiposOrcamento, valoresTipoOrcamento } from "@/data/orcamento";
import { enviarParaBotConversa, normalizarTelefone, prioridadeDoPedido } from "@/lib/botconversa";

const telefoneValido = /^[\d\s()+-]{10,20}$/;

const texto = (erro: string) => z.string({ error: erro }).trim();

const orcamentoSchema = z.object({
  nome: texto("Informe seu nome.").min(2, "Informe seu nome.").max(120),
  empresa: texto("Informe o nome da empresa.").min(2, "Informe o nome da empresa.").max(160),
  tipo: z.enum(valoresTipoOrcamento, { error: "Escolha o tipo de orçamento." }),
  telefone: texto("Informe um telefone com DDD.").regex(telefoneValido, "Informe um telefone com DDD."),
  email: z.email({ error: "Informe um e-mail válido." }).max(160),
  mensagem: texto("Conte um pouco do que você precisa.")
    .min(10, "Conte um pouco do que você precisa.")
    .max(3000),
});

export type Orcamento = z.infer<typeof orcamentoSchema>;

export async function POST(request: Request) {
  let corpo: unknown;
  try {
    corpo = await request.json();
  } catch {
    return Response.json({ ok: false, erro: "Corpo da requisição inválido." }, { status: 400 });
  }

  const resultado = orcamentoSchema.safeParse(corpo);
  if (!resultado.success) {
    const erros = z.flattenError(resultado.error).fieldErrors;
    return Response.json({ ok: false, erros }, { status: 422 });
  }

  // TODO: enviar por e-mail para vendas@multsystems.com.br. Por enquanto só registra no log
  // e avisa o BotConversa, que chama o vendedor (e lembra se o pedido ficar sem resposta).
  console.info("[orcamento] novo pedido", {
    ...resultado.data,
    recebidoEm: new Date().toISOString(),
  });

  const d = resultado.data;
  const rotuloTipo = tiposOrcamento.find((t) => t.valor === d.tipo)?.rotulo ?? d.tipo;
  enviarParaBotConversa({
    tipo: "orcamento",
    telefone: normalizarTelefone(d.telefone),
    nome: d.nome,
    email: d.email,
    prioridade: prioridadeDoPedido(d.mensagem),
    resumo: `${rotuloTipo}: ${d.mensagem}`.slice(0, 900),
    extra: { empresa: d.empresa, tipo_orcamento: rotuloTipo },
  });

  return Response.json({ ok: true }, { status: 201 });
}
