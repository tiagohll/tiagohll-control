"use client";

import { useMemo, useState } from "react";
import {
    MousePointer2,
    Search,
    ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ClickRanking({
    events = [],
}: {
    events: any[];
}) {
    const [searchTerm, setSearchTerm] = useState("");

    // Processamento do Ranking com Filtro
    const ranking = useMemo(() => {
        const counts = events
            .filter((ev) => ev.event_type === "click")
            .reduce(
                (acc: Record<string, number>, ev: any) => {
                    const label =
                        ev.visitor_hash || "BOTÃO SEM NOME";
                    acc[label] = (acc[label] || 0) + 1;
                    return acc;
                },
                {}
            );

        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .filter(([label]) =>
                label
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            );
    }, [events, searchTerm]);

    const maxClicks = Number(ranking[0]?.[1] || 1);
    const totalClicks = events.filter(
        (ev) => ev.event_type === "click"
    ).length;

    return (
        <div className="flex flex-col h-full space-y-4">
            {/* Header com Busca */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-500/10 p-1.5 rounded-lg">
                        <MousePointer2
                            size={14}
                            className="text-blue-500"
                        />
                    </div>
                    <h2 className="text-[11px] font-black uppercase tracking-widest text-white">
                        Ranking de Interações
                    </h2>
                    <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded-full text-zinc-400 font-bold">
                        {totalClicks} total
                    </span>
                </div>

                {/* Barra de Pesquisa */}
                <div className="relative group">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors"
                        size={12}
                    />
                    <input
                        type="text"
                        placeholder="Buscar ID ou Data-Track..."
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(e.target.value)
                        }
                        className="bg-[#0f0f10] border border-zinc-800/60 rounded-xl py-2 pl-9 pr-4 text-[10px] text-zinc-200 focus:outline-none focus:border-blue-500/50 w-full md:w-64 transition-all"
                    />
                </div>
            </div>

            {/* Container com Scroll Limitado */}
            <div className="relative flex-1 min-h-[400px] max-h-[600px] overflow-y-auto pr-2 custom-scroll">
                {ranking.length === 0 ? (
                    <div className="bg-[#0f0f10] border border-zinc-800/50 p-12 rounded-[2.5rem] text-center">
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-tighter">
                            {searchTerm
                                ? "Nenhum botão corresponde à busca."
                                : "Nenhum dado encontrado."}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-2">
                        <AnimatePresence mode="popLayout">
                            {ranking.map(
                                ([label, count], index) => {
                                    const currentCount =
                                        Number(count);
                                    const isFirst =
                                        index === 0 &&
                                        !searchTerm;
                                    const percentage = (
                                        (currentCount /
                                            totalClicks) *
                                        100
                                    ).toFixed(1);

                                    return (
                                        <motion.div
                                            layout
                                            initial={{
                                                opacity: 0,
                                                y: 10,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                            }}
                                            exit={{
                                                opacity: 0,
                                                scale: 0.95,
                                            }}
                                            key={label}
                                            className="bg-[#0f0f10] border border-zinc-800/40 p-4 rounded-2xl relative overflow-hidden group hover:border-zinc-700/60 transition-colors"
                                        >
                                            <div className="flex justify-between items-center relative z-10">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black ${
                                                            isFirst
                                                                ? "bg-blue-600 text-white"
                                                                : "bg-zinc-800 text-zinc-500"
                                                        }`}
                                                    >
                                                        {index +
                                                            1}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-black text-zinc-200 uppercase tracking-wide truncate max-w-[150px] md:max-w-[300px]">
                                                            {label.replace(
                                                                /-/g,
                                                                " "
                                                            )}
                                                        </span>
                                                        <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter">
                                                            ID:{" "}
                                                            {
                                                                label
                                                            }
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <div className="flex items-center gap-1 justify-end">
                                                            <span className="text-sm font-black text-white italic leading-none">
                                                                {
                                                                    currentCount
                                                                }
                                                            </span>
                                                            <ArrowRight
                                                                size={
                                                                    10
                                                                }
                                                                className="text-zinc-700"
                                                            />
                                                        </div>
                                                        <span className="text-[9px] font-bold text-blue-500/80 uppercase tracking-tighter">
                                                            {
                                                                percentage
                                                            }

                                                            %
                                                            do
                                                            total
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Barra de progresso sutil */}
                                            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-zinc-900">
                                                <motion.div
                                                    initial={{
                                                        width: 0,
                                                    }}
                                                    animate={{
                                                        width: `${(currentCount / maxClicks) * 100}%`,
                                                    }}
                                                    className="h-full bg-blue-600/30"
                                                />
                                            </div>
                                        </motion.div>
                                    );
                                }
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
