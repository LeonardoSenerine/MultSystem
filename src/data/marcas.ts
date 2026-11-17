import type { Marca } from "@/types";

// Arquivos em public/img/marcas/ (origem de cada um em FONTES.md).
// largura/altura = tamanho do viewBox, já sem margem em branco.
export const marcas: Marca[] = [
  { nome: "Lenovo", arquivo: "lenovo.svg", largura: 500, altura: 105 },
  { nome: "Dell", arquivo: "dell.svg", largura: 72, altura: 72 },
  { nome: "HP", arquivo: "hp.svg", largura: 1014, altura: 1011.89 },
  { nome: "Intelbras", arquivo: "intelbras.svg", largura: 500, altura: 97.08 },
  { nome: "Epson", arquivo: "epson.svg", largura: 300, altura: 73.75 },
  { nome: "Logitech", arquivo: "logitech.svg", largura: 1000, altura: 304.17 },
  { nome: "TP-Link", arquivo: "tp-link.svg", largura: 105, altura: 39.99 },
];
