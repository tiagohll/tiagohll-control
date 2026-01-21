"use client";

import { useState } from "react";
import { X, Save, Shield, Globe } from "lucide-react";
import { updateUserSettings } from "../../lib/actions";
import { motion } from "framer-motion";
import { useToast } from "@/context/ToastContext";

export function AdminSettingsModal({
    profile,
    onClose,
}: {
    profile: any;
    onClose: () => void;
}) {
    const [limit, setLimit] = useState(
        profile.site_max_limit
    );
    const [isAdmin, setIsAdmin] = useState(
        profile.is_admin
    );
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const handleSave = async () => {
        setLoading(true);
        try {
            const result = await updateUserSettings(
                profile.id,
                { limit, isAdmin }
            );
            if (result.success) onClose();
            showToast(
                "Sucesso!",
                "success",
                "Configurações atualizadas."
            );
        } catch (error: any) {
            alert("ERRO: " + error.message);
            showToast(
                "Erro ao atualizar",
                "error",
                error.message
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Container */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{
                    type: "spring",
                    duration: 0.4,
                    bounce: 0.3,
                }}
                className="relative bg-zinc-950 border border-zinc-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
                {/* HEADER */}
                <div className="p-6 border-b border-zinc-900 flex justify-between items-center">
                    <h3 className="font-bold text-white">
                        Configurações de Usuário
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-zinc-900 rounded-full text-zinc-500 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                        <div className="h-10 w-10 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-500">
                            <Globe size={20} />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-white truncate">
                                {profile.email}
                            </p>
                            <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-tighter">
                                ID: {profile.id}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                            Limite de Sites
                        </label>
                        <input
                            type="number"
                            value={limit}
                            onChange={(e) =>
                                setLimit(
                                    parseInt(
                                        e.target.value
                                    ) || 0
                                )
                            }
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 transition-all font-bold"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                            Permissões
                        </label>
                        <button
                            onClick={() =>
                                setIsAdmin(!isAdmin)
                            }
                            className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${isAdmin ? "bg-blue-500/5 border-blue-500/20 text-blue-400" : "bg-zinc-900/20 border-zinc-800 text-zinc-500"}`}
                        >
                            <div className="flex gap-3 items-center text-sm font-bold uppercase tracking-tight">
                                <Shield
                                    size={18}
                                    className={
                                        isAdmin
                                            ? "text-blue-400"
                                            : "text-zinc-600"
                                    }
                                />
                                Acesso Administrador
                            </div>
                            <div
                                className={`h-5 w-10 rounded-full relative transition-colors ${isAdmin ? "bg-blue-500" : "bg-zinc-700"}`}
                            >
                                <motion.div
                                    animate={{
                                        x: isAdmin ? 20 : 4,
                                    }}
                                    className="absolute top-1 h-3 w-3 bg-white rounded-full shadow-sm"
                                    initial={false}
                                />
                            </div>
                        </button>
                    </div>
                </div>

                <div className="p-6 bg-zinc-900/20 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 text-sm font-bold text-zinc-500"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex-1 py-3 bg-white text-black rounded-xl text-sm font-black hover:bg-zinc-200 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            "Processando..."
                        ) : (
                            <>
                                <Save size={16} /> Salvar
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
