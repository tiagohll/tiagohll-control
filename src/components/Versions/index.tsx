"use client";

import { useState } from "react";
import {
    X,
    PlusCircle,
    CheckCircle2,
    ShieldCheck,
    History,
    Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Estrutura de dados baseada no seu Changelog
const VERSIONS_DATA = [
    {
        version: "0.7.0",
        date: "13 de Fevereiro, 2026",
        changes: [
            {
                type: "ia",
                title: "Inteligência Artificial",
                items: [
                    "Motor de análise integrado com Llama 3.1 via Groq Cloud",
                    "Nova aba 'Resumo IA' com geração de insights automáticos",
                    "Interface premium com bordas animadas em gradiente",
                ],
            },
            {
                type: "added",
                title: "Melhorias de Performance",
                items: [
                    "Otimização de tokens para redução de latência na API",
                    "Minificação de dados de contexto enviados ao servidor",
                    "Gestão de projetos do seu website pelo dashboard",
                ],
            },
            {
                type: "fixed",
                title: "Corrigido",
                items: [
                    "Tratamento de erro para Rate Limit (429) da API",
                    "Ajuste no loop de carregamento infinito do dashboard",
                ],
            },
        ],
    },
];

export default function Versions() {
    const [isOpen, setIsOpen] = useState(false);
    const current = VERSIONS_DATA[0];

    return (
        <>
            {/* BOTÃO FLUTUANTE */}
            <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-zinc-900/80 border border-zinc-800 px-4 py-2 text-xs font-medium text-zinc-400 shadow-2xl backdrop-blur-md hover:bg-zinc-800 hover:text-white transition-all"
            >
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                v{current.version}
            </motion.button>

            {/* MODAL */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0.9,
                                y: 20,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: 0,
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.9,
                                y: 20,
                            }}
                            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl"
                        >
                            {/* Header */}
                            <div className="border-b border-zinc-800 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                            <History
                                                size={20}
                                                className="text-blue-500"
                                            />
                                            Notas de
                                            Atualização
                                        </h3>
                                        <p className="text-sm text-zinc-500 mt-1">
                                            Versão{" "}
                                            {
                                                current.version
                                            }{" "}
                                            • {current.date}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() =>
                                            setIsOpen(false)
                                        }
                                        className="rounded-full p-2 hover:bg-zinc-800 text-zinc-500"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Corpo com Scroll */}
                            <div className="max-h-[60vh] overflow-y-auto p-6 space-y-6 custom-scrollbar">
                                {current.changes.map(
                                    (group, idx) => (
                                        <motion.div
                                            key={
                                                group.title
                                            }
                                            initial={{
                                                opacity: 0,
                                                y: 10,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                            }}
                                            transition={{
                                                delay:
                                                    idx *
                                                    0.1,
                                            }}
                                            className="space-y-3"
                                        >
                                            <div className="flex items-center gap-2">
                                                {group.type ===
                                                    "added" && (
                                                    <PlusCircle
                                                        size={
                                                            16
                                                        }
                                                        className="text-emerald-500"
                                                    />
                                                )}
                                                {group.type ===
                                                    "fixed" && (
                                                    <CheckCircle2
                                                        size={
                                                            16
                                                        }
                                                        className="text-amber-500"
                                                    />
                                                )}
                                                {group.type ===
                                                    "security" && (
                                                    <ShieldCheck
                                                        size={
                                                            16
                                                        }
                                                        className="text-blue-500"
                                                    />
                                                )}
                                                {group.type ===
                                                    "ia" && (
                                                    <Sparkles
                                                        size={
                                                            16
                                                        }
                                                        className="text-blue-400 animate-pulse"
                                                    />
                                                )}

                                                <span
                                                    className={
                                                        "text-xs font-bold uppercase tracking-widest text-zinc-500"
                                                    }
                                                >
                                                    {
                                                        group.title
                                                    }
                                                </span>
                                            </div>

                                            <ul className="grid gap-2">
                                                {group.items.map(
                                                    (
                                                        item,
                                                        i
                                                    ) => (
                                                        <li
                                                            key={
                                                                i
                                                            }
                                                            className="text-sm text-zinc-400 bg-zinc-950/50 border border-zinc-800/50 rounded-xl p-3"
                                                        >
                                                            {
                                                                item
                                                            }
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </motion.div>
                                    )
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-6 bg-zinc-950/50 border-t border-zinc-800 text-center">
                                <button
                                    onClick={() =>
                                        setIsOpen(false)
                                    }
                                    className="w-full rounded-xl bg-white py-3 text-sm font-bold text-black hover:bg-zinc-200 transition-all active:scale-[0.98]"
                                >
                                    Fechar Notas
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
