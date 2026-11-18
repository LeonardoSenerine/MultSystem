import type { Metadata } from "next";
import Link from "next/link";
import { PaginaLegal } from "@/components/PaginaLegal";
import { getContato } from "@/lib/dados";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Como a Multsystems coleta, usa e protege os seus dados pessoais, e como você exerce os seus direitos pela LGPD.",
  alternates: { canonical: "/privacidade" },
};

/*
 * TODO: dado real. Antes de publicar, a Multsystems (com apoio jurídico) precisa:
 *  - informar a razão social do controlador (o CNPJ já consta: 62.115.431/0001-50);
 *  - indicar quem responde pelos dados (encarregado/DPO) e o canal oficial;
 *  - confirmar os prazos de guarda dos dados e os fornecedores realmente usados (BotConversa, Vercel, Google Analytics).
 */
export default function PrivacidadePage() {
  const contato = getContato();

  return (
    <PaginaLegal
      titulo="Política de Privacidade"
      resumo="Explicamos quais dados pedimos, para que usamos, com quem compartilhamos e como você pode pedir acesso, correção ou exclusão, conforme a Lei Geral de Proteção de Dados (LGPD)."
      atualizadoEm="17 de novembro de 2026"
    >
      <h2>Quem somos</h2>
      <p>
        O site é da <strong>Multsystems</strong>, loja de informática com sede em {contato.endereco}. A Multsystems, inscrita no CNPJ {contato.cnpj}, é a
        responsável (controladora) pelos dados tratados neste site. A assistência técnica é prestada pela Total Tech, empresa
        parceira que funciona na mesma loja.
      </p>

      <h2>Quais dados coletamos</h2>
      <ul>
        <li>
          <strong>O que você preenche:</strong> nome, telefone ou WhatsApp, e-mail, empresa e a mensagem que você escreve nos formulários de
          orçamento, assistência técnica e contato.
        </li>
        <li>
          <strong>Carrinho e favoritos:</strong> os produtos do carrinho e os favoritos ficam no seu navegador. Se você quiser um lembrete do carrinho,
          pode deixar WhatsApp e e-mail (opcional; o nome também). Só então enviamos o carrinho e os favoritos aos nossos sistemas, junto do contato.
        </li>
        <li>
          <strong>Promoções e avisos:</strong> se você se inscrever, guardamos o WhatsApp ou e-mail que informar, as categorias de produto que
          marcar (opcional) e a data do seu aceite.
        </li>
        <li>
          <strong>Uso do site:</strong> páginas e produtos que você vê, buscas, cliques nos botões de WhatsApp e telefone. Esses registros não
          trazem o seu nome. O provedor de hospedagem também registra dados técnicos de acesso, como o endereço IP e o tipo de aparelho.
        </li>
        <li>
          <strong>Dados no seu navegador:</strong> carrinho, favoritos, listas de compra, contato salvo e a sua escolha de cookies ficam no
          armazenamento do seu navegador. Veja a <Link href="/cookies">Política de Cookies</Link>.
        </li>
      </ul>

      <h2>Para que usamos os seus dados</h2>
      <ul>
        <li>Responder pedidos de orçamento, mensagens e chamados de assistência técnica.</li>
        <li>Atender a sua compra pelo WhatsApp: separar produtos, confirmar estoque, combinar entrega e pagamento.</li>
        <li>
          Retomar o atendimento quando o carrinho ficar parado, avisando sobre os produtos que você escolheu. Você autoriza isso ao informar o
          contato no carrinho, e pode retirar a autorização quando quiser.
        </li>
        <li>Enviar promoções e novidades por WhatsApp ou e-mail, somente a quem se inscreveu. Você sai da lista quando pedir.</li>
        <li>Emitir nota fiscal e cumprir obrigações legais e fiscais.</li>
        <li>Entender como o site é usado e melhorá-lo (estatísticas), somente se você aceitar.</li>
        <li>Manter o site seguro e prevenir fraudes e abusos.</li>
      </ul>

      <h2>Base legal</h2>
      <p>
        Tratamos os dados com base no seu <strong>consentimento</strong> (contato do carrinho, promoções e avisos, e estatísticas), na realização de procedimentos
        preliminares a um contrato a pedido seu (orçamentos, pedidos e chamados), no cumprimento de obrigações legais (notas fiscais) e no
        legítimo interesse da loja em manter o site seguro.
      </p>

      <h2>Com quem compartilhamos</h2>
      <p>Não vendemos os seus dados. Compartilhamos só o necessário com quem nos ajuda a atender você:</p>
      <ul>
        <li>
          <strong>WhatsApp (Meta):</strong> quando você abre uma conversa com a loja ou com a Total Tech, o WhatsApp trata a conversa conforme
          os próprios termos.
        </li>
        <li>
          <strong>Ferramenta de atendimento por WhatsApp (BotConversa):</strong> recebe nome, telefone, e-mail e o resumo do seu pedido, para
          responder e avisar o vendedor.
        </li>
        <li>
          <strong>Total Tech:</strong> recebe os dados do chamado de assistência técnica.
        </li>
        <li>
          <strong>Hospedagem do site (Vercel):</strong> processa os acessos ao site.
        </li>
        <li>
          <strong>Google Analytics:</strong> só se você aceitar os cookies de estatísticas.
        </li>
      </ul>
      <p>Também podemos compartilhar dados quando a lei ou uma autoridade exigir.</p>

      <h2>Por quanto tempo guardamos</h2>
      <p>
        Guardamos os dados pelo tempo necessário para cumprir as finalidades acima e as obrigações legais (por exemplo, os prazos fiscais da
        nota). Contatos de carrinho e de orçamento que não viram atendimento podem ser apagados a qualquer momento a seu pedido.
      </p>

      <h2>Os seus direitos</h2>
      <p>Pela LGPD, você pode pedir à Multsystems, quando quiser:</p>
      <ul>
        <li>confirmação de que tratamos os seus dados e acesso a eles;</li>
        <li>correção de dados incompletos ou desatualizados;</li>
        <li>anonimização, bloqueio ou eliminação de dados desnecessários ou tratados sem base legal;</li>
        <li>portabilidade dos dados;</li>
        <li>informação sobre com quem compartilhamos;</li>
        <li>revogação do consentimento (por exemplo, parar de receber mensagens sobre o carrinho).</li>
      </ul>
      <p>
        Para exercer qualquer direito, escreva para <a href={`mailto:${contato.email}`}>{contato.email}</a> ou chame no{" "}
        <a href={`https://wa.me/${contato.whatsapp}`} target="_blank" rel="noopener noreferrer">
          WhatsApp
        </a>
        . Respondemos no prazo da lei. Você também pode reclamar à Autoridade Nacional de Proteção de Dados (ANPD).
      </p>

      <h2>Segurança</h2>
      <p>
        Usamos conexão segura (HTTPS) e limitamos o acesso aos dados a quem precisa deles para atender você. Nenhum sistema é totalmente imune
        a falhas; se houver um incidente que possa afetar você, avisaremos como a lei determina.
      </p>

      <h2>Mudanças nesta política</h2>
      <p>Podemos atualizar esta página. A data de atualização fica no topo, e mudanças importantes serão avisadas no site.</p>
    </PaginaLegal>
  );
}
