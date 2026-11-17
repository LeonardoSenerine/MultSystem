// TODO: dado real. Respostas escritas a partir do site atual e do briefing.
// Confirmar cada uma com a Multsystems antes de publicar (principalmente entrega e pagamento).

import type { Pergunta } from "@/types";

export const perguntas: Pergunta[] = [
  {
    pergunta: "Vocês emitem nota fiscal para empresa?",
    resposta:
      "Sim. Toda compra sai com nota fiscal, no CNPJ ou no CPF. Para empresa, é só mandar os dados junto com o pedido de orçamento que a nota já sai certa.",
    exemplo: true,
  },
  {
    pergunta: "Como funciona a compra pelo WhatsApp?",
    resposta:
      "Escolha o produto no site e toque em Comprar. A conversa já abre com o nome e o código do item. Por lá a gente confirma estoque, valor e forma de pagamento.",
    exemplo: true,
  },
  {
    pergunta: "Vocês entregam fora de Itatiba?",
    resposta:
      "Sim, enviamos para todo o Brasil. Se preferir, você também pode retirar o pedido direto na loja.",
    exemplo: true,
  },
  {
    pergunta: "A assistência técnica é da própria loja?",
    resposta:
      "O conserto é feito pela Total Tech, uma empresa parceira que trabalha dentro da nossa loja. Você deixa o equipamento no mesmo endereço e fala direto com o técnico.",
    exemplo: true,
  },
  {
    pergunta: "Atendem empresas de outras cidades?",
    resposta:
      "Atendemos. A cotação é feita pelo site ou pelo WhatsApp, e a gente envia com nota fiscal para onde a sua empresa estiver.",
    exemplo: true,
  },
];
