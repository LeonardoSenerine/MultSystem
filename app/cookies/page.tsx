import type { Metadata } from "next";
import Link from "next/link";
import { BotaoCookies } from "@/components/cookies/BotaoCookies";
import { PaginaLegal } from "@/components/PaginaLegal";

export const metadata: Metadata = {
  title: "Política de Cookies",
  description: "Quais cookies e dados de navegador o site da Multsystems usa, para que servem e como mudar a sua escolha.",
  alternates: { canonical: "/cookies" },
};

// Cada linha é uma chave real usada pelo código (src/lib/*.ts). Se uma chave nova for criada, entra aqui.
const necessarios = [
  { nome: "multsystems:carrinho:v1", para: "Guarda os produtos do seu carrinho.", dura: "Até você limpar os dados do navegador" },
  { nome: "multsystems:favoritos:v1", para: "Guarda os produtos favoritos e o preço do dia em que foram salvos.", dura: "Até você limpar" },
  { nome: "multsystems:listas:v1", para: "Guarda as listas de compra que você salvou.", dura: "Até você limpar" },
  { nome: "multsystems:cadastro:v1", para: "Lembra o contato (WhatsApp e e-mail) que você informou no carrinho, para não pedir de novo.", dura: "Até você trocar ou limpar" },
  { nome: "multsystems:cookies:v1", para: "Lembra a sua escolha neste aviso de cookies.", dura: "Até você limpar" },
] as const;

export default function CookiesPage() {
  return (
    <PaginaLegal
      titulo="Política de Cookies"
      resumo="O site guarda alguns dados no seu navegador para funcionar, e só usa estatísticas se você deixar. Aqui está cada um deles e como mudar a sua escolha."
      atualizadoEm="17 de novembro de 2026"
    >
      <h2>O que são</h2>
      <p>
        Cookies e o armazenamento local do navegador são pequenos arquivos que o site grava no seu aparelho. Usamos os dois, divididos em duas
        categorias.
      </p>

      <h2>Necessários (sempre ativos)</h2>
      <p>Fazem o site funcionar e ficam só no seu navegador. Sem eles, o carrinho e os favoritos não existiriam.</p>
      <div className="mt-4 overflow-x-auto rounded-card border border-line">
        <table className="w-full min-w-[560px] border-collapse text-left text-small">
          <thead className="bg-tint text-ink">
            <tr>
              <th className="px-4 py-3 font-bold">Nome</th>
              <th className="px-4 py-3 font-bold">Para que serve</th>
              <th className="px-4 py-3 font-bold">Duração</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {necessarios.map((c) => (
              <tr key={c.nome} className="align-top">
                <td className="px-4 py-3 font-mono text-[13px] text-ink">{c.nome}</td>
                <td className="px-4 py-3 text-muted">{c.para}</td>
                <td className="px-4 py-3 text-muted">{c.dura}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Estatísticas (só se você aceitar)</h2>
      <p>
        Se a loja ativar o <strong>Google Analytics</strong> e você aceitar, ele grava cookies (como <code>_ga</code> e <code>_ga_*</code>, com
        validade de até 2 anos) para contar quantas pessoas visitam cada página e o que mais interessa. Os dados são usados só para melhorar o
        site. Sem a sua aceitação, esses cookies não são gravados.
      </p>

      <h2>Como mudar a sua escolha</h2>
      <p>
        Você pode mudar quando quiser:{" "}
        <BotaoCookies className="font-bold text-brand underline-offset-2 hover:underline" />. Também dá para apagar os dados do site nas
        configurações do navegador (isso esvazia o carrinho e os favoritos).
      </p>

      <h2>Mais informações</h2>
      <p>
        Veja como tratamos os seus dados pessoais na <Link href="/privacidade">Política de Privacidade</Link>.
      </p>
    </PaginaLegal>
  );
}
