"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
    Bot,
    Terminal,
    MousePointer2,
    Clock,
    Percent,
    Lightbulb,
    AlertTriangle,
    CheckCircle2,
} from "lucide-react";

export function SystemSummary({ allEvents }: any) {
    const [messages, setMessages] = useState<any[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(true);
    const analysisDone = useRef(false);

    useEffect(() => {
        if (analysisDone.current) return;
        analysisDone.current = true;

        const generateSummary = () => {
            const totalEvents = allEvents.length;
            const totalViews = allEvents.filter(
                (e: any) => e.event_type === "page_view"
            ).length;
            const qrScans = allEvents.filter((e: any) =>
                e.event_type?.startsWith("qr_")
            ).length;

            const convRate =
                totalViews > 0
                    ? (qrScans / totalViews) * 100
                    : 0;
            let convStatus = {
                label: "Ruim",
                color: "text-red-400",
                icon: <AlertTriangle size={16} />,
            };

            if (convRate > 20)
                convStatus = {
                    label: "Excelente",
                    color: "text-green-400",
                    icon: <CheckCircle2 size={16} />,
                };
            else if (convRate > 12)
                convStatus = {
                    label: "Bom",
                    color: "text-blue-400",
                    icon: <CheckCircle2 size={16} />,
                };
            else if (convRate > 5)
                convStatus = {
                    label: "Médio",
                    color: "text-yellow-400",
                    icon: <AlertTriangle size={16} />,
                };

            // 2. Hipóteses de Causa (Regra 2)
            let convInsight = "";
            if (convRate <= 5)
                convInsight =
                    "Pode indicar um CTA fraco ou demora no carregamento da página destino.";
            else if (convRate <= 12)
                convInsight =
                    "O público está interessado, mas o incentivo ao clique pode ser mais direto.";
            else
                convInsight =
                    "Sua estratégia visual e oferta estão alinhadas com a expectativa do visitante.";

            // 3. Detecção de Anomalia/Horário (Regra 3)
            const hourCounts = allEvents.reduce(
                (acc: any, e: any) => {
                    const hour = new Date(
                        e.created_at
                    ).getHours();
                    acc[hour] = (acc[hour] || 0) + 1;
                    return acc;
                },
                {}
            );
            const peakHourEntry = Object.entries(
                hourCounts
            ).sort((a: any, b: any) => b[1] - a[1])[0];
            const peakHour = peakHourEntry
                ? parseInt(peakHourEntry[0])
                : null;
            const isDispersed =
                peakHourEntry &&
                (peakHourEntry[1] as number) <
                    totalEvents * 0.15;

            const steps: any[] = [
                {
                    id: "init",
                    text: "Sincronizando resumo inteligente...",
                    icon: <Terminal size={16} />,
                },
            ];

            if (totalEvents < 15) {
                steps.push({
                    id: "empty",
                    text: "Volume de dados insuficiente para gerar padrões confiáveis. Continue divulgando para desbloquear diagnósticos de conversão e horário.",
                    icon: (
                        <Bot
                            size={16}
                            className="text-zinc-600"
                        />
                    ),
                });
            } else {
                steps.push({
                    id: "conv",
                    text: `Taxa de conversão: ${convRate.toFixed(
                        1
                    )}% (${
                        convStatus.label
                    }). ${convInsight}`,
                    icon: convStatus.icon,
                    color: convStatus.color,
                });

                steps.push({
                    id: "peak",
                    text: isDispersed
                        ? "Nenhum pico de acesso claro identificado. O tráfego está disperso ao longo do dia."
                        : `Pico de atividade às ${peakHour}:00h. Este é o momento de maior impacto para novas ações.`,
                    icon: <Clock size={16} />,
                });

                steps.push({
                    id: "action",
                    title: "Plano de Ação recomendado:",
                    isHighlight: true,
                    suggestions: [
                        {
                            label: "🎯 Principal",
                            text:
                                convRate < 10
                                    ? "Revise o contraste e o texto dos seus botões principais (CTA)."
                                    : `Potencialize divulgações próximo das ${peakHour}:00h.`,
                        },
                        {
                            label: "💡 Opcional",
                            text: "Compare o desempenho entre acessos diretos e vindos de QR Code para validar a origem.",
                        },
                    ],
                    icon: (
                        <Lightbulb
                            size={16}
                            className="text-yellow-400"
                        />
                    ),
                });
            }

            steps.forEach((step, index) => {
                setTimeout(() => {
                    setMessages((prev) => [...prev, step]);
                    if (index === steps.length - 1)
                        setIsAnalyzing(false);
                }, (index + 1) * 750);
            });
        };

        generateSummary();
    }, [allEvents]);

    return (
        <div className="max-w-2xl mx-auto font-mono pb-10">
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 min-h-[480px] flex flex-col gap-5">
                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-4 p-4 rounded-2xl ${
                            msg.isHighlight
                                ? "bg-blue-500/10 border border-blue-500/20"
                                : "bg-zinc-900/50 border border-zinc-800/30"
                        }`}
                    >
                        <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                msg.color || "text-blue-500"
                            } bg-zinc-900 border border-zinc-800`}
                        >
                            {msg.icon}
                        </div>
                        <div className="space-y-3 flex-1">
                            {msg.text && (
                                <p className="text-zinc-300 text-sm leading-relaxed">
                                    {msg.text}
                                </p>
                            )}
                            {msg.title && (
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                                    {msg.title}
                                </p>
                            )}
                            {msg.suggestions && (
                                <div className="grid gap-2">
                                    {msg.suggestions.map(
                                        (
                                            s: any,
                                            i: number
                                        ) => (
                                            <div
                                                key={i}
                                                className="bg-black/30 p-3 rounded-xl border border-zinc-800/50"
                                            >
                                                <span className="text-[9px] font-black uppercase text-blue-500 block mb-1">
                                                    {
                                                        s.label
                                                    }
                                                </span>
                                                <p className="text-xs text-zinc-400 leading-snug">
                                                    {s.text}
                                                </p>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
                {isAnalyzing && (
                    <div className="flex items-center gap-3 text-[10px] text-zinc-600 font-bold ml-14">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        GERANDO DIAGNÓSTICO INTELIGENTE...
                    </div>
                )}
            </div>
        </div>
    );
}
