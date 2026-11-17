// Tipos de orçamento que a Multsystems mais faz para empresas.
// Lista montada a partir das áreas de cotação do site atual (hardware, suprimentos,
// network, CFTV e serviços). TODO: confirmar com a equipe comercial se falta algum.

export type IconeOrcamento =
  | "monitor"
  | "impressora"
  | "wifi"
  | "camera"
  | "bateria"
  | "cpu"
  | "ferramenta"
  | "caixas";

export type TipoOrcamentoInfo = {
  valor: string;
  rotulo: string;
  detalhe: string;
  /** Três exemplos curtos do que costuma entrar nesse orçamento. */
  exemplos: readonly [string, string, string];
  icone: IconeOrcamento;
};

export const tiposOrcamento = [
  {
    valor: "computadores",
    rotulo: "Computadores e monitores",
    detalhe: "Renovar ou ampliar o parque de máquinas da empresa.",
    exemplos: ["Desktops e notebooks", "Monitores LED e 4K", "All-in-one e mini PCs"],
    icone: "monitor",
  },
  {
    valor: "impressao",
    rotulo: "Impressão e suprimentos",
    detalhe: "Impressoras e insumos, inclusive em compra recorrente.",
    exemplos: ["Laser e jato de tinta", "Toners e cartuchos originais", "Papel A4 e formulários"],
    icone: "impressora",
  },
  {
    valor: "redes",
    rotulo: "Redes e Wi-Fi",
    detalhe: "Rede estável para a empresa, a filial ou o galpão.",
    exemplos: ["Roteadores e Wi-Fi mesh", "Switches PoE de 24 e 48 portas", "Cabeamento Cat6 e fibra"],
    icone: "wifi",
  },
  {
    valor: "cftv",
    rotulo: "Câmeras e CFTV",
    detalhe: "Monitoramento do patrimônio, com gravação e acesso remoto.",
    exemplos: ["Câmeras IP dome e bullet", "DVR e NVR de 4 a 32 canais", "Cabos, fontes e suportes"],
    icone: "camera",
  },
  {
    valor: "energia",
    rotulo: "Nobreaks e energia",
    detalhe: "Proteção para os equipamentos que não podem parar.",
    exemplos: ["Nobreaks senoidais", "Estabilizadores e filtros de linha", "Dimensionamento e instalação"],
    icone: "bateria",
  },
  {
    valor: "pecas",
    rotulo: "Peças e upgrade",
    detalhe: "Mais desempenho nas máquinas que a empresa já tem.",
    exemplos: ["Memória DDR4 e DDR5", "SSD NVMe e HD SATA", "Processadores Intel e AMD"],
    icone: "cpu",
  },
  {
    valor: "suporte",
    rotulo: "Suporte e manutenção",
    detalhe: "Técnico à disposição, na empresa ou à distância.",
    exemplos: ["Visita técnica", "Suporte remoto", "Manutenção preventiva do parque"],
    icone: "ferramenta",
  },
  {
    valor: "outro",
    rotulo: "Outro",
    detalhe: "Conte o que precisa que a gente monta a cotação.",
    exemplos: ["Software e licenças", "Cadeiras e móveis de escritório", "Projetos sob medida"],
    icone: "caixas",
  },
] as const satisfies readonly TipoOrcamentoInfo[];

export type TipoOrcamento = (typeof tiposOrcamento)[number]["valor"];
export const valoresTipoOrcamento = tiposOrcamento.map((t) => t.valor) as [TipoOrcamento, ...TipoOrcamento[]];

/** Tipo de orçamento que combina com cada departamento da loja (o que não tem par vai em "Outro"). */
export function tipoDoDepartamento(departamento: string): TipoOrcamento {
  const mapa: Record<string, TipoOrcamento> = {
    "computadores-e-notebooks": "computadores",
    "impressoras-e-suprimentos": "impressao",
    "cameras-de-seguranca": "cftv",
    "redes-e-wifi": "redes",
    "baterias-e-nobreaks": "energia",
    "pecas-e-componentes": "pecas",
  };
  return mapa[departamento] ?? "outro";
}

/** Âncora usada pelos cards para abrir o formulário já com o tipo escolhido. */
export const ancoraTipo = (valor: TipoOrcamento) => `#cotar-${valor}`;
export const PREFIXO_ANCORA_TIPO = "#cotar-";
