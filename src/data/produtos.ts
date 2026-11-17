import type { Produto } from "@/types";

/*
 * TODO: dado real. Os códigos abaixo existem no catálogo da loja (a mesma API do site atual)
 * e em 12/11/2026 tinham estoque e foto. Preço e foto vêm da API; o nome e a marca foram
 * reescritos aqui para ficarem legíveis (no sistema vêm em maiúsculas e abreviados).
 * NÃO sabemos se são os mais vendidos: pedir à Multsystems a lista certa.
 * Faltou notebook: nenhum notebook em estoque tinha foto no catálogo.
 */
export const destaques: Pick<Produto, "codigo" | "nome" | "marca">[] = [
  { codigo: "0012460", nome: "Impressora Epson EcoTank L1250 Wi-Fi", marca: "Epson" },
  { codigo: "0012724", nome: "Câmera Wi-Fi Intelbras Mibo IM5 SC", marca: "Intelbras" },
  { codigo: "0012683", nome: "Roteador mesh TP-Link Deco M5 AC1300, 3 peças", marca: "TP-Link" },
  { codigo: "0010580", nome: "Monitor Samsung 22\" LED S22F350FHL", marca: "Samsung" },
  { codigo: "0008863", nome: "Kit teclado e mouse sem fio Logitech MK270", marca: "Logitech" },
  { codigo: "0013218", nome: "Nobreak Intelbras Attiv 1000VA senoidal bivolt", marca: "Intelbras" },
  { codigo: "0006899", nome: "Switch TP-Link 16 portas Gigabit TL-SG1016D", marca: "TP-Link" },
  { codigo: "0011440", nome: "Toner HP 105A W1105A preto", marca: "HP" },
];

// TODO: dado real. Reserva INVENTADA, usada só se a API do catálogo estiver fora do ar.
export const produtosExemplo: Produto[] = [
  { codigo: "EX-1001", nome: "Notebook Lenovo IdeaPad 1 15\" Ryzen 5, 8GB, SSD 256GB", marca: "Lenovo", preco: 2899.9, exemplo: true },
  { codigo: "EX-1002", nome: "Impressora multifuncional Epson EcoTank L3250 Wi-Fi", marca: "Epson", preco: 1099.9, exemplo: true },
  { codigo: "EX-1003", nome: "Kit 4 câmeras Intelbras Full HD com DVR 4 canais", marca: "Intelbras", preco: 1349.0, exemplo: true },
  { codigo: "EX-1004", nome: "Roteador TP-Link Archer AX12 Wi-Fi 6 dual band", marca: "TP-Link", preco: 349.9, exemplo: true },
  { codigo: "EX-1005", nome: "Monitor Dell 24\" Full HD IPS SE2425H", marca: "Dell", preco: 799.0, exemplo: true },
  { codigo: "EX-1006", nome: "Teclado e mouse sem fio Logitech MK270", marca: "Logitech", preco: 159.9, exemplo: true },
  { codigo: "EX-1007", nome: "Nobreak Intelbras 1200VA bivolt", marca: "Intelbras", preco: 699.0, exemplo: true },
  { codigo: "EX-1008", nome: "Cartucho de tinta HP 667 preto", marca: "HP", preco: 79.9, exemplo: true },
];
