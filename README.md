# Nova home da Multsystems

Proposta de página inicial para a Multsystems (Itatiba/SP), feita em Next.js 16 + React + TypeScript + Tailwind 4.
A fonte de verdade do projeto é o [BRIEFING.md](BRIEFING.md).

## Rodar

```bash
npm install
npm run dev
```

Abra http://localhost:3000. Para o build de produção: `npm run build` e `npm start`.

Copie `.env.example` para `.env.local` e preencha os números de WhatsApp.

## Páginas

| Endereço | O que é |
| --- | --- |
| `/` | Home |
| `/produtos` | Todos os produtos do catálogo, com filtros (departamento, marca, preço), filtros rápidos, ordenação e paginação. Tudo fica na URL (`?q=&sub=&marca=&min=&max=&ordem=&pagina=`) |
| `/categoria/[slug]` | Mesmo catálogo, já dentro de um departamento, com filtro por categoria |
| `/produto/[slug]` | Página do produto (versão básica; a completa é a etapa 3) |
| `/assistencia` | Total Tech: passos, formulário "Fale com o técnico" (abre o WhatsApp com o relato escrito e registra o chamado em `POST /api/assistencia`) e perguntas frequentes (`src/data/faq-assistencia.ts`, respostas a confirmar) |
| `/empresas`, `/sobre`, `/contato`, `/orcamento` | Versões provisórias, montadas com as seções da home (as completas são a etapa 4). `/orcamento?encomenda=<produto>` já abre o formulário com o pedido por encomenda escrito |

Quando a busca do catálogo não acha nada, a página mostra "Não encontramos… mas dá para conseguir", com "Falar com um atendente" (WhatsApp com o termo buscado), "Pedir orçamento por encomenda" e sugestões de produtos parecidos. No fim de toda lista aparece uma faixa menor com as mesmas duas saídas.

`/servicos`, `/escritorio` e `/favoritos` (endereços do site antigo) redirecionam para as páginas novas.

**Como o catálogo é montado** (`src/lib/catalogo.ts`, `src/lib/filtros.ts`):
- As 64 categorias do sistema da loja foram agrupadas em 11 departamentos, com nomes legíveis, em `src/data/departamentos.ts`. Categoria nova que aparecer na API cai em "Outros".
- O sistema não tem campo de marca: ela é reconhecida no nome do produto pela lista de `src/data/marcas-catalogo.ts`.
- Os nomes vêm todos em maiúsculas e são reescritos para leitura ("TECLADO USB STD SKL106 PT FORTREK" vira "Teclado USB Std SKL106 PT", com a marca mostrada à parte).
- Cerca de 4% das fotos do catálogo não existem (a URL devolve uma página no lugar da imagem). O script `scripts/atualizar-sem-foto.mjs` confere isso a cada publicação (`npm run build`; manual: `npm run fotos`, ou `npm run fotos -- --tudo` para conferir tudo de novo) e grava `src/data/sem-foto.json`; o site só lê o arquivo e mostra "Foto em breve", e esses produtos vão para o fim da ordem "Mais relevantes". O servidor das fotos devolve 429 se receber pedidos em rajada, por isso a conferência anda em ritmo contínuo e é incremental.

## Vendas: funil, BotConversa, sugestões e compra recorrente

**1. Funil de vendas** (`src/lib/eventos.ts`, `app/api/eventos/route.ts`). Cada passo vira um evento: `ver_produto`, `adicionar_carrinho`, `remover_carrinho`, `favoritar`, `busca`, `busca_sem_resultado`, `clique_whatsapp`, `clique_telefone`, `clique_como_chegar`, `finalizar_carrinho`, `enviar_orcamento`, `enviar_assistencia`, `enviar_contato`, `salvar_lista`, `usar_lista`.
- Vão para o Google Analytics se `NEXT_PUBLIC_GA_ID` estiver preenchido (consentimento começa **negado**; quando houver aviso de cookies, o aceite deve chamar `gtag('consent','update',{analytics_storage:'granted'})`).
- Os principais também vão para o log do servidor (`[evento] nome {...}`), então dá para contar o funil sem GA. Busca sem resultado mostra o que o cliente quis e a loja não tem.

