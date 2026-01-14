"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
    Bot,
    Terminal,
    Clock,
    Lightbulb,
    AlertTriangle,
    CheckCircle2,
} from "lucide-react";

export function SystemSummary({
    events = [],
}: {
    events: any[];
}) {
    const [messages, setMessages] = useState<any[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(true);
    const timersRef = useRef<NodeJS.Timeout[]>([]);

    useEffect(() => {
        // 1. LIMPEZA INICIAL
        // Para todos os timers em execução e limpa as mensagens anteriores
        timersRef.current.forEach(clearTimeout);
        timersRef.current = [];
        setMessages([]);
        setIsAnalyzing(true);

        const generateSummary = () => {
            const totalEvents = events.length;
            const totalViews = events.filter(
                (e: any) => e.event_type === "page_view"
            ).length;
            const qrScans = events.filter((e: any) => {
                const type =
                    e.event_type?.toLowerCase() || "";
                return (
                    type.includes("qr_") ||
                    [
                        "instagram",
                        "guizao",
                        "testes",
                    ].includes(type)
                );
            }).length;

            const convRate =
                totalViews > 0
                    ? (qrScans / totalViews) * 100
                    : 0;

            let convStatus = {
                label: "Média",
                color: "text-yellow-400",
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
                    label: "Boa",
                    color: "text-blue-400",
                    icon: <CheckCircle2 size={16} />,
                };

            const hourCounts = events.reduce(
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
                ? peakHourEntry[0]
                : "--";

            const steps: any[] = [
                {
                    id: "step-init",
                    text: "Sincronizando resumo inteligente...",
                    icon: <Terminal size={16} />,
                },
            ];

            if (totalEvents < 5) {
                steps.push({
                    id: "step-empty",
                    text: "Volume de dados insuficiente para gerar padrões. Continue divulgando.",
                    icon: (
                        <Bot
                            size={16}
                            className="text-zinc-600"
                        />
                    ),
                });
            } else {
                steps.push({
                    id: "step-conv",
                    text: `Taxa de conversão: ${convRate.toFixed(
                        1
                    )}% (${convStatus.label}).`,
                    icon: convStatus.icon,
                    color: convStatus.color,
                });
                steps.push({
                    id: "step-peak",
                    text: `Pico de atividade detectado às ${peakHour}:00h.`,
                    icon: <Clock size={16} />,
                });
                steps.push({
                    id: "step-action",
                    title: "Plano de Ação recomendado:",
                    isHighlight: true,
                    suggestions: [
                        {
                            label: "🎯 Principal",
                            text:
                                convRate < 10
                                    ? "Melhore o CTA."
                                    : `Poste às ${peakHour}:00h.`,
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

            // EXIBIÇÃO GRADUAL
            steps.forEach((step, index) => {
                const timer = setTimeout(() => {
                    setMessages((prev) => {
                        if (
                            prev.find(
                                (m) => m.id === step.id
                            )
                        )
                            return prev;
                        return [...prev, step];
                    });
                    if (index === steps.length - 1)
                        setIsAnalyzing(false);
                }, (index + 1) * 600);

                timersRef.current.push(timer);
            });
        };

        generateSummary();

        // 2. FUNÇÃO DE LIMPEZA (Cleanup)
        return () => {
            timersRef.current.forEach(clearTimeout);
        };
    }, [events]);

    return (
        <div className="max-w-2xl mx-auto font-mono pb-10">
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 min-h-[400px] flex flex-col gap-5">
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
                        ANALISANDO PADRÕES...
                    </div>
                )}
            </div>
        </div>
    );
}
