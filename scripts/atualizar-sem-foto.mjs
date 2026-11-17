/*
 * Descobre quais produtos NÃO têm foto de verdade e grava o resultado em src/data/sem-foto.json.
 *
 * Por quê: cerca de 40% das URLs de foto do catálogo respondem 200, mas com uma página HTML no lugar
 * da imagem. O site precisa saber disso para mostrar o espaço "sem foto" e mandar esses produtos para o
 * fim de "Mais relevantes". Conferir ~1.700 fotos leva minutos, então isso NÃO pode acontecer a cada
 * visita (era o que deixava a página inicial com 14 s de resposta e quebrava a prévia do WhatsApp).
 * Agora a conferência roda na publicação (npm run build chama este script) e o site só lê o arquivo.
 *
 * Cuidados:
 * - O servidor das fotos responde 429 (muitas requisições) se receber pedidos em rajada. Aqui o ritmo é
 *   contínuo (~15 por segundo) e, ao receber 429, todos esperam e tentam de novo. Um 429 NUNCA conta
 *   como "sem foto".
 * - É incremental: só confere o que ainda não foi conferido, mais uma amostra das "sem foto" (para
 *   perceber fotos que foram colocadas depois). Rápido nas publicações seguintes.
 * - Se algo falhar (API fora do ar, sem internet), o arquivo atual é mantido e o build segue normalmente.
 *
 * Uso:  npm run fotos            (incremental)
 *       npm run fotos -- --tudo  (confere todas as fotos de novo)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const API = process.env.CATALOGO_API_URL || "https://multsystems.discloud.app/api/produtos";
const SAIDA = fileURLToPath(new URL("../src/data/sem-foto.json", import.meta.url));
const TUDO = process.argv.includes("--tudo");
const INTERVALO_MS = 65; // ~15 pedidos por segundo
const SIMULTANEAS = 6;
const RECHECAR_SEM_FOTO = 250; // por publicação
const LIMITE_TOTAL_MS = 6 * 60_000;

const dorme = (ms) => new Promise((r) => setTimeout(r, ms));

function manter(motivo) {
  console.warn(`[sem-foto] ${motivo}: mantendo o arquivo atual.`);
  process.exit(0);
}

let itens;
try {
  const resposta = await fetch(API, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(20_000) });
  if (!resposta.ok) manter(`a API respondeu HTTP ${resposta.status}`);
  itens = (await resposta.json()).data ?? [];
} catch (erro) {
  manter(`não foi possível ler a API (${erro?.message ?? erro})`);
}

const urls = [...new Set(itens.map((i) => i?.imagem).filter(Boolean))];
if (urls.length < 100) manter(`a API trouxe só ${urls.length} fotos, parece incompleta`);
const noCatalogo = new Set(urls);

let anterior = { comFoto: [], semFoto: [] };
try {
  anterior = JSON.parse(readFileSync(SAIDA, "utf8"));
} catch {
  /* primeiro uso */
}
const comFoto = new Set((anterior.comFoto ?? []).filter((u) => noCatalogo.has(u)));
const semFoto = new Set((anterior.semFoto ?? []).filter((u) => noCatalogo.has(u)));

// O que conferir: tudo (--tudo), ou só o que é novo + uma amostra das "sem foto".
let aConferir;
if (TUDO) {
  aConferir = [...urls];
} else {
  const novos = urls.filter((u) => !comFoto.has(u) && !semFoto.has(u));
  const amostra = [...semFoto].sort(() => Math.random() - 0.5).slice(0, RECHECAR_SEM_FOTO);
  aConferir = [...novos, ...amostra];
}
if (aConferir.length === 0) {
  console.log("[sem-foto] nada novo para conferir.");
  process.exit(0);
}

// Limitador de ritmo compartilhado + pausa geral quando o servidor pede calma (429).
let proximoPermitido = 0;
let pausadoAte = 0;
async function esperarVez() {
  const agora = Date.now();
  const alvo = Math.max(proximoPermitido, pausadoAte, agora);
  proximoPermitido = alvo + INTERVALO_MS;
  if (alvo > agora) await dorme(alvo - agora);
}

/** "com" | "sem" | null (não deu para saber agora) */
async function conferir(url) {
  for (let tentativa = 0; tentativa < 6; tentativa++) {
    await esperarVez();
    try {
      const r = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(8_000) });
      if (r.status === 429) {
        const pedido = Number(r.headers.get("retry-after"));
        pausadoAte = Date.now() + (pedido > 0 ? pedido * 1000 : 2_000 * (tentativa + 1));
        continue;
      }
      if (r.status >= 500) return null;
      return r.ok && (r.headers.get("content-type") ?? "").startsWith("image/") ? "com" : "sem";
    } catch {
      return null;
    }
  }
  return null;
}

const inicio = Date.now();
const fila = [...aConferir];
let feitas = 0;
let incertas = 0;
async function trabalhar() {
  for (let url = fila.pop(); url; url = fila.pop()) {
    if (Date.now() - inicio > LIMITE_TOTAL_MS) break;
    const veredito = await conferir(url);
    feitas++;
    if (veredito === "com") {
      comFoto.add(url);
      semFoto.delete(url);
    } else if (veredito === "sem") {
      semFoto.add(url);
      comFoto.delete(url);
    } else {
      incertas++; // mantém o que já se sabia (ou fica sem veredito até a próxima)
    }
  }
}
await Promise.all(Array.from({ length: SIMULTANEAS }, trabalhar));

// Resultado ruim (muitas incertas) não substitui um arquivo bom, a não ser que seja o primeiro.
if (incertas > aConferir.length * 0.3 && (anterior.comFoto?.length ?? 0) > 0) {
  manter(`${incertas} de ${aConferir.length} conferências ficaram incertas (servidor de fotos instável)`);
}

const novo = {
  geradoEm: new Date().toISOString(),
  comFoto: [...comFoto].sort(),
  semFoto: [...semFoto].sort(),
};
const mudou = JSON.stringify(novo.comFoto) !== JSON.stringify(anterior.comFoto) || JSON.stringify(novo.semFoto) !== JSON.stringify(anterior.semFoto);
const segundos = Math.round((Date.now() - inicio) / 1000);
if (mudou) {
  writeFileSync(SAIDA, JSON.stringify(novo) + "\n");
  console.log(`[sem-foto] atualizado: ${novo.semFoto.length} sem foto, ${novo.comFoto.length} com foto (${feitas} conferidas em ${segundos} s, ${incertas} incertas).`);
} else {
  console.log(`[sem-foto] sem mudanças (${feitas} conferidas em ${segundos} s).`);
}
