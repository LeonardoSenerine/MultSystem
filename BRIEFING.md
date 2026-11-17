# Briefing — Nova home da Multsystems

> Leia este arquivo inteiro antes de começar. Ele é a fonte de verdade do projeto.

## 1. Contexto

A Multsystems é uma loja de informática em Itatiba/SP com 31 anos de mercado (desde 1995). Site atual: https://www.multsystems.com.br/

Vamos refazer **só a página inicial**, como proposta para a empresa aprovar. O site atual tem muito texto, quase nenhuma imagem e uma cara de "escrito por IA". A nova home precisa ser bonita, direta, com fotos reais e animações leves, e pensada **primeiro para o celular**.

- **Quem traz mais faturamento:** empresas (B2B), que pedem orçamento.
- **Quem mais acessa pelo celular:** o consumidor final, que vê o preço no site e compra pelo WhatsApp.
- **Terceiro público:** assistência técnica, feita pela **Total Tech**, uma empresa parceira separada que funciona dentro da mesma loja.
- **O que vendem:** computadores e notebooks, impressoras e suprimentos, câmeras de segurança, redes e Wi-Fi, periféricos (teclado, mouse e acessórios), baterias e nobreaks, e cadeiras. **Não vendem eletro.**
- **Marcas:** Lenovo, Dell, HP, Intelbras e outras.

## 2. Referência visual

- **Figma:** https://www.figma.com/design/uS9288Apu4RqF0QDNJODe3 tem os frames "Home — Mobile (375)" e "Home — Desktop (1440)", mais a área "Componentes".
- **Importante:** a conexão com o Figma está no plano Starter e já bateu o limite de chamadas. **Não dependa do Figma MCP.** Use as imagens exportadas em `referencia/` e os arquivos em `public/img/`.
- O layout do Figma é a base. Este briefing traz os refinamentos que vão além dele (seção 6).

## 3. Stack

**Next.js (App Router) + React + TypeScript + Tailwind CSS**, num projeto único.

- **Páginas:** a home é `app/page.tsx`, um Server Component. As seções interativas (menu, carrosséis, animação ao rolar, WhatsApp flutuante) são Client Components pequenos, com `"use client"` só onde precisa.
- **Dados:** ficam, por enquanto, em arquivos TypeScript em `src/data/` (produtos, categorias, avaliações, contato), lidos direto no servidor. Use funções como `getDestaques()` e `getContato()` em `src/lib/`, para depois trocar por banco ou API sem mexer nos componentes.
- **API (Route Handlers):** apenas `POST /api/orcamento` (`app/api/orcamento/route.ts`), que valida nome, empresa, telefone, e-mail e mensagem com `zod` e, por enquanto, só registra em log (o envio por e-mail fica para depois).
- **Imagens:** sempre com `next/image`, que já gera WebP/AVIF e `srcset`. O hero usa `priority`.
- **Fonte:** Manrope via `next/font/google`, que baixa no build e serve pelo próprio site, sem pedir nada ao Google em tempo real.
- **Ícones:** `lucide-react`.
- **Animações:** CSS puro + `IntersectionObserver` num componente `<Reveal>`. Não instale bibliotecas pesadas só para isso.
- **Carrossel de categorias:** scroll horizontal nativo com `scroll-snap`.
- **Carrossel de marcas:** CSS puro (veja a seção 5.8).
- **SEO:** `metadata` no `app/layout.tsx` (título, descrição, Open Graph) e `lang="pt-BR"`.
- **Configuração:** `.env.local` com os números de WhatsApp, mais um `.env.example` versionado.
- **Comandos:** `npm run dev`, `npm run build` e `npm start`. O deploy de teste vai para a Vercel.

## 4. Design tokens

### Cores

| Token | Hex | Uso |
| --- | --- | --- |
| `brand` | `#2E4686` | Azul oficial do logo: botões, links, destaques |
| `navy` | `#1C2F5C` | Fundo do hero, da assistência e do rodapé |
| `ink` | `#1E2A46` | Títulos e texto principal |
| `muted` | `#5B6785` | Texto secundário |
| `tint` | `#EEF2FB` | Fundo de seções alternadas e de cards |
| `line` | `#DCE3F2` | Bordas |
| `amber` | `#F5B800` | Só nas estrelas de avaliação |
| `whatsapp` | `#25D366` | Exclusivo do WhatsApp |

