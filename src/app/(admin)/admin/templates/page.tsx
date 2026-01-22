"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Plus,
    Clock,
    Layers,
    CheckCircle2,
} from "lucide-react";
import { AddTemplateModal } from "./new-template-modal";
import { createClient } from "@/lib/supabase/client";

export default function TemplatesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [templates, setTemplates] = useState<any[]>([]);
    const supabase = createClient();

    useEffect(() => {
        async function loadTemplates() {
            const { data } = await supabase
                .from("service_templates")
                .select("*")
                .order("price", { ascending: true });
            if (data) setTemplates(data);
        }
        loadTemplates();

        const channel = supabase
            .channel("realtime_templates")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "service_templates",
                },
                loadTemplates
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return (
        <div className="p-4 md:p-8 space-y-8 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter text-center md:text-left leading-none">
                        Templates de{" "}
                        <span className="text-blue-500">
                            Serviço
                        </span>
                    </h1>
                    <p className="text-zinc-500 font-medium uppercase text-[9px] tracking-[2px] mt-3 text-center md:text-left opacity-70">
                        Sua vitrine de pacotes padrão
                        configurada
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full md:w-auto bg-white text-black px-8 py-4 rounded-2xl font-black uppercase text-xs hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl"
                >
                    <Plus size={18} /> Novo Template
                </button>
            </div>

            <AddTemplateModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {templates.map((tpl, idx) => (
                    <motion.div
                        key={tpl.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-[#0c0c0c] border border-white/5 rounded-[2.5rem] p-6 md:p-8 relative overflow-hidden flex flex-col group hover:border-blue-500/30 transition-all duration-500"
                    >
                        {/* Tag THLL */}
                        {tpl.has_thll_control && (
                            <div className="absolute top-5 right-5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full z-10">
                                <span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest whitespace-nowrap">
                                    THLL Incluso
                                </span>
                            </div>
                        )}

                        <div className="relative mb-6">
                            <h3 className="text-xl md:text-2xl font-black text-white uppercase leading-[1.1] mb-2 pr-12">
                                {tpl.name}
                            </h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-white font-black text-3xl tracking-tighter">
                                    R$ {tpl.price}
                                </span>
                                <span className="text-zinc-600 text-[9px] font-black uppercase tracking-widest">
                                    / único
                                </span>
                            </div>
                        </div>

                        {/* Grid de Informações Técnicas */}
                        <div className="grid grid-cols-2 gap-3 mb-8">
                            <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center">
                                <Clock
                                    size={18}
                                    className="text-blue-500 mb-2 opacity-80"
                                />
                                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-tighter">
                                    Entrega
                                </span>
                                <span className="text-[11px] font-black text-white uppercase">
                                    {tpl.delivery_days} Dias
                                </span>
                            </div>
                            <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center">
                                <Layers
                                    size={18}
                                    className="text-blue-500 mb-2 opacity-80"
                                />
                                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-tighter">
                                    Escopo
                                </span>
                                <span className="text-[11px] font-black text-white uppercase">
                                    {tpl.pages_count}{" "}
                                    Páginas
                                </span>
                            </div>
                        </div>

                        {/* Lista de Features com Scroll se for muito grande */}
                        <div className="space-y-3 pt-6 border-t border-white/5 flex-1 overflow-y-auto max-h-[200px] custom-scrollbar">
                            {tpl.features?.map(
                                (f: string, i: number) => (
                                    <div
                                        key={i}
                                        className="flex items-start gap-3 group/item"
                                    >
                                        <CheckCircle2
                                            size={14}
                                            className="text-blue-500 mt-0.5 shrink-0 transition-transform group-hover/item:scale-110"
                                        />
                                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight leading-tight group-hover/item:text-zinc-200 transition-colors">
                                            {f}
                                        </span>
                                    </div>
                                )
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
