export type Contato = {
  /** Número no formato internacional, só dígitos (ex.: 5511999999999). */
  whatsapp: string;
  whatsappTotalTech: string;
  telefone: string;
  telefoneLink: string;
  email: string;
  /** CNPJ da Multsystems, já formatado (00.000.000/0000-00). */
  cnpj: string;
  horario: string;
  cidade: string;
  endereco: string;
  mapsUrl: string;
  mapsEmbedUrl: string;
  mercadoLivreUrl: string;
  mercadoLivreNota: string;
  /** Link do perfil da loja no Google, para ver as avaliações (enviado pelo cliente). */
  googleAvaliacoesUrl: string;
  instagramUrl: string;
  instagramUsuario: string;
};

export type Produto = {
  codigo: string;
  nome: string;
  marca: string;
  /** Preço do produto, em reais (o cartão parcela o mesmo valor em até 3x sem juros). */
  preco: number;
  imagem?: string;
  exemplo?: boolean;
};

/** Item do catálogo da loja (API usada pelo site atual). */
export type ItemCatalogo = {
  codigo: string;
  sku: string;
  nome: string;
  categoria: string;
  imagem: string;
  preco: number;
  precoOriginal: number;
  estoque: number;
};

/** Resultado enxuto devolvido por /api/busca. */
export type ResultadoBusca = {
  codigo: string;
  slug: string;
  nome: string;
  categoria: string;
  imagem: string;
  preco: number;
  precoOriginal: number;
};

/** Subcategoria do site: uma categoria do sistema da loja com nome legível. */
export type Subcategoria = {
  slug: string;
  nome: string;
  /** Nome exatamente como vem da API do catálogo. */
  sistema: string;
};

/** Departamento do site: agrupa várias categorias do sistema da loja. */
export type Departamento = {
  slug: string;
  nome: string;
  /** Uma linha curta com o que tem dentro. */
  descricao: string;
  /** Foto do card na home. Só os departamentos com foto aparecem lá. */
  imagem?: string;
  subcategorias: Subcategoria[];
};

/** Item do catálogo já preparado para o site (nome formatado, departamento, marca). */
export type ProdutoCatalogo = {
  codigo: string;
  sku: string;
  slug: string;
  nome: string;
  /** Nome original do sistema, todo em maiúsculas (usado na busca). */
  nomeSistema: string;
  departamento: string;
  subcategoria: string;
  marca: string;
  imagem: string;
  /** false quando a URL da foto não devolve uma imagem. */
  temFoto: boolean;
  preco: number;
  precoOriginal: number;
  estoque: number;
};

export type Avaliacao = {
  nome: string;
  texto: string;
  origem: "Google" | "Mercado Livre";
  exemplo?: boolean;
};

export type Marca = {
  nome: string;
  arquivo: string;
  /** Largura e altura do viewBox do SVG, para manter a proporção. */
  largura: number;
  altura: number;
};

export type Pergunta = {
  pergunta: string;
  resposta: string;
  exemplo?: boolean;
};

export type LinkNav = {
  label: string;
  href: string;
  /** No menu do desktop só aparece a partir de 1536 px (para o menu caber numa linha); no celular sempre aparece. */
  soXl?: boolean;
};
