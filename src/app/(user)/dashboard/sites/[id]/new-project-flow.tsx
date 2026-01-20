"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import SetupForm from "./setup-form"; // O formulário que limpamos o visual

export default function NewProjectFlow({
    isLimitReached,
}: {
    isLimitReached: boolean;
}) {
    const [isOpen, setIsOpen] = useState(false);

    // Mock de um objeto "site" vazio para o formulário de criação
    const emptySite = { name: "", url: "", id: "new" };

    if (isOpen) {
        return (
            <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors"
                >
                    <X size={32} />
                </button>

                <div className="w-full max-w-md">
                    <SetupForm
                        site={emptySite}
                        isNew={true}
                        onClose={() => setIsOpen(false)}
                    />
                </div>
            </div>
        );
    }

    return (
        <button
            disabled={isLimitReached}
            onClick={() => setIsOpen(true)}
            className={`
                px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 shadow-xl
                ${
                    isLimitReached
                        ? "bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed opacity-50"
                        : "bg-white text-black hover:bg-zinc-200 shadow-white/5"
                }
            `}
        >
            <Plus size={14} />{" "}
            {isLimitReached
                ? "Limite Atingido"
                : "Novo Projeto"}
        </button>
    );
}
