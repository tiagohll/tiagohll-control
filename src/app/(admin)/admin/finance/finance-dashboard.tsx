"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
    TrendingUp,
    TrendingDown,
    Wallet,
    Plus,
} from "lucide-react";
import { useState } from "react";
import { AddTransactionModal } from "./add-transaction-modal";

export function FinanceDashboard({
    transactions,
    stats,
}: any) {
    const isNegative = stats.balance < 0;
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="space-y-8">
            {/* Grid de Cards Refinado */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* SALDO LÍQUIDO - Agora reage corretamente ao negativo */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`relative p-8 min-h-[160px] flex flex-col justify-center rounded-[2.5rem] border overflow-hidden transition-all duration-700 ${
                        isNegative
                            ? "bg-red-500/10 border-red-500/20 shadow-[0_0_40px_-15px_rgba(239,68,68,0.3)]"
                            : "bg-blue-600/10 border-blue-500/20 shadow-[0_0_40px_-15px_rgba(59,130,246,0.3)]"
                    }`}
                >
                    <div className="relative z-10">
                        <p className="text-[9px] font-black uppercase tracking-[3px] opacity-40 mb-1">
                            Saldo Líquido
                        </p>
                        <h2
                            className={`text-4xl font-black tracking-tighter ${isNegative ? "text-red-500" : "text-blue-500"}`}
                        >
                            {stats.balance.toLocaleString(
                                "pt-BR",
                                {
                                    style: "currency",
                                    currency: "BRL",
                                }
                            )}
                        </h2>
                    </div>
                    <div
                        className={`absolute -right-10 -bottom-10 w-40 h-40 blur-[80px] opacity-20 ${isNegative ? "bg-red-600" : "bg-blue-600"}`}
                    />
                    <Wallet
                        className={`absolute right-8 top-1/2 -translate-y-1/2 opacity-5 ${isNegative ? "text-red-500" : "text-blue-500"}`}
                        size={60}
                    />
                </motion.div>

                {/* GANHOS */}
                <div className="p-8 min-h-[160px] flex flex-col justify-center rounded-[2.5rem] bg-zinc-900/40 border border-white/5 relative overflow-hidden">
                    <p className="text-[9px] font-black uppercase tracking-[3px] text-zinc-500 mb-1">
                        Ganhos Totais
                    </p>
                    <h2 className="text-3xl font-black text-emerald-500 tracking-tighter">
                        {stats.totalIncome.toLocaleString(
                            "pt-BR",
                            {
                                style: "currency",
                                currency: "BRL",
                            }
                        )}
                    </h2>
                    <TrendingUp
                        className="absolute right-8 top-1/2 -translate-y-1/2 text-emerald-500/10"
                        size={50}
                    />
                </div>

                {/* CUSTOS - Usamos Math.abs para não mostrar "--R$" */}
                <div className="p-8 min-h-[160px] flex flex-col justify-center rounded-[2.5rem] bg-zinc-900/40 border border-white/5 relative overflow-hidden">
                    <p className="text-[9px] font-black uppercase tracking-[3px] text-zinc-500 mb-1">
                        Custos Operacionais
                    </p>
                    <h2 className="text-3xl font-black text-zinc-300 tracking-tighter">
                        -{" "}
                        {Math.abs(
                            stats.totalExpense
                        ).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                        })}
                    </h2>
                    <TrendingDown
                        className="absolute right-8 top-1/2 -translate-y-1/2 text-white/5"
                        size={50}
                    />
                </div>
            </div>

            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            {/* Lista de Transações Recentes */}
            <div className="bg-zinc-950/50 border border-white/5 rounded-[2.5rem] p-8">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-lg font-black uppercase tracking-tighter">
                        Últimos Lançamentos
                    </h3>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-white text-black px-6 py-2 rounded-full text-[10px] font-black uppercase hover:scale-105 transition-transform flex items-center gap-2"
                    >
                        <Plus size={14} /> Novo Registro
                    </button>
                </div>

                <div className="space-y-4">
                    {transactions.map((t: any) => (
                        <div
                            key={t.id}
                            className="flex items-center justify-between p-4 bg-zinc-900/30 rounded-2xl border border-white/[0.02]"
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className={`p-2 rounded-lg ${t.type === "income" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}
                                >
                                    {t.type === "income" ? (
                                        <TrendingUp
                                            size={16}
                                        />
                                    ) : (
                                        <TrendingDown
                                            size={16}
                                        />
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white uppercase">
                                        {t.description}
                                    </p>
                                    <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest">
                                        {t.category}
                                    </p>
                                </div>
                            </div>
                            <p
                                className={`font-black ${t.type === "income" ? "text-emerald-500" : "text-zinc-400"}`}
                            >
                                {t.type === "income"
                                    ? "+"
                                    : "-"}{" "}
                                {Number(
                                    t.amount
                                ).toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                })}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
