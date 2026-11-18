// Departamentos do site. Cada um junta categorias do sistema da loja (nomes exatamente como
// vêm da API) com um nome legível. Categoria nova que aparecer na API e não estiver aqui
// cai em "Outros" (ver src/lib/catalogo.ts).
//
// As fotos dos cards da home são de banco de imagens (Unsplash), escolhidas a pedido do
// cliente enquanto não há fotos da própria loja. Origem em public/img/FONTES.md.
// TODO: dado real.

import { slugificar } from "@/lib/formato";
import type { Departamento, Subcategoria } from "@/types";

function sub(sistema: string, nome: string): Subcategoria {
  return { sistema, nome, slug: slugificar(nome) };
}

export const departamentos: Departamento[] = [
  {
    slug: "computadores-e-notebooks",
    nome: "Computadores e notebooks",
    descricao: "Notebooks, desktops, monitores e tablets",
    imagem: "/img/categorias/notebook.jpg",
    subcategorias: [
      sub("NOTEBOOK", "Notebooks"),
      sub("COMPUTADORES", "Computadores"),
      sub("MONITOR", "Monitores"),
      sub("TABLET", "Tablets"),
      sub("SERVIDOR", "Servidores"),
      sub("PROJETOR", "Projetores"),
    ],
  },
  {
    slug: "impressoras-e-suprimentos",
    nome: "Impressoras e suprimentos",
    descricao: "Jato de tinta, laser, toner e cartuchos",
    imagem: "/img/categorias/impressora.jpg",
    subcategorias: [
      sub("IMPRESSORA", "Impressoras"),
      sub("CARTUCHOS", "Cartuchos e toners"),
      sub("PEÇAS PARA IMPRESSORA", "Peças para impressora"),
      sub("SCANNER", "Scanners"),
      sub("PAPELARIA EM GERAL", "Papelaria"),
    ],
  },
  {
    slug: "cameras-de-seguranca",
    nome: "Câmeras de segurança",
    descricao: "Câmeras, DVRs, alarmes e kits prontos",
    imagem: "/img/categorias/camera.jpg",
    subcategorias: [
      sub("CFTV E ALARMES", "Câmeras e alarmes"),
      sub("MONITORAMENTO", "Monitoramento"),
      sub("DVR", "DVRs"),
    ],
  },
  {
    slug: "redes-e-wifi",
    nome: "Redes e Wi-Fi",
    descricao: "Roteadores, switches, rack e telefonia",
    imagem: "/img/categorias/wifi.jpg",
    subcategorias: [
      sub("NETWORK", "Roteadores e rede"),
      sub("SWITCH", "Switches"),
      sub("ACCESS POINT", "Access points"),
      sub("MODEM", "Modems"),
      sub("PLACA DE REDE", "Placas de rede"),
      sub("RACK", "Racks"),
      sub("INFRA-ESTRUTURA PROJETOS", "Infraestrutura"),
      sub("TELEFONE", "Telefonia"),
      sub("ALICATE", "Ferramentas"),
    ],
  },
  {
    slug: "perifericos",
    nome: "Periféricos",
    descricao: "Teclado, mouse, fone, webcam e caixa de som",
    imagem: "/img/categorias/teclado.jpg",
    subcategorias: [
      sub("MOUSE", "Mouses"),
      sub("TECLADOS", "Teclados"),
      sub("KIT TECLADO + MOUSE", "Kits teclado e mouse"),
      sub("MOUSE PAD", "Mouse pads"),
      sub("FONE DE OUVIDO", "Fones de ouvido"),
      sub("CAIXA DE SOM", "Caixas de som"),
      sub("WEB CAM", "Webcams"),
      sub("PEN DRIVE / CARTÃO MEMÓRIA", "Pen drives e cartões"),
      sub("LEITOR", "Leitores"),
    ],
  },
  {
    slug: "baterias-e-nobreaks",
    nome: "Baterias e nobreaks",
    descricao: "Nobreaks, estabilizadores, pilhas e filtros de linha",
    imagem: "/img/categorias/nobreak.jpg",
    subcategorias: [
      sub("NOBREAK", "Nobreaks"),
      sub("ESTABILIZADOR", "Estabilizadores"),
      sub("FILTRO DE LINHA", "Filtros de linha"),
      sub("PILHAS E BATERIAS", "Pilhas e baterias"),
      sub("SUPRIMENTO P/ NOBREAK", "Baterias para nobreak"),
      sub("CARREGADOR PORTATIL", "Carregadores portáteis"),
      sub("FOTOVOLTAICO", "Energia solar"),
    ],
  },
  {
    slug: "cadeiras",
    nome: "Cadeiras",
    descricao: "Cadeiras de escritório e para gamer",
    imagem: "/img/categorias/cadeira.jpg",
    subcategorias: [sub("MOVEIS", "Cadeiras de escritório"), sub("GAMES", "Cadeiras gamer")],
  },
  {
    slug: "pecas-e-componentes",
    nome: "Peças e componentes",
    descricao: "SSD, memória, fonte, gabinete e placas",
    subcategorias: [
      sub("HD/SSD", "HD e SSD"),
      sub("MEMORIA", "Memórias"),
      sub("PROCESSADOR", "Processadores"),
      sub("PLACA MAE", "Placas-mãe"),
      sub("PLACA DE VIDEO", "Placas de vídeo"),
      sub("FONTES", "Fontes"),
      sub("GABINETES", "Gabinetes"),
      sub("COOLER", "Coolers"),
      sub("CASE", "Cases para HD"),
      sub("PERIFERICOS", "Placas de expansão"),
      sub("PEÇAS PARA NOTEBOK", "Peças para notebook"),
      sub("PEÇAS PARA MONITOR", "Peças para monitor"),
      sub("SUPRIMENTOS", "Manutenção e limpeza"),
    ],
  },
  {
    slug: "cabos-e-adaptadores",
    nome: "Cabos e adaptadores",
    descricao: "HDMI, USB, rede, áudio e conectores",
    subcategorias: [sub("CABOS, CONECTORES E ADAPTADORE", "Cabos e conectores"), sub("ADAPTADORES", "Adaptadores")],
  },
  {
    slug: "automacao-comercial",
    nome: "Automação comercial",
    descricao: "Impressoras térmicas, SAT e bobinas",
    subcategorias: [sub("AUTOMAÇÃO COMERCIAL", "Automação comercial")],
  },
  {
    slug: "software-e-licencas",
    nome: "Software e licenças",
    descricao: "Windows, Office e antivírus",
    subcategorias: [sub("SOFTWARE", "Software e licenças")],
  },
  {
    slug: "celular-e-acessorios",
    nome: "Celular e acessórios",
    descricao: "Películas, capas, mochilas e acessórios",
    subcategorias: [
      sub("CELULARES/ACESSÓRIOS", "Acessórios para celular"),
      sub("PEÇAS MANUTENÇÃO", "Peças para celular"),
      sub("MOCHILAS / BOLSAS", "Mochilas e bolsas"),
      sub("ACESSORIOS", "Acessórios diversos"),
      sub("CAPTURA DE TV", "TV e streaming"),
      sub("VENTILADOR", "Ventiladores"),
    ],
  },
];

/** Para categorias do sistema que ainda não estão em nenhum departamento. */
export const departamentoOutros: Departamento = {
  slug: "outros",
  nome: "Outros",
  descricao: "Outros produtos da loja",
  subcategorias: [],
};
