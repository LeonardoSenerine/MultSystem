import type { Metadata } from "next";
import Link from "next/link";
import { PaginaLegal } from "@/components/PaginaLegal";
import { getContato } from "@/lib/dados";
import { whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Política de Trocas e Devoluções",
  description:
    "Arrependimento em até 7 dias, garantia legal e do fabricante, produto com defeito, como pedir troca ou devolução, custos de envio e prazo de reembolso na Multsystems.",
  alternates: { canonical: "/politica-devolucao" },
};

/*
 * Texto da política da loja, enviado pelo cliente em 18/11/2026 (era a página /politica-devolucao do site antigo;
 * o endereço foi mantido para não quebrar links). Mudanças feitas só nos dados de contato: o texto antigo trazia
 * WhatsApp (11) 99999-9999 e telefone (11) 3456-7890, que são números de exemplo; aqui valem os do site (src/data/contato.ts).
 * O WhatsApp da Total Tech (11) 99595-6716 vem de contato.whatsappTotalTech (confirmado pelo cliente em 18/11/2026).
 * TODO: revisão jurídica. Pontos a conferir com o jurídico: frete de devolução por conta do cliente no arrependimento
 * e reembolso "em até 2 faturas / 10 dias úteis" (o CDC pede devolução imediata dos valores pagos).
 */
const sumario = [
  ["arrependimento", "Direito de arrependimento (compras online)"],
  ["mercado-livre", "Compras no Mercado Livre"],
  ["garantia-legal", "Garantia legal"],
  ["garantia-fabricante", "Garantia contratual (fabricante)"],
  ["defeito", "Produtos com defeito"],
  ["condicoes-troca", "Condições para troca"],
  ["como-solicitar", "Como solicitar troca ou devolução"],
  ["custos-envio", "Custos de envio"],
  ["reembolso", "Prazo para reembolso"],
  ["casos-especiais", "Casos especiais"],
  ["exclusoes", "Exclusões"],
  ["atendimento", "Atendimento e suporte"],
] as const;



