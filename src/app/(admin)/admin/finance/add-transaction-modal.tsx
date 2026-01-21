"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, DollarSign, Tag, FileText } from "lucide-react";
import { addTransaction } from "../lib/actions";

export function AddTransactionModal({
    isOpen,
    onClose,
}: any) {
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState("income");

    async function handleSubmit(
        e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            description: formData.get("description"),
            amount: parseFloat(
                formData.get("amount") as string
            ),
            category: formData.get("category"),
            type: type,
        };

        try {
            await addTransaction(data);
            onClose();
        } catch (err) {
            console.error(err);
            alert("Erro ao salvar lançamento.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Overlay com Fade Out */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal com Slide Down e Scale Out */}
                    <motion.div
                        key="finance-modal-container" // KEY OBRIGATÓRIA PARA ANIMATEPRESENCE
                        initial={{
                            scale: 0.9,
                            opacity: 0,
                            y: 20,
                        }}
                        animate={{
                            scale: 1,
                            opacity: 1,
                            y: 0,
                        }}
                        exit={{
                            scale: 0.85,
                            opacity: 0,
                            y: 40,
                        }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 300,
                        }}
                        className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">
                                Novo Lançamento
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/5 rounded-full transition-colors"
                            >
                                <X
                                    size={20}
                                    className="text-zinc-500"
                                />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >
                            {/* Toggle Tipo com Efeito Slide */}
                            <div className="relative flex p-1 bg-black/40 rounded-2xl border border-white/5">
                                {/* Pílula Deslizante */}
                                <motion.div
                                    layoutId="activeTab"
                                    transition={{
                                        type: "spring",
                                        duration: 0.5,
                                        bounce: 0.2,
                                    }}
                                    className={`absolute inset-y-1 w-[calc(50%-4px)] rounded-xl z-0 ${
                                        type === "income"
                                            ? "bg-emerald-500 left-1"
                                            : "bg-red-500 left-[calc(50%+3px)]"
                                    }`}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setType("income")
                                    }
                                    className={`relative z-10 flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${
                                        type === "income"
                                            ? "text-white"
                                            : "text-zinc-500"
                                    }`}
                                >
                                    Ganho
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setType("expense")
                                    }
                                    className={`relative z-10 flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${
                                        type === "expense"
                                            ? "text-white"
                                            : "text-zinc-500"
                                    }`}
                                >
                                    Custo
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="relative">
                                    <FileText
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                                        size={16}
                                    />
                                    <input
                                        name="description"
                                        placeholder="DESCRIÇÃO"
                                        required
                                        className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold uppercase text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-700"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative">
                                        <DollarSign
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                                            size={16}
                                        />
                                        <input
                                            name="amount"
                                            type="number"
                                            step="0.01"
                                            placeholder="VALOR"
                                            required
                                            className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-700"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Tag
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                                            size={16}
                                        />
                                        <input
                                            name="category"
                                            placeholder="CATEGORIA"
                                            className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold uppercase text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-700"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                disabled={loading}
                                className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-[2px] text-xs hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                {loading
                                    ? "A processar..."
                                    : "Confirmar Lançamento"}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
