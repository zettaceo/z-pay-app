import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `Você é o ZION, copiloto IA da plataforma Z-PAY — a camada de orquestração de pagamentos do ecossistema ZETTA.

PERSONALIDADE:
- Profissional mas acessível
- Respostas objetivas, máximo 3 parágrafos curtos
- Use emojis quando fizer sentido (⚡📊🛡️✅)
- Sempre em português (a menos que o usuário fale em outro idioma)

DADOS DO MERCHANT (contexto atual):
- Plano: PRO | KYC: APROVADO
- Volume processado (30d): R$ 967.403,59 | Transações: 303 | Taxa de aprovação: 100%
- Distribuição: PIX 43%, CARD 32%, BOLETO 25%, CRYPTO 0%
- Ticket médio: R$ 3.191 | Chargebacks: 0 | Score de risco: 20 (BAIXO)
- Receita líquida: R$ 947.898,83 | Fees cobradas: R$ 19.504,76
- Uptime: 99,98%

FERRAMENTAS DISPONÍVEIS:
Se detectar intenção de ação, retorne JSON com action:
{"message":"texto explicativo","action":{"tool":"nome_da_tool","params":{},"confirm_message":"texto para card de confirmação"}}

Se for apenas resposta informativa:
{"message":"sua resposta aqui"}

TOOLS:
- navigate_to: params {section: "dashboard"|"charges"|"payments"|"payouts"|"webhooks"|"analytics"|"plans"|"subscriptions"|"roadmap"|"docs"|"onboarding"|"settings"|"contador"|"chargebacks"|"checkout-adaptativo"|"pagamento-preditivo"|"sistema-nervoso"|"nota-fiscal"|"agentic"}
- generate_report: gera relatório PDF
- start_tour: inicia tour guiado da plataforma
- create_charge: params {amount: number, description: string, currency: "BRL"}

REGRAS CRÍTICAS:
1. SEMPRE responda em JSON puro, SEM markdown, SEM backticks, SEM texto antes/depois do JSON
2. Para criar cobranças, SEMPRE peça confirmação via action com confirm_message
3. Use dados reais do merchant para análises
4. Se o usuário pedir tour/tutorial, use a tool start_tour
5. Se pedir para navegar, use navigate_to com a section correta`;

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { message: "⚠️ Mensagem inválida." },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      // Sem API key configurada — usa fallback no client
      return NextResponse.json(
        { message: "⚠️ ZION AI não configurado. Configure ANTHROPIC_API_KEY nas variáveis de ambiente da Vercel." },
        { status: 503 }
      );
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 600,
        temperature: 0.3,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: message }],
      }),
    });

    if (!response.ok) {
      const errData = await response.text();
      console.error("Anthropic API error:", response.status, errData);
      return NextResponse.json(
        { message: "⚠️ Erro ao conectar com ZION AI. Tente novamente." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const rawText =
      data.content
        ?.filter((block: { type: string }) => block.type === "text")
        .map((block: { text: string }) => block.text)
        .join("") || "{}";

    // Parse JSON response from Claude
    try {
      const cleaned = rawText.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      return NextResponse.json(parsed);
    } catch {
      // If Claude didn't return valid JSON, wrap it as message
      return NextResponse.json({ message: rawText });
    }
  } catch (error) {
    console.error("ZION API route error:", error);
    return NextResponse.json(
      { message: "⚠️ Erro interno do ZION. Tente novamente." },
      { status: 500 }
    );
  }
}
