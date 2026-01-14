"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
    Bot,
    Terminal,
    MousePointer2,
    Clock,
    Percent,
} from "lucide-react";

export function SystemSummary({ allEvents }: any) {
    const [messages, setMessages] = useState<any[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(true);
    const analysisDone = useRef(false);

    useEffect(() => {
        if (analysisDone.current) return;
        analysisDone.current = true;

        const generateSummary = () => {
            const buttonClicks = allEvents
                .filter(
                    (e: any) => e.event_type === "click"
                )
                .reduce((acc: any, e: any) => {
                    acc[e.visitor_hash] =
                        (acc[e.visitor_hash] || 0) + 1;
                    return acc;
                }, {});
            const topButtons = Object.entries(buttonClicks)
                .sort((a: any, b: any) => b[1] - a[1])
                .slice(0, 3);

            const hours = allEvents.map((e: any) =>
                new Date(e.created_at).getHours()
            );
            const hourCounts = hours.reduce(
                (acc: any, h: number) => {
                    acc[h] = (acc[h] || 0) + 1;
                    return acc;
                },
                {}
            );
            const peakHour = Object.entries(
                hourCounts
            ).sort((a: any, b: any) => b[1] - a[1])[0];

            const totalViews = allEvents.filter(
                (e: any) => e.event_type === "page_view"
            ).length;
            const qrScans = allEvents.filter((e: any) =>
                e.event_type?.startsWith("qr_")
            ).length;
            const convRate =
                totalViews > 0
                    ? (
                          (qrScans / totalViews) *
                          100
                      ).toFixed(1)
                    : "0";

            const steps = [
                {
                    id: "init",
                    text: "Iniciando varredura no banco de dados...",
                    icon: <Terminal size={16} />,
                },
                {
                    id: "count",
                    text: `Análise concluída. Total de ${allEvents.length} eventos processados hoje.`,
                    icon: <Bot size={16} />,
                },
                {
                    id: "peak",
                    text: peakHour
                        ? `O horário de maior atividade foi às ${peakHour[0]}:00h com ${peakHour[1]} interações.`
                        : "Não há dados de horário suficientes.",
                    icon: <Clock size={16} />,
                },
                {
                    id: "conv",
                    text: `Sua taxa de conversão via QR Code é de ${convRate}%.`,
                    icon: <Percent size={16} />,
                },
                {
                    id: "btns",
                    title: "Ranking de Cliques:",
                    items:
                        topButtons.length > 0
                            ? topButtons.map(
                                  ([name, count]) =>
                                      `${name}: ${count} cliques`
                              )
                            : ["Nenhum clique registrado."],
                    icon: <MousePointer2 size={16} />,
                },
            ];

            steps.forEach((step, index) => {
                setTimeout(() => {
                    setMessages((prev) => [...prev, step]);
                    if (index === steps.length - 1)
                        setIsAnalyzing(false);
                }, (index + 1) * 800);
            });
        };

        generateSummary();
    }, [allEvents]);

    return (
        <div className="max-w-2xl mx-auto space-y-4 font-mono">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 min-h-[450px] flex flex-col gap-4 overflow-hidden">
                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex gap-3"
                    >
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                            {msg.icon}
                        </div>
                        <div className="space-y-2">
                            {msg.text && (
                                <p className="text-zinc-300 text-sm leading-relaxed pt-1.5">
                                    {msg.text}
                                </p>
                            )}
                            {msg.title && (
                                <p className="text-zinc-300 text-sm font-bold pt-1.5">
                                    {msg.title}
                                </p>
                            )}
                            {msg.items && (
                                <ul className="space-y-1">
                                    {msg.items.map(
                                        (
                                            item: string,
                                            i: number
                                        ) => (
                                            <li
                                                key={i}
                                                className="text-xs text-zinc-500 flex items-center gap-2"
                                            >
                                                <div className="w-1 h-1 bg-zinc-700 rounded-full" />
                                                {item}
                                            </li>
                                        )
                                    )}
                                </ul>
                            )}
                        </div>
                    </motion.div>
                ))}

                {isAnalyzing && (
                    <div className="flex items-center gap-2 text-zinc-600 text-[10px] mt-4">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                        PROCESSANDO MÉTRICAS...
                    </div>
                )}
            </div>
        </div>
    );
}
