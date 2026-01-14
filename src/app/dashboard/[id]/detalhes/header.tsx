"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Calendar as CalendarIcon,
    RefreshCw,
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

    // Função para formatar data com segurança
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
            <nav className="flex gap-6">
                {["acessos", "cliques", "resumo"].map(
                    (t) => (
                        <button
                            key={t}
                            onClick={() => setActiveTab(t)}
                            className={`text-[11px] font-black uppercase tracking-widest pb-2 relative ${
                                activeTab === t
                                    ? "text-white"
                                    : "text-zinc-500 hover:text-zinc-300"
                            }`}
                        >
                            {t}
                            {activeTab === t && (
                                <motion.div
                                    layoutId="nav"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                                />
                            )}
                        </button>
                    )
                )}
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
