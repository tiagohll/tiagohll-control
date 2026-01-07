"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ChevronLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[25%] -left-[10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px]" />
                <div className="absolute -bottom-[25%] -right-[10%] w-[50%] h-[50%] bg-zinc-900/50 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center z-10"
            >
                <h1 className="text-[12rem] font-black leading-none tracking-tighter text-zinc-800 select-none">
                    404
                </h1>

                <div className="mt-[-2rem]">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        Página não encontrada
                    </h2>
                    <p className="text-zinc-500 max-w-md mx-auto mb-10">
                        O link que você acessou pode estar
                        quebrado ou o projeto foi removido
                        do nosso sistema.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/"
                            className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-zinc-200 transition-all transform hover:scale-105"
                        >
                            <Home size={18} /> Voltar ao
                            Início
                        </Link>

                        <button
                            onClick={() =>
                                window.history.back()
                            }
                            className="flex items-center gap-2 text-zinc-400 hover:text-white px-8 py-3 transition-colors"
                        >
                            <ChevronLeft size={18} /> Voltar
                            anterior
                        </button>
                    </div>
                </div>
            </motion.div>

            <div className="absolute bottom-8 text-[10px] text-zinc-700 uppercase tracking-[0.2em] font-bold">
                THLL Control • Digital System
            </div>
        </div>
    );
}