**2. BotConversa** (`src/lib/botconversa.ts`). O site manda um JSON para `BOTCONVERSA_WEBHOOK_URL` (Automações > Webhook, plano Pro) em: orçamento, assistência, contato, carrinho, carrinho finalizado e favoritos. Campos: `phone` e `telefone` (+55...), `nome`, `email`, `tipo`, `prioridade` (`alta` para pedido de 5 unidades ou mais, ou acima de R$ 5.000), `resumo`, `total`, `link`, `origem`, `enviado_em`. No BotConversa, mapeie esses campos e monte um fluxo por `tipo`:
- `orcamento` / `assistencia` / `contato`: avisar o vendedor (ou a Total Tech) e responder ao cliente; se `prioridade` for `alta`, avisar primeiro; aguardar 24 h e lembrar o vendedor se não houve resposta.
- `carrinho`: aguardar algumas horas e mandar ao cliente o `resumo` e o `link`. O site só reenvia o carrinho se ele mudou e passou 20 min.
- `carrinho_finalizado`: o cliente fechou o pedido; cancelar o lembrete do carrinho dele.
- `favoritos`: guardar para um futuro aviso de preço (ainda não há verificação de preço no servidor).
Atenção: mensagem iniciada pela loja fora da janela de 24 h do WhatsApp precisa de modelo aprovado. O contato do carrinho é **opcional**: adicionar ao carrinho nunca pede cadastro; no resumo do carrinho há "Quer um lembrete do seu carrinho?" (WhatsApp e e-mail, com o aceite escrito). Só quem deixa o contato tem carrinho e favoritos enviados ao servidor/BotConversa.

**3. Sugestões** (`src/data/sugestoes.ts`, `src/lib/sugestoes.ts`, `app/api/sugestoes/route.ts`). "Complete a sua compra" na página do produto e "Complete o seu pedido" no carrinho. São regras escritas à mão (notebook leva mouse, mochila, filtro de linha...), com produtos que têm foto e estoque, e preço de acessório. TODO: a Multsystems revisar as regras.

**4. Compra para empresa** (`src/lib/listas.ts`, carrinho). "Salvar como lista de compra" guarda o carrinho com um nome (no navegador); "Repetir pedido" devolve os itens ao carrinho com os preços de hoje e "Pedir orçamento" leva a lista ao formulário (`/orcamento?lista=`). Com 5 unidades ou mais (ou R$ 3.000), o carrinho destaca o orçamento para empresa; na página do produto, a partir de 3 unidades aparece o link de orçamento com condição.

## Pontos da auditoria de fluxo corrigidos (17/11/2026)

- Adicionar ao carrinho sem cadastro (contato opcional no resumo do carrinho).
- Aviso de cookies compacto, que só aparece depois de 2,5 s, para não cobrir os botões do topo.
- O cartão "Assistência técnica" da home leva a `/assistencia` (onde está o aviso de que a avaliação é paga), não direto ao WhatsApp.
- Avaliações de exemplo (`exemplo: true` em `src/data/avaliacoes.ts`) **não aparecem**: o bloco mostra o link das avaliações do Mercado Livre até a loja mandar depoimentos reais. O título "Mais vendidos" foi mantido a pedido do cliente (a lista ainda é escolha da equipe; TODO pedir a real).
- Nova página `/como-comprar` (passo a passo, pagamento, entrega, troca e garantia, perguntas). **Confirmado pelo cliente em 17/11/2026:** cartão em até 3x sem juros; valor do frete e prazos de entrega a combinar com o vendedor (e o prazo do conserto, com o técnico). TODO: confirmar a política de troca e se o valor no cartão é o do PIX (o site não afirma isso).
- Avaliações: o bloco leva ao Google (link enviado pelo cliente, em `src/data/contato.ts`; trocar pelo link direto do Perfil da Empresa) e ao Mercado Livre, até haver depoimentos reais para mostrar no site.

## Busca com sugestões ao vivo

