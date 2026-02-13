"use client";

import { useState, useEffect } from "react";
import { Search, ChevronDown, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import FeedbackItem from "./feedback-item";

export default function FeedbacksPage() {
    const [feedbacks, setFeedbacks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Estados dos Filtros Customizados
    const [isChurnOpen, setIsChurnOpen] = useState(false);
    const [isValueOpen, setIsValueOpen] = useState(false);
    const [churnFilter, setChurnFilter] = useState("TODOS");
    const [perceivedValueFilter, setPerceivedValueFilter] =
        useState("TODOS");

    const churnOptions = [
        "TODOS",
        "MUITO GRANDE",
        "GRANDE",
        "MÉDIO",
        "PEQUENO",
        "NENHUM",
    ];
    const valueOptions = [
        "TODOS",
        "MUITO BEM",
        "BEM",
        "MAIS OU MENOS",
        "POUCO",
        "NADA",
    ];

    const supabase = createClient();

    // Utilitários de busca
    const normalizeText = (text: string) =>
        text
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();

    const flexibleSearch = (
        target: string,
        search: string
    ) => {
        const normalizedTarget = normalizeText(target);
        const searchWords = normalizeText(search)
            .split(/\s+/)
            .filter(Boolean);
        return searchWords.every((word) =>
            normalizedTarget.includes(word)
        );
    };

    useEffect(() => {
        async function loadFeedbacks() {
            setLoading(true);
            const { data, error } = await supabase
                .from("user_feedback")
                .select("*, sites(name)")
                .order("created_at", { ascending: false });

            if (!error && data) setFeedbacks(data);
            setLoading(false);
        }
        loadFeedbacks();
    }, []);

    // Lógica de Filtragem Tripla
    const filteredFeedbacks = feedbacks.filter((fb) => {
        const siteName =
            fb.sites?.name || "SITE DESCONHECIDO";
        const answers = fb.answers || {};

        // 1. Busca por nome (Independente de ordem ou acento)
        const matchesSearch = flexibleSearch(
            siteName,
            searchTerm
        );

        // 2. Filtro de Churn
        const churnVal = (
            answers.churn_impacto ||
            answers.uso_real ||
            ""
        ).toUpperCase();
        const matchesChurn =
            churnFilter === "TODOS" ||
            churnVal === churnFilter;

        // 3. Filtro de Valor Percebido
        const valueVal = (
            answers.valor_percebido || ""
        ).toUpperCase();
        const matchesValue =
            perceivedValueFilter === "TODOS" ||
            valueVal === perceivedValueFilter;

        return (
            matchesSearch && matchesChurn && matchesValue
        );
    });

    return (
        <div className="space-y-10 p-8">
            {/* HEADER E FILTROS */}
            <div className="flex flex-col xl:flex-row justify-between items-center xl:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                        Feedbacks recibidos
                        <span className="text-blue-600">
                            .
                        </span>
                    </h1>
                    <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mt-1">
                        {loading
                            ? "Sincronizando..."
                            : `${filteredFeedbacks.length} resultados encontrados`}
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto items-end">
                    {/* BUSCA */}
                    <div className="relative flex-1 md:w-80 group">
                        <label className="text-[9px] font-black uppercase text-zinc-600 ml-2 mb-2 block tracking-widest">
                            Pesquisar Site
                        </label>
                        <div className="relative">
                            <Search
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors"
                                size={18}
                            />
                            <input
                                type="text"
                                placeholder="EX: HADAR AGÊNCIA..."
                                className="w-full bg-[#0c0c0c] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-[10px] font-black uppercase text-white outline-none focus:border-blue-500/50 transition-all shadow-2xl"
                                onChange={(e) =>
                                    setSearchTerm(
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                    </div>

                    {/* FILTRO CHURN */}
                    <div className="relative w-full md:w-52">
                        <label className="text-[9px] font-black uppercase text-zinc-600 ml-2 mb-2 block tracking-widest">
                            Impacto Churn
                        </label>
                        <button
                            onClick={() => {
                                setIsChurnOpen(
                                    !isChurnOpen
                                );
                                setIsValueOpen(false);
                            }}
                            className="w-full bg-[#0c0c0c] border border-white/5 rounded-2xl p-4 text-white text-left flex justify-between items-center hover:border-blue-500/50 transition-all shadow-2xl"
                        >
                            <span className="font-bold text-[10px] uppercase tracking-widest text-zinc-300">
                                {churnFilter}
                            </span>
                            <ChevronDown
                                size={16}
                                className={`${isChurnOpen ? "rotate-180" : ""} transition-transform text-blue-500`}
                            />
                        </button>
                        <AnimatePresence>
                            {isChurnOpen && (
                                <motion.div
                                    initial={{
                                        opacity: 0,
                                        y: -10,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    exit={{
                                        opacity: 0,
                                        y: -10,
                                    }}
                                    className="absolute z-50 w-full mt-2 bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                                >
                                    {churnOptions.map(
                                        (opt) => (
                                            <button
                                                key={opt}
                                                onClick={() => {
                                                    setChurnFilter(
                                                        opt
                                                    );
                                                    setIsChurnOpen(
                                                        false
                                                    );
                                                }}
                                                className="w-full p-4 text-left hover:bg-blue-600 text-[10px] font-black uppercase text-zinc-400 hover:text-white border-b border-white/5 last:border-0 transition-colors"
                                            >
                                                {opt}
                                            </button>
                                        )
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* FILTRO VALOR */}
                    <div className="relative w-full md:w-52">
                        <label className="text-[9px] font-black uppercase text-zinc-600 ml-2 mb-2 block tracking-widest">
                            Valor Percebido
                        </label>
                        <button
                            onClick={() => {
                                setIsValueOpen(
                                    !isValueOpen
                                );
                                setIsChurnOpen(false);
                            }}
                            className="w-full bg-[#0c0c0c] border border-white/5 rounded-2xl p-4 text-white text-left flex justify-between items-center hover:border-blue-500/50 transition-all shadow-2xl"
                        >
                            <span className="font-bold text-[10px] uppercase tracking-widest text-zinc-300">
                                {perceivedValueFilter}
                            </span>
                            <ChevronDown
                                size={16}
                                className={`${isValueOpen ? "rotate-180" : ""} transition-transform text-blue-500`}
                            />
                        </button>
                        <AnimatePresence>
                            {isValueOpen && (
                                <motion.div
                                    initial={{
                                        opacity: 0,
                                        y: -10,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    exit={{
                                        opacity: 0,
                                        y: -10,
                                    }}
                                    className="absolute z-50 w-full mt-2 bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                                >
                                    {valueOptions.map(
                                        (opt) => (
                                            <button
                                                key={opt}
                                                onClick={() => {
                                                    setPerceivedValueFilter(
                                                        opt
                                                    );
                                                    setIsValueOpen(
                                                        false
                                                    );
                                                }}
                                                className="w-full p-4 text-left hover:bg-blue-600 text-[10px] font-black uppercase text-zinc-400 hover:text-white border-b border-white/5 last:border-0 transition-colors"
                                            >
                                                {opt}
                                            </button>
                                        )
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* GRID DE RESULTADOS */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2
                        className="animate-spin text-blue-600"
                        size={40}
                    />
                    <span className="text-zinc-600 font-black uppercase text-xs tracking-[0.4em]">
                        Sincronizando Base
                    </span>
                </div>
            ) : filteredFeedbacks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredFeedbacks.map((fb, idx) => (
                        <FeedbackItem
                            key={fb.id}
                            feedback={fb}
                            index={idx}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-[#0c0c0c] border border-dashed border-white/10 rounded-[3rem] p-20 text-center">
                    <p className="text-zinc-600 font-black uppercase text-sm tracking-widest">
                        Nenhum feedback corresponde aos
                        filtros
                    </p>
                </div>
            )}
        </div>
    );
}
