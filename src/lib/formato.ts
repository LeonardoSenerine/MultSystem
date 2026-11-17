const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function formatarPreco(valor: number): string {
  return brl.format(valor);
}

/** "Câmeras e alarmes" → "cameras-e-alarmes". */
export function slugificar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Siglas, unidades e marcas que devem manter a grafia certa quando o nome vem todo em maiúsculas.
const GRAFIAS: Record<string, string> = {
  "TP-LINK": "TP-Link", HP: "HP", LG: "LG", AOC: "AOC", SMS: "SMS", APC: "APC", AMD: "AMD",
  "WI-FI": "Wi-Fi", WIFI: "Wi-Fi", WIRELESS: "wireless", USB: "USB", "USB-C": "USB-C", LED: "LED",
  VGA: "VGA", HDMI: "HDMI", DVI: "DVI", DP: "DP", DVR: "DVR", NVR: "NVR", POE: "PoE", "POE+": "PoE+",
  SSD: "SSD", HD: "HD", FHD: "Full HD", IPS: "IPS", RGB: "RGB", VPN: "VPN", UPS: "UPS", PC: "PC",
  CPU: "CPU", RAM: "RAM", DDR3: "DDR3", DDR4: "DDR4", DDR5: "DDR5", PT: "PT", BR: "BR", IP: "IP",
  AC: "AC", AX: "AX", DC: "DC", SATA: "SATA", NVME: "NVMe", M2: "M.2", UHD: "UHD", CH: "canais",
  GB: "GB", TB: "TB", MB: "MB", MHZ: "MHz", GHZ: "GHz", MBPS: "Mbps", GBPS: "Gbps", PCI: "PCI",
  "PCI-E": "PCIe", PCIE: "PCIe", LCD: "LCD", TV: "TV", SD: "SD", CFTV: "CFTV", PABX: "PABX",
  SAT: "SAT", OEM: "OEM", ESD: "ESD", LAN: "LAN", RJ45: "RJ45", "RJ-45": "RJ45", UTP: "UTP",
  VHD: "VHD", IA: "IA", PS2: "PS2", BT: "Bluetooth", SFP: "SFP", ATX: "ATX", PDV: "PDV", PIX: "PIX",
  ND: "", "-": "–",
};

const MINUSCULAS = new Set(["DE", "DA", "DO", "DAS", "DOS", "E", "C/", "S/", "P/", "COM", "SEM", "PARA", "EM", "A", "O", "X"]);

function capitalizar(palavra: string): string {
  const minuscula = palavra.toLocaleLowerCase("pt-BR");
  return minuscula.charAt(0).toLocaleUpperCase("pt-BR") + minuscula.slice(1);
}

/**
 * Deixa legível o nome que vem do sistema da loja, todo em maiúsculas:
 * "TECLADO USB STD SKL106 PT FORTREK" → "Teclado USB std SKL106 PT".
 * A marca (quando informada) sai do fim do nome, porque o card já mostra a marca à parte.
 */
export function formatarNomeProduto(nome: string, marca?: { sistema: string[] }): string {
  let palavras = nome.replace(/""/g, '"').replace(/\s+/g, " ").trim().split(" ");

  if (marca && palavras.length > 2 && marca.sistema.includes(palavras[palavras.length - 1].toUpperCase())) {
    palavras = palavras.slice(0, -1);
  }
  if (nome !== nome.toUpperCase()) return palavras.join(" ");

  return palavras
    .map((palavra, i) => {
      if (palavra in GRAFIAS) return GRAFIAS[palavra];
      if (i > 0 && MINUSCULAS.has(palavra)) return palavra.toLowerCase();
      // Modelos e códigos (têm número) ficam como estão.
      if (/\d/.test(palavra)) return palavra;
      // Abreviações de uma letra com barra ("S/FIO") ficam minúsculas.
      if (/^[A-Z]\//.test(palavra)) return palavra.toLocaleLowerCase("pt-BR");
      // Demais palavras com inicial maiúscula, como nos marketplaces ("Mini PC Neo Tiny").
      return capitalizar(palavra);
    })
    .filter(Boolean)
    .join(" ")
    .replace(/\s+–\s*$/, "");
}

/** Para exibir: ponto de quebra invisível depois da barra, "I5/8GB/256GB" pode quebrar a linha ali. */
export function quebravel(nome: string): string {
  return nome.replace(/(\w)\/(?=\w)/g, "$1/​");
}

/** "CFTV E ALARMES" → "CFTV e alarmes". */
export function formatarCategoria(categoria: string): string {
  return formatarNomeProduto(categoria);
}

/** "3x de R$ 300,00" para um preço de R$ 900,00 (cartão em até 3 vezes sem juros, sobre o mesmo valor do site). */
export function parcelaEm3x(preco: number): string {
  return `3x de ${formatarPreco(Math.round((preco / 3) * 100) / 100)}`;
}

/** Percentual de desconto em relação ao preço cheio ("de/por"), arredondado. */
export function descontoPix(preco: number, precoOriginal: number): number {
  if (!(precoOriginal > preco)) return 0;
  return Math.round((1 - preco / precoOriginal) * 100);
}

/** Minúsculas e sem acento, para comparar "camera" com "CÂMERA". */
export function normalizar(texto: string): string {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}
