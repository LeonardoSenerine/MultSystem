// Perguntas frequentes do atendimento para empresas.
// As respostas usam só o que o site já afirma: nota fiscal no CNPJ, cotação com preço/prazo/condição,
// entrega em Itatiba e região e envio para o Brasil, compra recorrente de suprimentos, vendedor que
// acompanha o pedido, assistência pela Total Tech. TODO: dado real — confirmar cada resposta com o
// comercial da Multsystems (prazos, formas de pagamento e faturamento).

import type { Pergunta } from "@/types";

export const perguntasEmpresas: Pergunta[] = [
  {
    pergunta: "Em quanto tempo recebo a cotação?",
    resposta:
      "A resposta sai em horário comercial, por WhatsApp, e-mail ou telefone, com preço, prazo e condição. Quanto mais detalhe você mandar (modelo, quantidade, prazo), mais rápido o vendedor fecha o valor.",
    exemplo: true,
  },
  {
    pergunta: "A nota fiscal sai no CNPJ da empresa?",
    resposta: "Sim. Toda venda sai com nota fiscal, e para empresa a nota é emitida no CNPJ informado no pedido.",
    exemplo: true,
  },
  {
    pergunta: "Vocês entregam fora de Itatiba?",
    resposta:
      "Entregamos em Itatiba e região e também enviamos para todo o Brasil. O vendedor informa o prazo e o frete na cotação. Se preferir, é possível retirar na loja.",
    exemplo: true,
  },
  {
    pergunta: "Existe condição para compra recorrente?",
    resposta:
      "Sim. Para quem compra com frequência (toner, cartucho, papel, peças de reposição) o vendedor monta uma condição especial e já deixa os itens separados. Conte o que a empresa consome no formulário.",
    exemplo: true,
  },
  {
    pergunta: "Posso pedir a cotação de vários produtos de uma vez?",
    resposta:
      "Pode. Monte o carrinho no site e use “Pedir orçamento com estes itens”, ou descreva tudo no formulário. Combinações de computadores, rede e câmeras entram na mesma cotação.",
    exemplo: true,
  },
  {
    pergunta: "A Multsystems cuida da manutenção depois da compra?",
    resposta:
      "A manutenção é feita pela Total Tech, assistência parceira que funciona dentro da loja. Ela atende na bancada, por suporte remoto e com visita técnica, e o serviço sai com 90 dias de garantia.",
    exemplo: true,
  },
];
