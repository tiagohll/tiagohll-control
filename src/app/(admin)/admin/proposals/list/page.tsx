"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    Search,
    MessageCircle,
    Copy,
    Calendar,
    User,
} from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function ProposalsListPage() {
    const supabase = createClient();
    const { showToast } = useToast();
    const [proposals, setProposals] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProposals();
    }, []);

    async function fetchProposals() {
        setLoading(true);
        const { data, error } = await supabase
            .from("proposals")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            showToast(
                "Erro",
                "error",
                "Não foi possível carregar as propostas."
            );
        } else {
            setProposals(data || []);
        }
        setLoading(false);
    }

    const handleSendWhatsApp = (
        whatsapp: string,
        content: string
    ) => {
        const cleanNumber = whatsapp.replace(/\D/g, "");
        window.open(
            `https://wa.me/55${cleanNumber}?text=${encodeURIComponent(content)}`,
            "_blank"
        );
    };

    const handleCopy = (content: string) => {
        navigator.clipboard.writeText(content);
        showToast(
            "Copiado!",
            "success",
            "Termo copiado para a área de transferência."
        );
    };

    const filteredProposals = proposals.filter((p) =>
        p.client_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
                    Minhas{" "}
                    <span className="text-blue-500">
                        Propostas
                    </span>
                </h1>

                <div className="relative">
                    <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Buscar cliente..."
                        className="bg-zinc-900 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white text-sm outline-none focus:border-blue-500 min-w-[300px]"
                        onChange={(e) =>
                            setSearchTerm(e.target.value)
                        }
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-zinc-500 font-bold animate-pulse">
                    Carregando propostas...
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProposals.map((proposal) => (
                        <div
                            key={proposal.id}
                            className="bg-zinc-900/40 border border-white/5 rounded-[2rem] p-6 hover:border-blue-500/30 transition-all group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-zinc-500">
                                        <Calendar
                                            size={12}
                                        />
                                        <span className="text-[10px] font-bold uppercase">
                                            {new Date(
                                                proposal.created_at
                                            ).toLocaleDateString(
                                                "pt-BR"
                                            )}
                                        </span>
                                    </div>
                                    <h3 className="text-white font-black uppercase text-lg leading-tight">
                                        {
                                            proposal.client_name
                                        }
                                    </h3>
                                </div>
                                <div className="bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                                    R${" "}
                                    {proposal.total_price}
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-2 text-zinc-400 text-xs">
                                    <User
                                        size={14}
                                        className="text-zinc-600"
                                    />
                                    {proposal.client_city} /{" "}
                                    {proposal.client_state}
                                </div>
                                <div className="flex items-center gap-2 text-zinc-400 text-xs">
                                    <MessageCircle
                                        size={14}
                                        className="text-zinc-600"
                                    />
                                    {
                                        proposal.client_whatsapp
                                    }
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() =>
                                        handleCopy(
                                            proposal.content
                                        )
                                    }
                                    className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-xl text-[10px] font-black uppercase transition-all"
                                >
                                    <Copy size={14} />{" "}
                                    Copiar
                                </button>
                                <button
                                    onClick={() =>
                                        handleSendWhatsApp(
                                            proposal.client_whatsapp,
                                            proposal.content
                                        )
                                    }
                                    className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl text-[10px] font-black uppercase transition-all"
                                >
                                    <MessageCircle
                                        size={14}
                                    />{" "}
                                    WhatsApp
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {filteredProposals.length === 0 && !loading && (
                <div className="text-center py-20 bg-zinc-900/20 rounded-[3rem] border border-dashed border-white/10">
                    <p className="text-zinc-500 font-bold uppercase text-sm tracking-widest">
                        Nenhuma proposta encontrada
                    </p>
                </div>
            )}
        </div>
    );
}
