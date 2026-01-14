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
                    const label =
                        ev.element_id ||
                        ev.element_text ||
                        "Botão sem nome";
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
            <div className="flex items-center gap-2 mb-6">
                <MousePointer2
                    size={18}
                    className="text-blue-500"
                />
                <h2 className="text-sm font-black uppercase tracking-widest text-white">
                    Ranking de Cliques
                </h2>
            </div>

            {ranking.length === 0 ? (
                <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl text-center">
                    <p className="text-zinc-500 text-xs font-bold uppercase">
                        Nenhum clique registrado
                    </p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {ranking.map(
                        ([label, count], index) => {
                            const currentCount =
                                Number(count);
                            return (
                                <div
                                    key={label}
                                    className="bg-zinc-900/40 border border-zinc-800/50 p-4 rounded-2xl relative overflow-hidden"
                                >
                                    <div className="flex justify-between items-center relative z-10">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-black text-zinc-600">
                                                #{index + 1}
                                            </span>
                                            <span className="text-xs font-bold text-zinc-200 uppercase">
                                                {label}
                                            </span>
                                        </div>
                                        <span className="text-sm font-black text-white">
                                            {currentCount}
                                        </span>
                                    </div>
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
                                        className="absolute bottom-0 left-0 h-1 bg-blue-600/30 rounded-full"
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
