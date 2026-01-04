"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Sparkles, Globe, Layout } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Ativando...",
    description:
        "Quase lá! Vamos configurar o motor de busca para seu site.",
};

export default function SetupForm({ site }: { site: any }) {
    const supabase = createClient();
    const router = useRouter();

    const [name, setName] = useState(site.name || "");
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (site?.name) {
            document.title = `${site.name} - Dashboard`;
        }
    }, [site?.name]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const cleanUrl = url.trim().replace(/\/$/, "");
            if (!cleanUrl.startsWith("http")) {
                setError(
                    "A URL deve começar com http:// ou https://"
                );
                setLoading(false);
                return;
            }

            const { error: updateError } = await supabase
                .from("sites")
                .update({ name, url: cleanUrl })
                .eq("id", site.id);

            if (updateError) throw updateError;

            router.refresh();
            setTimeout(() => {
                router.push(`/dashboard/sites/${site.id}`);
            }, 500);
        } catch (err: any) {
            setError(err.message || "Erro inesperado.");
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-4">
                {/* Input Nome */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                        <Layout size={14} /> Nome do Projeto
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        placeholder="Meu Site Incrível"
                        required
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    />
                </div>

                {/* Input URL */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                        <Globe size={14} /> URL de Produção
                    </label>
                    <input
                        type="url"
                        value={url}
                        onChange={(e) =>
                            setUrl(e.target.value)
                        }
                        placeholder="https://exemplo.com.br"
                        required
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    />
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 group"
            >
                {loading ? (
                    <div className="h-5 w-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                    <>
                        Ativar Rastreamento{" "}
                        <Sparkles
                            size={18}
                            className="group-hover:rotate-12 transition-transform"
                        />
                    </>
                )}
            </button>

            <p className="text-[10px] text-center text-zinc-600 uppercase tracking-tighter">
                Ao finalizar, você receberá o script de
                instalação.
            </p>
        </form>
    );
}
