"use client";
import { useState, useEffect } from "react";
import {
    X,
    Save,
    DollarSign,
    ChevronDown,
    Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_OPTIONS = [
    {
        id: "confirmado",
        label: "CONFIRMADO",
        color: "text-blue-500",
        border: "border-blue-500/20",
    },
    {
        id: "em_producao",
        label: "EM PRODUÇÃO",
        color: "text-orange-500",
        border: "border-orange-500/20",
    },
    {
        id: "concluido",
        label: "CONCLUÍDO",
        color: "text-green-500",
        border: "border-green-500/20",
    },
    {
        id: "cancelado",
        label: "CANCELADO",
        color: "text-red-500",
        border: "border-red-500/20",
    },
];

export default function EditProjectModal({
    project,
    isOpen,
    onClose,
    onUpdate,
}: any) {
    const [amountPaid, setAmountPaid] = useState(0);
    const [status, setStatus] = useState("confirmado");
    const [isSelectOpen, setIsSelectOpen] = useState(false);

    useEffect(() => {
        if (project) {
            setAmountPaid(project.amount_paid || 0);
            setStatus(project.status || "confirmado");
        }
    }, [project]);

    if (!isOpen || !project) return null;

    const currentStatus =
        STATUS_OPTIONS.find((opt) => opt.id === status) ||
        STATUS_OPTIONS[0];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{
                        opacity: 0,
                        scale: 0.95,
                        y: 20,
                    }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{
                        opacity: 0,
                        scale: 0.95,
                        y: 20,
                    }}
                    className="relative bg-[#09090b] border border-white/10 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-visible"
                >
                    {/* Header conforme Imagem 1 */}
                    <div className="p-8 border-b border-white/5 flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">
                                EDITAR PROJETO
                            </h2>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] mt-2 font-bold">
                                {project.name}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-zinc-500 hover:text-white uppercase text-[10px] font-bold tracking-widest transition-colors mt-1"
                        >
                            Fechar
                        </button>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Financeiro */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-zinc-600 block tracking-[0.2em]">
                                VALOR RECEBIDO
                            </label>
                            <div className="relative">
                                <DollarSign
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
                                    size={18}
                                />
                                <input
                                    type="number"
                                    value={amountPaid}
                                    onChange={(e) =>
                                        setAmountPaid(
                                            Number(
                                                e.target
                                                    .value
                                            )
                                        )
                                    }
                                    className="w-full bg-zinc-900/30 border border-white/5 rounded-2xl py-5 pl-12 pr-4 text-white font-bold focus:border-blue-500/50 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* STATUS DO FLUXO - Customizado (Imagem 3) */}
                        <div className="space-y-3 relative">
                            <label className="text-[10px] font-black uppercase text-zinc-600 block tracking-[0.2em]">
                                STATUS DO FLUXO
                            </label>

                            {/* Gatilho do Dropdown */}
                            <button
                                type="button"
                                onClick={() =>
                                    setIsSelectOpen(
                                        !isSelectOpen
                                    )
                                }
                                className="w-full bg-[#121214] border border-white/5 rounded-2xl py-5 px-6 text-left flex justify-between items-center group transition-all hover:border-white/10"
                            >
                                <span
                                    className={`font-black text-[11px] tracking-widest ${currentStatus.color}`}
                                >
                                    {currentStatus.label}
                                </span>
                                <ChevronDown
                                    size={18}
                                    className={`text-zinc-600 transition-transform duration-300 ${isSelectOpen ? "rotate-180" : ""}`}
                                />
                            </button>

                            {/* Opções do Dropdown (Animadas) */}
                            <AnimatePresence>
                                {isSelectOpen && (
                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            y: -10,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 5,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            y: -10,
                                        }}
                                        className="absolute top-full left-0 w-full bg-[#18181b] border border-white/10 rounded-[1.5rem] mt-2 overflow-hidden z-[100] shadow-2xl shadow-black"
                                    >
                                        {STATUS_OPTIONS.map(
                                            (opt) => (
                                                <button
                                                    key={
                                                        opt.id
                                                    }
                                                    type="button"
                                                    onClick={() => {
                                                        setStatus(
                                                            opt.id
                                                        );
                                                        setIsSelectOpen(
                                                            false
                                                        );
                                                    }}
                                                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                                                >
                                                    <span
                                                        className={`text-[10px] font-black tracking-widest ${opt.color}`}
                                                    >
                                                        {
                                                            opt.label
                                                        }
                                                    </span>
                                                    {status ===
                                                        opt.id && (
                                                        <Check
                                                            size={
                                                                14
                                                            }
                                                            className="text-white"
                                                        />
                                                    )}
                                                </button>
                                            )
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Botão Salvar */}
                        <button
                            onClick={() =>
                                onUpdate({
                                    amount_paid: amountPaid,
                                    status,
                                })
                            }
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase italic tracking-tighter py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/10 active:scale-[0.98] mt-4"
                        >
                            <Save size={18} /> SALVAR
                            ALTERAÇÕES
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
