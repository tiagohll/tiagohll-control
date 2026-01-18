"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Calendar as CalendarIcon,
    RefreshCw,
    Sparkles, // Novo ícone para a IA
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export function HeaderNavigation({
    range,
    setRange,
    activeTab,
    setActiveTab,
    handleRefresh,
    isRefreshing,
}: any) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isCustom = range.includes("-");

    const getFormattedDate = () => {
        if (!isCustom) return "Data";
        try {
            return format(
                new Date(range + "T12:00:00"),
                "dd/MM",
                { locale: ptBR }
            );
        } catch (e) {
            return "Data";
        }
    };

    return (
        <header className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-zinc-800/50 pb-6">
            <nav className="flex items-center gap-2 bg-zinc-900/50 p-1 rounded-2xl border border-zinc-800/50">
                {["acessos", "cliques"].map((t) => (
                    <button
                        key={t}
                        onClick={() => setActiveTab(t)}
                        className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                            activeTab === t
                                ? "bg-zinc-800 text-white shadow-sm"
                                : "text-zinc-500 hover:text-zinc-300"
                        }`}
                    >
                        {t}
                    </button>
                ))}

                {/* Botão de Resumo Especial - Tema Azul/Zinc */}
                <button
                    onClick={() => setActiveTab("resumo")}
                    className="relative group p-[2px] rounded-xl overflow-hidden transition-all active:scale-95 flex items-center justify-center"
                >
                    {/* A Borda Giratória (Sutil no hover, intensa quando ativo) */}
                    <div
                        className={`absolute inset-[-1000%] animate-shimmer-spin bg-ia-gradient
                        ${activeTab === "resumo" ? "opacity-100" : "opacity-0 group-hover:opacity-40"} 
                        transition-opacity duration-500`}
                    />

                    {/* O Conteúdo do Botão */}
                    <div
                        className={`relative flex items-center gap-2 px-5 py-2 rounded-[11px] text-[11px] font-black uppercase tracking-widest z-10 
                        ${
                            activeTab === "resumo"
                                ? "bg-zinc-950 text-blue-400"
                                : "bg-zinc-900 text-zinc-500 group-hover:text-zinc-200"
                        } 
                        transition-colors duration-300 w-full h-full`}
                    >
                        <Sparkles
                            size={14}
                            className={`${activeTab === "resumo" ? "text-blue-400 animate-pulse" : "text-zinc-600 group-hover:text-blue-500"}`}
                        />
                        <span className="relative z-20">
                            Resumo IA
                        </span>

                        {/* Brilho de Fundo (Glow) quando ativo */}
                        {activeTab === "resumo" && (
                            <div className="absolute inset-0 bg-blue-500/10 blur-lg rounded-full" />
                        )}
                    </div>
                </button>
            </nav>

            <div className="flex items-center gap-3">
                <div className="flex items-center bg-zinc-900 border border-zinc-800 p-1 rounded-2xl shadow-inner">
                    {["7d", "30d", "all"].map((r) => (
                        <button
                            key={r}
                            onClick={() => setRange(r)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${
                                range === r
                                    ? "bg-zinc-800 text-white shadow-md"
                                    : "text-zinc-500 hover:text-zinc-300"
                            }`}
                        >
                            {r === "all"
                                ? "TUDO"
                                : r.toUpperCase()}
                        </button>
                    ))}

                    {mounted && (
                        <Popover>
                            <PopoverTrigger asChild>
                                <button
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                                        isCustom
                                            ? "bg-blue-500/10 border-blue-500/50 text-blue-400"
                                            : "border-transparent text-zinc-500"
                                    }`}
                                >
                                    <CalendarIcon
                                        size={14}
                                    />
                                    <span className="text-[10px] font-black uppercase">
                                        {getFormattedDate()}
                                    </span>
                                </button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto p-0 bg-zinc-950 border-zinc-800 text-white"
                                align="end"
                            >
                                <Calendar
                                    mode="single"
                                    selected={
                                        isCustom
                                            ? new Date(
                                                  range +
                                                      "T12:00:00"
                                              )
                                            : undefined
                                    }
                                    onSelect={(d) =>
                                        d &&
                                        setRange(
                                            format(
                                                d,
                                                "yyyy-MM-dd"
                                            )
                                        )
                                    }
                                    locale={ptBR}
                                />
                            </PopoverContent>
                        </Popover>
                    )}
                </div>

                <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white transition-all"
                >
                    <motion.div
                        animate={
                            isRefreshing
                                ? { rotate: 360 }
                                : { rotate: 0 }
                        }
                        transition={{
                            repeat: isRefreshing
                                ? Infinity
                                : 0,
                            duration: 1,
                            ease: "linear",
                        }}
                    >
                        <RefreshCw size={16} />
                    </motion.div>
                </button>
            </div>
        </header>
    );
}
