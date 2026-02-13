"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import FeedbackItem from "./feedback-item";
import { Search, Loader2 } from "lucide-react";

export default function FeedbackList() {
    const [searchTerm, setSearchTerm] = useState("");
    const [feedbacks, setFeedbacks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const supabase = createClient();

    async function loadFeedbacks() {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("user_feedback")
                .select("*, sites ( name )")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setFeedbacks(data || []);
        } catch (error) {
            console.error(
                "Erro ao carregar feedbacks:",
                error
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadFeedbacks();
    }, []);

    // Filtro simplificado para evitar que itens sumam por falta de chaves específicas
    const filteredData = feedbacks.filter((f) => {
        const siteName = f.sites?.name?.toLowerCase() || "";
        return siteName.includes(searchTerm.toLowerCase());
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                        Feedbacks{" "}
                        <span className="text-blue-600">
                            .
                        </span>
                    </h1>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">
                        {filteredData.length} avaliações
                        encontradas
                    </p>
                </div>

                <div className="relative w-full md:w-80 group">
                    <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                        size={16}
                    />
                    <input
                        placeholder="BUSCAR POR SITE..."
                        className="w-full bg-[#0c0c0c] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-[10px] font-black uppercase text-white outline-none focus:border-blue-500/50 transition-all tracking-widest"
                        onChange={(e) =>
                            setSearchTerm(e.target.value)
                        }
                    />
                </div>
            </div>

            <div className="bg-[#0c0c0c] border border-white/5 rounded-[2.5rem] overflow-hidden">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.02]">
                            <th className="p-6 text-left text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                                Site / Data
                            </th>
                            <th className="p-6 text-left text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                                Respostas (JSON Desmontado)
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={2}
                                    className="p-20 text-center text-zinc-600 font-black uppercase text-xs tracking-widest"
                                >
                                    <Loader2
                                        className="animate-spin inline mr-2"
                                        size={16}
                                    />{" "}
                                    Carregando base...
                                </td>
                            </tr>
                        ) : filteredData.length > 0 ? (
                            filteredData.map(
                                (item, idx) => (
                                    <FeedbackItem
                                        key={item.id}
                                        feedback={item}
                                        index={idx}
                                    />
                                )
                            )
                        ) : (
                            <tr>
                                <td
                                    colSpan={2}
                                    className="p-20 text-center text-zinc-600 font-black uppercase text-xs tracking-widest"
                                >
                                    Nenhum feedback visível
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
