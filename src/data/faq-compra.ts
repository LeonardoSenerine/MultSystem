// Perguntas da página "Como comprar" (pagamento, entrega, troca e garantia).
// Só usa o que o site já afirma: preço com nota fiscal, cartão em até 3x sem juros, retirada na loja de Itatiba, entrega em Itatiba e
// região, envio para todo o Brasil e confirmação de estoque e pagamento pelo vendedor. A troca e a garantia seguem o
// Código de Defesa do Consumidor.
// CONFIRMADO pelo cliente em 17/11/2026: cartão em até 3x sem juros; valor do frete e prazos são combinados com o vendedor.
// TODO: dado real. Falta a Multsystems confirmar a política de troca da loja (com apoio jurídico) e se o valor no cartão
// é o mesmo do PIX. Em 17/11/2026 o cliente pediu para NÃO destacar "valor no PIX": o site mostra o preço e "ou 3x de R$ X sem juros".

import type { Pergunta } from "@/types";

export const perguntasCompra: Pergunta[] = [
  {
    pergunta: "Posso pagar no cartão ou parcelar?",
    resposta:
      "Pode. No cartão, parcelamos em até 3 vezes sem juros: cada produto mostra o valor da parcela. O vendedor confirma o valor e as parcelas na hora de fechar o pedido, pelo WhatsApp ou na loja. Também aceitamos PIX.",
  },
  {
    pergunta: "Quanto custa e quanto demora a entrega?",
    resposta:
      "Retirar na loja, em Itatiba, não tem custo. Para receber em casa ou na empresa, o valor do frete e o prazo são combinados com o vendedor antes de você pagar. Entregamos em Itatiba e região e enviamos para todo o Brasil.",
  },
  {
    pergunta: "O produto que vi no site está mesmo em estoque?",
    resposta:
      "O estoque que aparece em cada produto vem do sistema da loja. Mesmo assim, o vendedor confirma a disponibilidade antes de fechar, para ninguém pagar por um item que acabou.",
    exemplo: true,
  },
  {
    pergunta: "Saiu nota fiscal?",
    resposta: "Sim. Toda venda sai com nota fiscal. Para empresa, a nota é emitida no CNPJ informado no pedido.",
    exemplo: true,
  },
  {
    pergunta: "E se eu me arrepender ou o produto vier com defeito?",
    resposta:
      "Compras feitas à distância, como pelo WhatsApp, têm direito de arrependimento em até 7 dias após o recebimento, conforme o Código de Defesa do Consumidor. Em caso de defeito, vale a garantia do fabricante e a garantia legal. Fale com a loja e ajudamos com o processo.",
    exemplo: true,
  },
  {
    pergunta: "Posso comprar em quantidade para a minha empresa?",
    resposta:
      "Pode. Use “Pedir orçamento” para receber preço, prazo e condição para empresa, com nota no CNPJ. Quem compra sempre as mesmas coisas pode salvar o carrinho como lista e repetir o pedido depois.",
    exemplo: true,
  },
];
