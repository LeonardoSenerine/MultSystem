// Perguntas frequentes da assistência técnica (Total Tech).
// As respostas usam só o que o site atual já informa: avaliação em 24h, 90 dias de garantia,
// conserto de notebook e desktop, instalação de nobreak, suporte remoto e visita técnica.
// A AVALIAÇÃO DO TÉCNICO É PAGA (informado pelo cliente em 17/11/2026).
// TODO: dado real — confirmar com a Total Tech o valor da avaliação e se ele é abatido do conserto.

import type { Pergunta } from "@/types";

export const perguntasAssistencia: Pergunta[] = [
  {
    pergunta: "Quem faz o conserto, a Multsystems ou a Total Tech?",
    resposta:
      "A Total Tech. Ela é uma empresa parceira, separada da Multsystems, que atende dentro da nossa loja. A avaliação, o orçamento, o conserto e a garantia são feitos pela Total Tech. A Multsystems vende os produtos e não faz serviço técnico.",
  },
  {
    pergunta: "A avaliação do técnico é paga?",
    resposta:
      "Sim, a avaliação técnica do equipamento é paga. O técnico informa o valor antes de começar. Depois dela, ele explica o que o equipamento tem e quanto fica o conserto, e o serviço só começa se você aprovar.",
    exemplo: true,
  },
  {
    pergunta: "Em quanto tempo sai a avaliação?",
    resposta:
      "Em até 24 horas o técnico faz a avaliação do equipamento e manda o orçamento do conserto. O prazo do conserto depende do serviço e da peça e é combinado com o técnico junto com o orçamento.",
    exemplo: true,
  },
  {
    pergunta: "O conserto tem garantia?",
    resposta: "Sim. Todo serviço feito pela Total Tech sai com 90 dias de garantia.",
    exemplo: true,
  },
  {
    pergunta: "Quais equipamentos a Total Tech atende?",
    resposta:
      "Notebooks e computadores de mesa: troca de tela e teclado, upgrade de memória e SSD, limpeza, formatação, reparo de placa e montagem. A Total Tech também faz a instalação de nobreaks.",
    exemplo: true,
  },
  {
    pergunta: "A Total Tech atende na empresa ou em casa?",
    resposta:
      "Sim. Além do atendimento na loja, a Total Tech faz suporte remoto e visita técnica. Conte o caso no formulário ou no WhatsApp para combinar.",
    exemplo: true,
  },
  {
    pergunta: "Preciso marcar horário para levar o equipamento?",
    resposta:
      "Você pode trazer o equipamento à loja no horário de atendimento. Se preferir, mande antes pelo formulário o que está acontecendo: o técnico já chega sabendo do caso.",
    exemplo: true,
  },
];
