"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
    Sparkles,
    Globe,
    Layout,
    AlertCircle,
    X,
} from "lucide-react";

interface SetupFormProps {
    site: any;
    isNew?: boolean; // Nova prop para saber se estamos criando ou editando
    onClose?: () => void; // Para fechar o modal após sucesso
}

export default function SetupForm({
    site,
    isNew = false,
    onClose,
}: SetupFormProps) {
    const supabase = createClient();
    const router = useRouter();

    const [name, setName] = useState(site.name || "");
    const [url, setUrl] = useState(site.url || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const cleanUrl = url.trim().replace(/\/$/, "");
            if (!cleanUrl.startsWith("http")) {
                throw new Error(
                    "A URL deve começar com http:// ou https://"
                );
            }

            // Pegar o ID do usuário logado (necessário para o Insert)
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user)
                throw new Error("Usuário não autenticado.");

            let resultError;

            if (isNew) {
                // LÓGICA DE CRIAÇÃO (INSERT)
                const { error: insertError } =
                    await supabase.from("sites").insert({
                        name,
                        url: cleanUrl,
                        user_id: user.id,
                    });
                resultError = insertError;
            } else {
                // LÓGICA DE ATUALIZAÇÃO (UPDATE)
                const { error: updateError } =
                    await supabase
                        .from("sites")
                        .update({ name, url: cleanUrl })
                        .eq("id", site.id);
                resultError = updateError;
            }

            if (resultError) throw resultError;

            router.refresh();

            // Se tiver onClose (modal), fecha. Se não, redireciona.
            if (onClose) {
                onClose();
            } else {
                router.push(`/dashboard/sites/${site.id}`);
            }
        } catch (err: any) {
            setError(err.message || "Erro inesperado.");
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto relative">
            <div className="mb-10 text-center">
                <div className="inline-flex p-3 bg-blue-500/10 text-blue-500 rounded-2xl mb-4 border border-blue-500/20">
                    <Globe size={24} />
                </div>
                <h2 className="text-2xl font-black tracking-tight text-white">
                    {isNew
                        ? "Novo Projeto"
                        : "Configurar Projeto"}
                </h2>
                <p className="text-zinc-500 text-sm mt-2 font-medium px-6">
                    {isNew
                        ? "Preencha os dados abaixo para criar seu novo rastreamento."
                        : "Insira os detalhes técnicos para iniciar a coleta de dados."}
                </p>
            </div>

            <form
                onSubmit={handleSave}
                className="space-y-8"
            >
                <div className="space-y-6">
                    {/* Campo Nome */}
                    <div className="group space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 group-focus-within:text-blue-500 transition-colors flex items-center gap-2">
                            <Layout size={12} />{" "}
                            Identificação do Site
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            placeholder="Ex: Minha Loja Virtual"
                            required
                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-all placeholder:text-zinc-700 font-medium"
                        />
                    </div>

                    {/* Campo URL */}
                    <div className="group space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 group-focus-within:text-blue-500 transition-colors flex items-center gap-2">
                            <Globe size={12} /> URL de
                            Domínio
                        </label>
                        <input
                            type="url"
                            value={url}
                            onChange={(e) =>
                                setUrl(e.target.value)
                            }
                            placeholder="https://meusite.com.br"
                            required
                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-all placeholder:text-zinc-700 font-medium font-mono text-sm"
                        />
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-3 bg-red-500/5 border border-red-500/20 text-red-400 text-[11px] font-bold p-4 rounded-2xl animate-in fade-in zoom-in-95">
                        <AlertCircle
                            size={16}
                            className="shrink-0"
                        />
                        {error}
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95 shadow-xl shadow-white/5 uppercase text-xs tracking-widest"
                    >
                        {loading ? (
                            <div className="h-5 w-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        ) : (
                            <>
                                {isNew
                                    ? "Criar Projeto"
                                    : "Finalizar Setup"}
                                <Sparkles size={16} />
                            </>
                        )}
                    </button>

                    {isNew && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full bg-transparent text-zinc-500 font-bold py-2 rounded-xl hover:text-white transition-all text-[10px] uppercase tracking-widest"
                        >
                            Cancelar
                        </button>
                    )}
                </div>

                <p className="text-[9px] text-center text-zinc-600 uppercase tracking-widest font-bold">
                    Segurança ponta-a-ponta por THLL Control
                </p>
            </form>
        </div>
    );
}