O azul das redes sociais (#020180) **não** entra no site.

### Tipografia (Manrope)

| Estilo | Mobile | Desktop | Peso |
| --- | --- | --- | --- |
| Display (H1 do hero) | 34/40 | 60/66 | 800, letter-spacing -2% a -3% |
| Título de seção (H2) | 26/32 | 40/48 | 700, letter-spacing -3% |
| Subtítulo (H3) | 18/24 | 18/24 | 700 |
| Corpo grande | 16/24 | 18/28 | 400 |
| Corpo | 16/24 | 16/24 | 400 |
| Pequeno | 14/20 | 14/20 | 500 |
| Sobretítulo | 12/16, maiúsculas, tracking 8% | igual | 700 |

O texto de corpo nunca fica abaixo de 16 px no celular.

### Forma

- Raio: 12 px em botões e campos, 16 px em cards, 24 px em fotos grandes. Não misture outros raios.
- Sombra: só uma, bem suave (`0 4px 16px rgb(28 47 92 / 0.06)`), e apenas em cards clicáveis.
- Espaçamento vertical entre seções: 40 px no celular e 96 px no desktop.
- Container do desktop: largura máxima de 1200 px.
- Elemento de assinatura: a **elipse em pincelada do logo**. Use em traço branco com 5–8% de opacidade atrás do hero, desenhando-se na tela ao carregar (animação de SVG com `stroke-dasharray`).

## 5. Seções (na ordem)

### 5.1 Barra de atendimento (só desktop)
Faixa navy fina com: "Seg a sex, 8h às 17h30" · "(11) 4894-8411" · "Itatiba/SP". À direita: ★ 5.0 no Mercado Livre.

### 5.2 Topo fixo
- **Celular:** logo, ícone de busca, ícone de orçamento e menu hambúrguer (o menu abre em tela cheia).
- **Desktop:** logo, menu (Início, Produtos, Serviços, Empresas, Sobre, Contato), campo "Buscar produtos...", botão verde WhatsApp e botão azul "Pedir orçamento".
- Ao rolar a página, o topo ganha borda inferior e fundo branco opaco.

### 5.3 Hero (fundo navy)
- Selo: "Desde 1995 em Itatiba"
- H1: **"Informática para sua empresa e para sua casa"**
- Texto: "Computadores, impressoras, redes e câmeras com nota fiscal, garantia e atendimento de quem entende."
- Botões: "Pedir orçamento" (branco, principal) e "Ver produtos" (contorno branco)
- Foto real da fachada (`public/img/fachada.jpg`)
- Linha de confiança em texto simples, separada por pontos e **sem chips**: ★ 5.0 no Mercado Livre · Nota fiscal e garantia · 31 anos de mercado
- **Desktop:** texto à esquerda e foto à direita. **Celular:** uma coluna, com botões de largura total.

### 5.4 Três caminhos
Título: "Como podemos ajudar?"

| Card | Texto | Ação |
| --- | --- | --- |
| Orçamento para empresa | Cotação com nota fiscal, condição especial e atendimento consultivo. | Pedir orçamento |
| Comprar para casa | Notebooks, impressoras e acessórios com preço no site e compra pelo WhatsApp. | Ver produtos |
| Assistência técnica | Conserto de notebooks e PCs com a Total Tech, aqui na mesma loja. | Falar com a assistência |

Empresa vem primeiro, porque é quem mais fatura.

### 5.5 Categorias
- Sobretítulo "Categorias" e título "O que você procura?"
- 7 categorias com foto: Computadores e notebooks, Impressoras e suprimentos, Câmeras de segurança, Redes e Wi-Fi, Periféricos, Baterias e nobreaks, Cadeiras.
- **Celular:** carrossel com arrastar e `scroll-snap`; o próximo card aparece pela metade para indicar que dá para arrastar.
- **Desktop:** grade de 4 colunas, e o 8º card é um bloco azul "Ver todas as categorias →".
- Enquanto não houver fotos reais, use um fundo `tint` com o ícone da categoria.

### 5.6 Mais vendidos
- Cabeçalho "Mais vendidos" com o link "Ver todos os produtos".
- Card: foto, marca, nome, preço, "à vista no PIX" e botão verde "Comprar".
- O botão abre `https://wa.me/<NUMERO>?text=` com a mensagem "Olá! Tenho interesse no produto: <nome> (cód. <código>)". O número vem de `getContato()` (`src/data/contato.ts`).
- **Celular:** grade de 2 colunas. **Desktop:** 4 colunas.
- Os produtos vêm de `getDestaques()` (`src/data/produtos.ts`). **Os produtos e preços atuais são exemplos inventados**: marque cada item com `exemplo: true` e deixe um `// TODO: dado real` no topo do arquivo.

### 5.7 Assistência técnica — Total Tech (fundo navy)
- Sobretítulo "Assistência técnica"
- Título: "Seu equipamento parou? A Total Tech resolve."
- Texto: "Assistência parceira que funciona dentro da nossa loja, com orçamento do conserto e 90 dias de garantia." (**A avaliação do técnico é paga**, informado pelo cliente em 17/11/2026: nunca escrever "sem compromisso" ou "grátis" para a avaliação.)
- Foto da bancada técnica
- 4 passos: 1 Fale com a gente → 2 Avaliação em 24h (paga) → 3 Você aprova → 4 Entrega com garantia (90 dias)
- Botão verde "Falar com a Total Tech". O WhatsApp da Total Tech é separado: vem de `getContato()` (campo `whatsappTotalTech`).
- **Desktop:** foto à esquerda e conteúdo à direita, com os passos em grade 2×2.

### 5.8 Por que a Multsystems + marcas + avaliações (fundo tint)
- Quatro provas, cada uma aparecendo só uma vez:

| Prova | Texto |
| --- | --- |
| 31 anos de mercado | Desde 1995 atendendo empresas e famílias de Itatiba e região. |
| Loja física | Atendimento no balcão, retirada na loja e suporte presencial. |
| 5.0 no Mercado Livre | Milhares de vendas avaliadas pelos próprios clientes. |
| Nota fiscal e garantia | Em todas as compras, para empresa ou pessoa física. |

- **Carrossel de marcas que rola sozinho** (requisito principal):
  - Logos em `public/img/marcas/` (veja a seção 7). A lista fica em `src/data/marcas.ts` (nome da marca + arquivo + largura/altura do `viewBox`), criada junto com os logos. Use `next/image` com `unoptimized` para os SVGs.
  - Faixa infinita: renderize a lista duas vezes seguidas e anime `translateX(0)` → `translateX(-50%)` em loop linear, entre 30 e 40 s por volta.
  - Altura de 32–40 px por logo e espaço de 48–64 px entre eles.
  - Logos em cinza (`grayscale` com opacidade de 60%), ganhando cor ao passar o mouse.
  - Bordas com degradê de transparência (`mask-image: linear-gradient(...)`) para os logos surgirem e sumirem suavemente.
  - Pausa no hover (desktop) e no toque (celular).
  - Com `prefers-reduced-motion`, a animação para e a faixa vira um scroll horizontal normal.
  - Sem saltos visíveis no ponto do loop.
- Avaliações: título "Quem compra, recomenda" e 3 cards com ★★★★★, o texto, o nome e a origem (Google ou Mercado Livre). Os dados vêm de `src/data/avaliacoes.ts`. **Hoje são textos provisórios**: marque com `exemplo: true` e um `// TODO` para trocar pelas avaliações reais.

### 5.9 Visite a loja
- Título "Visite a loja", com o texto "Venha conhecer, tirar dúvidas no balcão ou retirar seu pedido."
- Endereço (**pendente**: vem de `getContato()`), horário "Seg a sex, 8h às 17h30", telefone (11) 4894-8411 e e-mail vendas@multsystems.com.br.
- Botões: "Como chegar" (link para o Google Maps) e "Ligar" (`tel:`).
- Foto da fachada e mapa incorporado (`iframe` do Google Maps com `loading="lazy"`).

### 5.10 Rodapé (navy)
Logo branco, uma frase curta, links de navegação, contatos, "Loja oficial no Mercado Livre" e Instagram. Linha final: "© 2026 Multsystems · Itatiba/SP".

### 5.11 WhatsApp flutuante
Botão verde redondo, fixo no canto inferior direito (56 px no celular, 64 px no desktop). Aparece depois que o hero sai da tela.

## 6. Tirar a cara de IA — regras obrigatórias

1. **Texto de gente.** Frases curtas e concretas, como o vendedor do balcão falaria. Proibido jargão do tipo "solução robusta", "experiência premium", "reduzir fricção", "atalhos cognitivos" ou "curadoria".
2. **Cada número aparece uma vez só.** 31 anos, nota 5.0 e "desde 1995" não se repetem em toda seção.
3. **Nada de chips e badges em excesso.** No máximo um selo por seção. As linhas de confiança são texto simples com separadores.
4. **Fotos reais acima de ícones.** Ícone só onde ajuda a escanear (caminhos, passos, provas). Nada de ilustrações 3D, blobs ou gradientes roxo e rosa.
5. **Ritmo variado.** Nem toda seção pode ser "título centralizado + 3 cards". Alterne: hero dividido, cards, carrossel, faixa escura com foto e texto, grade.
6. **Alinhamento à esquerda por padrão.** Centralize só o título de "Como podemos ajudar?".
7. **Sem efeitos de template.** Nada de glassmorphism, brilhos, bordas em gradiente, emojis nos títulos ou "✨".
8. **Animação com propósito.** As seções aparecem com fade e subida de 16 px (300–400 ms, `ease-out`, uma vez só). O hover dos cards no desktop sobe 2 px e dá zoom de 3% na foto. Não anime tudo ao mesmo tempo, e as animações nunca podem atrasar o carregamento do hero.
9. **Hierarquia clara.** Uma ação principal por seção. O botão azul cheio é reservado para a ação mais importante.
10. **Contraste e respiro.** Texto `ink` sobre branco, branco sobre `navy`, e nada de texto cinza claro sobre fundo cinza.

## 7. Logos e imagens em alta qualidade

O carrossel de marcas e o topo do site precisam de logos nítidos em qualquer tela, inclusive em celulares com tela retina.

### Logos das marcas (salvar em `public/img/marcas/`)
1. **Formato preferido: SVG oficial.** Para cada marca, procure o SVG primeiro na página de imprensa/marca do fabricante e, em seguida, no Wikimedia Commons (arquivo `.svg` original, não o preview PNG).
2. **Marcas iniciais:** Lenovo, Dell, HP, Intelbras, Epson, Logitech, TP-Link. Se a pasta já tiver logos exportados do Figma, use-os como lista de marcas e procure a versão SVG de cada um.
3. **Nomes dos arquivos:** em minúsculas e sem espaço: `lenovo.svg`, `dell.svg`, `hp.svg`, `intelbras.svg`, `epson.svg`, `logitech.svg`, `tp-link.svg`.
4. **Otimização:** passe cada SVG pelo `svgo`, mantenha o `viewBox`, remova `width`/`height` fixos e corte as margens em branco ao redor, para que todos tenham a mesma altura visual no carrossel.
5. **Nunca redesenhe nem distorça um logo de marca.** Não troque as cores dentro do SVG: o efeito cinza é feito por CSS (`filter: grayscale(1)`).
6. **Sem SVG disponível:** use um PNG com fundo transparente e **pelo menos 400 px de altura**. Nunca amplie uma imagem pequena; se só existir versão pequena, avise em vez de usar.
7. **Conferência:** gere `public/img/marcas/_preview.html`, mostrando todos os logos lado a lado em 40 px e em 200 px de altura, e me mostre para eu conferir.
8. **Registro:** crie `public/img/marcas/FONTES.md` com a origem (URL) de cada arquivo.

### Logo da Multsystems
- `public/img/logo-azul.svg` e `public/img/logo-branco.svg` são uma vetorização feita a partir de uma imagem pequena. Use-os por enquanto, mas deixe um `TODO` pedindo o vetor original à Multsystems.
- Use as convenções do Next para ícones: `app/icon.svg` (favicon), `app/apple-icon.png` (180 px) e `app/opengraph-image.png` (1200×630, fundo navy com o logo branco), todos gerados a partir do logo.

### Fotos
- Use sempre `next/image`, com `sizes` correto em cada uso (ex.: `sizes="(min-width: 1024px) 540px, 100vw"` no hero). O Next gera WebP/AVIF e o `srcset` sozinho; ative `images.formats: ["image/avif", "image/webp"]` no `next.config`.
- A foto atual da fachada (`public/img/fachada.jpg`) tem só 646 px de largura. Use-a, mas registre um `TODO` pedindo uma foto nova com pelo menos 2000 px.

## 8. Estrutura de pastas

```
/
  app/
    layout.tsx            fonte Manrope, metadata, lang="pt-BR"
    page.tsx              a home (Server Component)
    globals.css           Tailwind + animações (marquee, reveal, elipse)
    icon.svg  apple-icon.png  opengraph-image.png
    api/orcamento/route.ts
  src/
    components/           Header, Hero, Caminhos, Categorias, MaisVendidos,
                          Assistencia, PorQue, MarcasMarquee, Avaliacoes,
                          VisiteLoja, Footer, WhatsAppFab, Button, Reveal
    data/                 produtos.ts, categorias.ts, avaliacoes.ts, contato.ts, marcas.ts
    lib/                  getDestaques(), getContato(), whatsappLink()...
    types.ts
  public/img/             logo-azul.svg, logo-branco.svg, fachada.jpg, marcas/
  referencia/             prints exportados do Figma
  .env.example
  tailwind.config.ts  next.config.ts
```

Os arquivos que já estão em `public/img/` continuam onde estão.

Contatos e links (WhatsApp, telefone, endereço, Mercado Livre, Instagram) vêm sempre de `getContato()`. Nunca escreva esses dados direto nos componentes.

## 9. Critérios de pronto

- [ ] Fica correto em 360, 375, 430, 768, 1280 e 1440 px, sem scroll horizontal indesejado.
- [ ] Lighthouse no celular: Performance ≥ 90, Acessibilidade ≥ 95.
- [ ] Todas as imagens usam `next/image` com `sizes`; o hero usa `priority` e as demais carregam sob demanda.
- [ ] Áreas de toque de no mínimo 44 × 44 px, foco visível no teclado e `alt` em todas as imagens.
- [ ] O carrossel de marcas roda sozinho, sem salto, pausa no hover/toque e respeita `prefers-reduced-motion`.
- [ ] Todos os botões de WhatsApp abrem `wa.me` com a mensagem certa.
- [ ] Não sobra texto de exemplo sem um comentário `// TODO: dado real`.
- [ ] Todos os logos de marca são SVG (ou PNG transparente com 400 px ou mais), ficam nítidos em tela retina e estão registrados em `FONTES.md`.
- [ ] `npm run build` passa sem erros nem avisos de TypeScript/ESLint, e o deploy de teste na Vercel funciona.

## 10. Ordem de trabalho

1. Criar o projeto com `create-next-app` (TypeScript, Tailwind, App Router, ESLint), configurar os tokens da seção 4 e a fonte Manrope.
2. Criar os dados em `src/data/`, as funções em `src/lib/` e a rota `POST /api/orcamento`.
3. **Logos e imagens** (seção 7): baixar e otimizar os logos das marcas, gerar o `_preview.html` e esperar meu ok.
4. Fazer Header, Hero e WhatsAppFab, e conferir no celular.
5. Fazer Caminhos, Categorias e Mais vendidos.
6. Fazer Assistência, Por que, **MarcasMarquee** e Avaliações.
7. Fazer Visite a loja e Footer.
8. Aplicar as animações (Reveal, a elipse do hero e os hovers).
9. Rodar `npm run build` e corrigir tudo o que aparecer.
10. Revisar contra as regras da seção 6 e os critérios da seção 9.

## 11. Dados pendentes (pedir à Multsystems)

- Endereço completo da loja
- Números de WhatsApp (Multsystems e Total Tech)
- Se são 7 mil ou 10 mil produtos
- 6 a 8 produtos reais para os "Mais vendidos", com foto, preço e código
- 3 avaliações reais (Google ou Mercado Livre)
- Fotos da loja, da equipe e da bancada técnica
- Logo em vetor (SVG, AI ou PDF)
- Links do Mercado Livre e do Instagram
