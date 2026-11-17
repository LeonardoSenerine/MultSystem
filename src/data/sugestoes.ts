/*
 * "Complete a sua compra": para cada categoria (subcategoria do site), quais outras categorias
 * costumam ser levadas junto. A lista é uma REGRA escrita à mão (não vem de dados de venda) e
 * a ordem importa: a primeira é a que aparece primeiro.
 * Os nomes são os slugs das subcategorias de src/data/departamentos.ts.
 * TODO: dado real. Pedir à Multsystems para revisar (o que o balcão costuma oferecer junto).
 */
export const complementares: Record<string, string[]> = {
  // Computadores e notebooks
  notebooks: ["mouses", "mochilas-e-bolsas", "filtros-de-linha", "pen-drives-e-cartoes", "adaptadores"],
  computadores: ["monitores", "kits-teclado-e-mouse", "nobreaks", "estabilizadores", "filtros-de-linha", "cabos-e-conectores"],
  monitores: ["cabos-e-conectores", "adaptadores", "kits-teclado-e-mouse", "webcams"],

  // Impressão
  impressoras: ["cartuchos-e-toners", "papelaria", "cabos-e-conectores"],
  "cartuchos-e-toners": ["papelaria"],

  // Câmeras
  "cameras-e-alarmes": ["dvrs", "hd-e-ssd", "cabos-e-conectores", "fontes", "nobreaks"],
  dvrs: ["hd-e-ssd", "cabos-e-conectores", "cameras-e-alarmes", "nobreaks"],

  // Redes
  "roteadores-e-rede": ["switches", "cabos-e-conectores", "access-points", "racks"],
  switches: ["cabos-e-conectores", "racks", "access-points"],
  "access-points": ["switches", "cabos-e-conectores"],

  // Periféricos
  mouses: ["mouse-pads", "teclados", "fones-de-ouvido"],
  teclados: ["mouses", "mouse-pads", "fones-de-ouvido"],
  "kits-teclado-e-mouse": ["mouse-pads", "fones-de-ouvido", "webcams"],
  webcams: ["fones-de-ouvido", "kits-teclado-e-mouse"],

  // Energia
  nobreaks: ["baterias-para-nobreak", "filtros-de-linha", "estabilizadores"],

  // Peças
  "hd-e-ssd": ["cases-para-hd", "adaptadores", "memorias"],
  memorias: ["hd-e-ssd"],
};