`BuscaComSugestoes` (usada na faixa de busca do topo e na página 404): a partir de 2 letras mostra até 8 produtos (foto, nome, categoria e preço) com espera de 180 ms, navegação por setas/Enter/Esc e "Ver os N resultados". Sem resultado, oferece "Pedir por encomenda". A rota `GET /api/busca` põe na frente os produtos cujo nome COMEÇA com o termo (notebooks antes de suportes para notebook). Sem JavaScript, o campo continua sendo um formulário para `/produtos?q=`. No catálogo, a busca continua filtrando a grade enquanto se digita.

## Promoções e avisos (inscrição por WhatsApp ou e-mail)

`SecaoPromocoes` aparece na home (depois dos mais vendidos) e no fim do catálogo (`/produtos` e `/categoria/*`). A pessoa escolhe WhatsApp ou e-mail, marca os interesses (opcional) e **precisa marcar o aceite** para enviar. `POST /api/promocoes` valida, registra no log e manda ao BotConversa um evento `tipo: "promocoes"` (campos extras: `canal`, `interesses`, `origem_inscricao`, `consentimento`); quem se inscreve só com e-mail vai **sem telefone**, e o BotConversa precisa de telefone para criar o contato (para e-mail, ligar o mesmo webhook a uma ferramenta de e-mail, como Zapier ou Make). O navegador lembra a inscrição (`multsystems:promocoes:v1`) e mostra "você já está na lista". TODO: gravar num banco, enviar as mensagens de fato e criar o descadastro (link ou "SAIR"), exigido pela LGPD/WhatsApp.

## Cookies, privacidade, 404 e SEO

- **Cookies** (`src/lib/cookies.ts`, `src/components/cookies/`). O aviso aparece na primeira visita (Aceitar todos / Só os necessários / Escolher) e pode ser reaberto em "Preferências de cookies" no rodapé. Necessários: carrinho, favoritos, listas, contato salvo e a própria escolha (localStorage). Estatísticas: Google Analytics, só se `NEXT_PUBLIC_GA_ID` estiver preenchido **e** o visitante aceitar (o script já nasce com o consentimento certo e atualiza na hora quando a escolha muda). A tabela da `/cookies` lista as chaves reais; chave nova no código = linha nova na tabela.
- **Páginas legais:** `/privacidade` e `/cookies` (`src/components/PaginaLegal.tsx`). TODO antes de publicar: razão social e CNPJ do controlador, encarregado (DPO) e canal oficial, prazos de guarda e conferência dos fornecedores citados (BotConversa, Vercel, Google Analytics). Texto de apoio, **não substitui revisão jurídica**.
- **404 e erro:** `app/not-found.tsx` (busca, departamentos e WhatsApp, `noindex`) e `app/error.tsx` (tentar de novo).
- **SEO:** `app/robots.ts` (libera o site e bloqueia `/api/`, `/carrinho`, `/favoritos`), `app/sitemap.ts` (páginas, departamentos e todos os produtos, ~1.770 URLs), `app/manifest.ts`, metadados e Open Graph/Twitter no `layout.tsx` (cada página tem título, descrição e canonical próprios) e dados estruturados: `ComputerStore` (endereço, telefone e horário, em `DadosEstruturados.tsx`), `BreadcrumbList` (em `Migalhas.tsx`), `FAQPage` (em `Faq.tsx`) e `Product` (página do produto). O domínio vem de `NEXT_PUBLIC_SITE_URL` (`src/lib/site.ts`). TODO: confirmar o domínio final e cadastrar o site no Google Search Console.

## Onde está cada coisa

| Pasta / arquivo | O que é |
| --- | --- |
| `app/page.tsx` | A home, na ordem das seções do briefing |
| `app/globals.css` | Tokens de cor, tipografia, raios e as animações (marquee, reveal, fotos, elipse, FAQ) |
| `app/api/orcamento/route.ts` | `POST /api/orcamento`: valida o formulário e, por enquanto, só registra em log |
| `app/api/busca/route.ts` | `GET /api/busca?q=`: busca no catálogo da loja (mesma API do site atual) |
| `src/components/` | Uma seção por arquivo (Header, Hero, Caminhos, Categorias, MaisVendidos, Assistencia, Sobre, MarcasMarquee, Avaliacoes, TiposOrcamento, CtaOrcamento, VisiteLoja, PerguntasFrequentes, Encerramento, Footer) |
| `src/data/` | Contato, categorias, produtos, avaliações, perguntas, marcas e navegação |
| `src/lib/dados.ts` | `getContato()`, `getDestaques()`, `getCategorias()`, `getAvaliacoes()`, `getPerguntas()` |
| `src/lib/catalogo.ts` | Leitura e busca no catálogo da loja, com cache de 1 hora |
| `public/img/marcas/` | Logos em SVG, com a origem em `FONTES.md` e a conferência em `_preview.html` |
| `public/img/FONTES.md` | Origem das fotos de banco de imagens |

