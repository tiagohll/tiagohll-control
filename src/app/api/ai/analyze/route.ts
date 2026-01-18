import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { ANALYST_PROMPT } from "@/lib/groq-ia/prompts";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { events, siteName, userQuestion } =
            await req.json();

        const simplifiedEvents = (events || [])
            .slice(0, 100)
            .map((e: any) => ({
                d: new Date(
                    e.created_at
                ).toLocaleDateString("pt-BR"),
                h: new Date(
                    e.created_at
                ).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
                ev: e.event_type,
                p: e.path,
                ref: e.referrer || "dir",
            }));

        const eventsSummary = JSON.stringify(
            simplifiedEvents
        );

        const chatCompletion =
            await groq.chat.completions.create({
                model: "llama-3.1-8b-instant",
                messages: [
                    {
                        role: "system",
                        content: `${ANALYST_PROMPT}. Responda de forma direta e executiva em Markdown.`,
                    },
                    {
                        role: "user",
                        content: `Site: ${siteName}. Pergunta: ${userQuestion || "Analise o tráfego"}. Dados: ${eventsSummary}`,
                    },
                ],
                max_tokens: 800,
                temperature: 0.7,
            });

        const text =
            chatCompletion.choices[0]?.message?.content ||
            "Sem resposta.";

        return NextResponse.json({ text });
    } catch (error: any) {
        console.error("Erro na Groq:", error);

        if (error?.status === 429) {
            return NextResponse.json(
                {
                    error: "Limite de uso da IA atingido. Aguarde alguns minutos.",
                },
                { status: 429 }
            );
        }

        return NextResponse.json(
            {
                error: "Erro interno no processador de dados.",
            },
            { status: 500 }
        );
    }
}
