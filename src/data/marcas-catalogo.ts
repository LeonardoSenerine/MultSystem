// Marcas reconhecidas no nome dos produtos do catálogo, para o filtro "Marca".
// O sistema da loja não tem campo de marca: ela costuma vir como a última palavra do nome
// ("TECLADO USB STD SKL106 PT FORTREK"). `sistema` lista as grafias que aparecem nos nomes.

export type MarcaCatalogo = { nome: string; slug: string; sistema: string[] };

function m(nome: string, ...sistema: string[]): MarcaCatalogo {
  const slug = nome.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return { nome, slug, sistema: sistema.length ? sistema : [nome.toUpperCase()] };
}

export const marcasCatalogo: MarcaCatalogo[] = [
  m("Acer"), m("Aerocool"), m("AOC"), m("APC"), m("Asus"), m("Bematech"), m("Brasfort"), m("Bright"),
  m("Bringit"), m("Brother"), m("C3Tech", "C3TECH", "C3T"), m("Canon"), m("Clamper"), m("Comtac"),
  m("Corsair"), m("Dazz"), m("Dell"), m("Duracell"), m("Elg", "ELG"), m("Elgin"), m("Epson"),
  m("Exbom"), m("Fiolux"), m("Fortrek"), m("Furukawa"), m("Gigabyte"), m("Gothan"), m("HP"),
  m("Huawei"), m("Implastec"), m("Intel"), m("Intelbras"), m("Jetway"), m("Kaspersky"), m("Kian"),
  m("Kingston"), m("Knup"), m("Kross"), m("Labramo"), m("Leadership"), m("Lecoo"), m("Lenovo"),
  m("Logitech"), m("Lotus"), m("Maxprint"), m("MD9"), m("Mercusys"), m("Microsoft"), m("Multilaser"),
  m("Nonus"), m("Onix"), m("Panasonic"), m("Patriot"), m("PCYes", "PCYES"), m("Philips"),
  m("PlusCable", "PLUSCABLE"), m("Positivo"), m("Redragon"), m("Samsung"), m("SanDisk", "SANDISK"),
  m("Seagate"), m("Secpower"), m("Shara"), m("Shinka"), m("SMS"), m("Tanca"), m("ThunderX3", "THUNDERX3"),
  m("Toshiba"), m("TP-Link", "TP-LINK"), m("Tramontina"), m("Ugreen"), m("Unipower"), m("Vinik"),
  m("Viper Pro", "VIPER"), m("Western Digital", "WD", "WESTERN"), m("Xzone", "XZONE"),
];

const porGrafia = new Map(marcasCatalogo.flatMap((marca) => marca.sistema.map((s) => [s, marca] as const)));

/** Procura a marca a partir do fim do nome (onde ela costuma estar). */
export function marcaDoNome(nome: string): MarcaCatalogo | undefined {
  const palavras = nome.toUpperCase().split(/\s+/);
  for (let i = palavras.length - 1; i >= 0; i--) {
    const marca = porGrafia.get(palavras[i]);
    if (marca) return marca;
  }
  return undefined;
}

export const nomeDaMarca = new Map(marcasCatalogo.map((m) => [m.slug, m.nome]));
