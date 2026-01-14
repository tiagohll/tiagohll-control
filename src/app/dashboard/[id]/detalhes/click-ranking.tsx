"use client";

import { useMemo } from "react";
import { MousePointer2 } from "lucide-react";
import { motion } from "framer-motion";

export function ClickRanking({
    events = [],
}: {
    events: any[];
}) {
    const ranking = useMemo(() => {
        const counts = events
            .filter((ev) => ev.event_type === "click")
            .reduce(
                (acc: Record<string, number>, ev: any) => {
                    // Mantendo sua lógica: o nome do botão vem do visitor_hash no clique
                    const label =
                        ev.visitor_hash || "BOTÃO SEM NOME";
                    acc[label] = (acc[label] || 0) + 1;
                    return acc;
                },
                {}
            );

        return Object.entries(counts).sort(
            (a, b) => b[1] - a[1]
        );
    }, [events]);

    const maxClicks = Number(ranking[0]?.[1] || 1);

    return (
        <div className="space-y-4">
            {/* Título no estilo do seu "LINKS MAIS ACESSADOS" */}
            <div className="flex items-center gap-2 px-2">
                <div className="bg-blue-500/10 p-1.5 rounded-lg">
                    <MousePointer2
                        size={14}
                        className="text-blue-500"
                    />
                </div>
                <h2 className="text-[11px] font-black uppercase tracking-widest text-white">
                    Ranking de Interações
                </h2>
            </div>

            {ranking.length === 0 ? (
                <div className="bg-[#0f0f10] border border-zinc-800/50 p-12 rounded-[2.5rem] text-center">
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-tighter">
                        Nenhum dado encontrado para este
                        período.
                    </p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {ranking.map(
                        ([label, count], index) => {
                            const currentCount =
                                Number(count);
                            const isFirst = index === 0;

                            return (
                                <div
                                    key={label}
                                    className="bg-[#0f0f10] border border-zinc-800/60 p-5 rounded-[2rem] relative overflow-hidden group"
                                >
                                    <div className="flex justify-between items-center relative z-10">
                                        <div className="flex items-center gap-4">
                                            {/* Badge de posição estilo seu botão de filtro (7D, 30D) */}
                                            <div
                                                className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${
                                                    isFirst
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-zinc-800 text-zinc-500"
                                                }`}
                                            >
                                                {index + 1}
                                            </div>
                                            <span className="text-[11px] font-black text-zinc-200 uppercase tracking-wider">
                                                {label.replace(
                                                    /-/g,
                                                    " "
                                                )}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-black text-white italic">
                                                {
                                                    currentCount
                                                }
                                            </span>
                                            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">
                                                Cliques
                                            </span>
                                        </div>
                                    </div>

                                    {/* Barra de progresso integrada ao fundo do card */}
                                    <motion.div
                                        initial={{
                                            width: 0,
                                        }}
                                        animate={{
                                            width: `${
                                                (currentCount /
                                                    maxClicks) *
                                                100
                                            }%`,
                                        }}
                                        className="absolute bottom-0 left-0 h-[2px] bg-blue-600/40"
                                    />
                                </div>
                            );
                        }
                    )}
                </div>
            )}
        </div>
    );
}