## Resultado do Lighthouse (build de produção, 16/11/2026)

| | Performance | Acessibilidade | Boas práticas | SEO |
| --- | --- | --- | --- | --- |
| Celular | 95–98 (com o cache de imagens já gerado) | 100 | 100 | 100 |
| Desktop | 100 | 100 | — | — |

Medido com `next start` neste computador, com o servidor de desenvolvimento rodando ao mesmo tempo.
Com a máquina carregada o celular oscilou até 77. Na primeira visita depois de um deploy o Next ainda
gera as versões AVIF das fotos, e esse primeiro carregamento é mais lento.

## Conferência dos critérios de pronto (seção 9 do briefing)

- Sem rolagem horizontal em 360, 375, 430, 768, 1280 e 1440 px.
- Áreas de toque de 44 × 44 px ou mais, `alt` em todas as imagens e `sizes` em todas as fotos.
- Os 14 links de WhatsApp abrem `wa.me` com a mensagem certa (geral, orçamento, assistência ou o produto).
- `npm run build` passa sem erro nem aviso de TypeScript/ESLint.
- Dado provisório marcado com `TODO: dado real` ou `exemplo: true`.

**Diferenças em relação ao briefing, a pedido do cliente:**
- O carrossel de marcas mostra os logos nas cores originais e não pausa no hover nem no toque (o briefing pedia cinza e pausa).
- As animações de entrada duram de 500 a 600 ms (o briefing pedia de 300 a 400 ms), para ficarem mais suaves.
- Ícones só onde têm função (busca, menu, setas, WhatsApp e estrelas das avaliações).

## O que ainda depende da Multsystems

Tudo o que é provisório está marcado no código com `// TODO: dado real` ou `exemplo: true`.

1. **Números de WhatsApp** (vendas e Total Tech). Hoje os dois caem no (11) 4894-8411, tirado do site atual.
2. **Endereço completo com CEP.** Usamos "R. Campos Sales, 508, Centro, Itatiba/SP", do site atual.
3. **Mais vendidos de verdade.** Os 8 produtos vêm do catálogo real, com estoque e foto, mas a escolha foi nossa. Nenhum notebook em estoque tinha foto.
4. **Uso da API do catálogo** (`multsystems.discloud.app/api/produtos`) no site novo: confirmar com quem mantém o site atual.
5. **3 avaliações reais** (Google ou Mercado Livre), com autorização de quem escreveu.
6. **Respostas das perguntas frequentes**, principalmente entrega e pagamento. E a **história da empresa** para completar a seção "Sobre" (hoje ela usa só o que já sabemos).
7. **Fotos próprias**: fachada em alta (mínimo 2000 px), bancada da Total Tech, equipe e categorias. Hoje as categorias e a bancada usam fotos de banco de imagens.
8. **Logo em vetor** (SVG, AI ou PDF). Os SVGs atuais foram vetorizados de uma imagem pequena.
9. **Envio do formulário de orçamento por e-mail** (hoje só vai para o log do servidor).
10. **Preço cheio e preço PIX.** Quase todos os produtos têm `preco_original` cerca de 15% acima de `preco`. O site mostra isso como "15% OFF no PIX": confirmar se `preco_original` é mesmo o preço no cartão. Confirmar também se os cartuchos marcados "VENCIDO" no nome devem aparecer no site.
11. **Links do Mercado Livre e do Instagram**: os do site atual estão no ar; confirmar.
12. **Deploy de teste na Vercel.**