export default function PoliticaDevolucaoPage() {
  const contato = getContato();

  return (
    <PaginaLegal
      titulo="Política de Trocas e Devoluções"
      resumo="Seus direitos de arrependimento e garantia, quando e como trocar ou devolver, quem paga o envio e em quanto tempo o dinheiro volta."
      atualizadoEm="1 de dezembro de 2025"
    >
      <nav aria-labelledby="sumario-titulo" className="rounded-card bg-tint p-5">
        <p id="sumario-titulo" className="mt-0! text-eyebrow text-brand">
          Conteúdo
        </p>
        <ol className="mt-2! columns-1 gap-8 sm:columns-2">
          {sumario.map(([id, nome]) => (
            <li key={id} className="break-inside-avoid">
              <a href={`#${id}`}>{nome}</a>
            </li>
          ))}
        </ol>
      </nav>

      <h2 id="arrependimento">1. Direito de arrependimento (compras online)</h2>
      <p>
        De acordo com o Código de Defesa do Consumidor (CDC), você tem o direito de desistir da compra feita online em até{" "}
        <strong>7 dias corridos</strong> a partir do recebimento do produto, sem precisar justificar.
      </p>
      <h3>Condições para exercer o direito de arrependimento</h3>
      <ul>
        <li>O produto deve estar na embalagem original.</li>
        <li>Sem sinais de uso ou instalação.</li>
        <li>Com todos os acessórios, manuais e brindes.</li>
        <li>Nota fiscal e documentação completa.</li>
      </ul>

      <h2 id="mercado-livre">2. Compras no Mercado Livre</h2>
      <h3>2.1. Política do Mercado Livre</h3>
      <p>Nas compras feitas pelo Mercado Livre, valem as políticas de devolução da plataforma, que incluem:</p>
      <ul>
        <li>Direito de arrependimento de 7 dias.</li>
        <li>Proteção ao comprador.</li>
        <li>Possibilidade de devolução com reembolso total.</li>
      </ul>
      <h3>2.2. Como solicitar</h3>
      <p>As devoluções de compras do Mercado Livre devem ser pedidas diretamente pela plataforma:</p>
      <ul>
        <li>Na área “Minhas compras” do Mercado Livre.</li>
        <li>Na opção “Tenho um problema” &gt; “Devolver produto”.</li>
        <li>Seguindo as instruções da plataforma para o envio.</li>
      </ul>

      <h2 id="garantia-legal">3. Garantia legal</h2>
      <p>Todos os produtos têm a garantia legal prevista no Código de Defesa do Consumidor:</p>
      <ul>
        <li>30 dias para produtos não duráveis.</li>
        <li>90 dias para produtos duráveis.</li>
      </ul>
      <p>Essa garantia cobre defeitos de fabricação e vícios ocultos.</p>

      <h2 id="garantia-fabricante">4. Garantia contratual (fabricante)</h2>
      <p>Além da garantia legal, os produtos têm a garantia do fabricante, que varia conforme o item:</p>
      <ul>
        <li>Notebooks e computadores: 12 meses.</li>
        <li>Componentes (HD, SSD, memória): 12 a 36 meses.</li>
        <li>Periféricos (teclado, mouse): 12 meses.</li>
        <li>Impressoras: 12 meses.</li>
      </ul>
      <p>
        <strong>Importante:</strong> consulte o certificado de garantia específico de cada produto.
      </p>

      <h2 id="defeito">5. Produtos com defeito</h2>
      <h3>5.1. Dentro do prazo da garantia legal (90 dias)</h3>
      <ul>
        <li>Entre em contato conosco imediatamente.</li>
        <li>Podemos oferecer reparo, troca ou reembolso.</li>
        <li>Prazo de 30 dias para a solução do problema.</li>
      </ul>
      <h3>5.2. Garantia do fabricante</h3>
      <ul>
        <li>Encaminhar para a assistência técnica autorizada (Total Tech).</li>
        <li>Apresentar a nota fiscal e o certificado de garantia.</li>
        <li>
          WhatsApp da assistência:{" "}
          <a href={whatsappLink(contato.whatsappTotalTech)} target="_blank" rel="noopener noreferrer">
            (11) 99595-6716
          </a>
          .
        </li>
      </ul>

      <h2 id="condicoes-troca">6. Condições para troca</h2>
      <p>Aceitamos trocas em até 7 dias após a compra (loja física) nas condições abaixo.</p>
      <h3>Produto com defeito</h3>
      <ul>
        <li>Sem custo adicional.</li>
        <li>Troca imediata se houver o produto em estoque.</li>
        <li>Reembolso se não houver estoque.</li>
      </ul>
      <h3>Troca por arrependimento (compras online)</h3>
      <ul>
        <li>Produto sem sinais de uso.</li>
        <li>Embalagem original intacta.</li>
        <li>Acessórios e documentação completos.</li>
      </ul>
      <h3>Não aceitamos troca de</h3>
      <ul>
        <li>Produtos personalizados ou sob encomenda.</li>
        <li>Software e licenças abertas.</li>
        <li>Produtos com a embalagem violada (exceto por defeito).</li>
        <li>Produtos em promoção de liquidação (consulte as condições específicas).</li>
      </ul>

      <h2 id="como-solicitar">7. Como solicitar troca ou devolução</h2>
      <h3>Passo 1: entre em contato</h3>
      <ul>
        <li>
          E-mail: <a href={`mailto:${contato.email}`}>{contato.email}</a>
        </li>
        <li>
          WhatsApp:{" "}
          <a href={whatsappLink(contato.whatsapp)} target="_blank" rel="noopener noreferrer">
            {contato.telefone}
          </a>
        </li>
        <li>
          Telefone: <a href={contato.telefoneLink}>{contato.telefone}</a>
        </li>
      </ul>
      <h3>Passo 2: informe</h3>
      <ul>
        <li>O número do pedido ou da nota fiscal.</li>
        <li>O motivo da troca ou devolução.</li>
        <li>Fotos do produto (se for o caso).</li>
      </ul>
      <h3>Passo 3: aguarde as instruções</h3>
      <p>Nossa equipe envia as instruções para o envio ou agenda a retirada.</p>
      <h3>Passo 4: envio do produto</h3>
      <ul>
        <li>Embale bem o produto.</li>
        <li>Inclua todos os acessórios e a nota fiscal.</li>
        <li>Envie conforme as instruções recebidas.</li>
      </ul>

      <h2 id="custos-envio">8. Custos de envio</h2>
      <h3>Produto com defeito</h3>
      <ul>
        <li>Custos de envio por nossa conta.</li>
        <li>Reembolso do frete pago na compra (se for o caso).</li>
      </ul>
      <h3>Arrependimento (compras online)</h3>
      <ul>
        <li>Custos de envio por conta do cliente.</li>
        <li>Reembolso do valor do produto após o recebimento e a conferência.</li>
      </ul>
      <h3>Compras no Mercado Livre</h3>
      <ul>
        <li>Seguir a política específica da plataforma.</li>
      </ul>

      <h2 id="reembolso">9. Prazo para reembolso</h2>
      <p>Depois que recebermos e aprovarmos a devolução:</p>
      <ul>
        <li>Compras no cartão de crédito: até 2 faturas (conforme a política da operadora).</li>
        <li>Compras no débito ou PIX: até 10 dias úteis.</li>
        <li>Mercado Livre: conforme a política da plataforma (geralmente 10 dias).</li>
      </ul>

      <h2 id="casos-especiais">10. Casos especiais</h2>
      <h3>Produto danificado no transporte</h3>
      <ul>
        <li>Não aceite a entrega se a embalagem estiver visivelmente danificada.</li>
        <li>Se aceitar, fotografe na hora e entre em contato.</li>
        <li>Prazo de 24 horas para comunicar o problema.</li>
      </ul>
      <h3>Produto errado ou incompleto</h3>
      <ul>
        <li>Entre em contato imediatamente.</li>
        <li>Enviamos o produto correto sem custo adicional.</li>
        <li>A coleta do produto errado será agendada.</li>
      </ul>

      <h2 id="exclusoes">11. Exclusões</h2>
      <p>Esta política não se aplica a:</p>
      <ul>
        <li>Danos causados por mau uso, acidentes ou negligência.</li>
        <li>Produtos alterados ou reparados por terceiros não autorizados.</li>
        <li>Desgaste natural do produto.</li>
        <li>Problemas causados por uso inadequado.</li>
        <li>Produtos fora do prazo de garantia (exceto garantia estendida contratada).</li>
      </ul>

      <h2 id="atendimento">12. Atendimento e suporte</h2>
      <p>Nossa equipe está pronta para ajudar.</p>
      <h3>Multsystems (loja)</h3>
      <ul>
        <li>
          WhatsApp:{" "}
          <a href={whatsappLink(contato.whatsapp)} target="_blank" rel="noopener noreferrer">
            {contato.telefone}
          </a>
        </li>
        <li>
          Telefone: <a href={contato.telefoneLink}>{contato.telefone}</a>
        </li>
        <li>
          E-mail: <a href={`mailto:${contato.email}`}>{contato.email}</a>
        </li>
        <li>CNPJ: {contato.cnpj}</li>
      </ul>
      <h3>Total Tech (assistência técnica)</h3>
      <ul>
        <li>
          WhatsApp:{" "}
          <a href={whatsappLink(contato.whatsappTotalTech)} target="_blank" rel="noopener noreferrer">
            (11) 99595-6716
          </a>
        </li>
      </ul>
      <h3>Horário de atendimento</h3>
      <ul>
        <li>Segunda a sexta: 8h às 17h30.</li>
        <li>Sábado: 9h às 12h.</li>
        <li>Domingo: fechado.</li>
      </ul>

      <p>
        Veja também como comprar, pagar e receber em <Link href="/como-comprar">Como comprar</Link> e como tratamos os seus dados na{" "}
        <Link href="/privacidade">Política de Privacidade</Link>.
      </p>
    </PaginaLegal>
  );
}
