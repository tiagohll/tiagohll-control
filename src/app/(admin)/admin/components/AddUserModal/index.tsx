"use client";

import { useState } from "react";
import {
    X,
    UserPlus,
    Shield,
    Mail,
    Key,
    Eye,
    EyeOff,
} from "lucide-react";
import { motion } from "framer-motion";
import { addUser } from "../../lib/actions";
import { useToast } from "@/context/ToastContext";

export function AddUserModal({
    onClose,
}: {
    onClose: () => void;
}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [limit, setLimit] = useState(1);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const handleSave = async () => {
        if (!email.includes("@"))
            return alert("E-mail inválido.");
        if (password.length < 6)
            return alert(
                "A senha deve ter no mínimo 6 caracteres."
            );

        setLoading(true);
        try {
            const result = await addUser({
                email,
                limit,
                isAdmin,
                password,
            });
            if (result.success) {
                showToast(
                    "Sucesso!",
                    "success",
                    "Usuário criado com sucesso."
                );
                onClose();
            }
        } catch (error: any) {
            showToast(
                "Erro ao criar",
                "error",
                error.message
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative bg-zinc-950 border border-zinc-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
                <div className="p-6 border-b border-zinc-900 flex justify-between items-center text-white">
                    <h3 className="font-bold flex items-center gap-2">
                        <UserPlus
                            size={20}
                            className="text-blue-500"
                        />{" "}
                        Novo Usuário
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-zinc-900 rounded-full text-zinc-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {/* E-MAIL */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                            E-mail
                        </label>
                        <div className="relative">
                            <Mail
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
                                size={18}
                            />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 pl-10 text-white focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* SENHA */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                            Senha
                        </label>
                        <div className="relative">
                            <Key
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
                                size={18}
                            />
                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                value={password}
                                onChange={(e) =>
                                    setPassword(
                                        e.target.value
                                    )
                                }
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 pl-10 text-white focus:border-blue-500 outline-none transition-all"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white"
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* LIMITE (Corrigido para não aceitar negativo e sem setas) */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                            Limite de Sites
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={limit}
                            onChange={(e) =>
                                setLimit(
                                    Math.max(
                                        0,
                                        parseInt(
                                            e.target.value
                                        ) || 0
                                    )
                                )
                            }
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                    </div>

                    {/* ADMIN TOGGLE */}
                    <button
                        type="button"
                        onClick={() => setIsAdmin(!isAdmin)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${isAdmin ? "bg-blue-500/5 border-blue-500/20 text-blue-400" : "bg-zinc-900/20 border-zinc-800 text-zinc-500"}`}
                    >
                        <div className="flex gap-3 items-center text-sm font-bold uppercase tracking-tight">
                            <Shield size={18} /> Admin
                        </div>
                        <div
                            className={`h-5 w-10 rounded-full relative transition-colors ${isAdmin ? "bg-blue-500" : "bg-zinc-700"}`}
                        >
                            <motion.div
                                animate={{
                                    x: isAdmin ? 20 : 4,
                                }}
                                className="absolute top-1 h-3 w-3 bg-white rounded-full"
                            />
                        </div>
                    </button>
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
                        className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm font-black hover:bg-blue-500 disabled:opacity-50 transition-all"
                    >
                        {loading
                            ? "Processando..."
                            : "Criar e Confirmar"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
