"use client";

import React from "react";
import Link from "next/link";
import {
    Terminal,
    Rocket,
    ArrowUpRight,
} from "lucide-react";
import { ReactLenis } from "lenis/react";
import { motion } from "framer-motion";
import {
    CHANGELOG_DATA,
    ChangelogEntry,
} from "@/data/changelog";

const MajorReleaseCard = ({
    item,
}: {
    item: ChangelogEntry;
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="py-16 md:py-24 border-b border-white/5 last:border-0"
        >
            <Link
                href={`/changelog/${item.slug}`}
                className="group block"
            >
                <div className="flex flex-col md:flex-row gap-12 items-start">
                    {/* LADO ESQUERDO: CONTEÚDO */}
                    <div className="flex-1">
                        {/* Tag de Versão com padding inferior para proteger contra acentos */}
                        <div className="flex items-center gap-3 mb-8">
                            <span className="text-[11px] font-mono text-blue-500 font-black uppercase tracking-[0.4em]">
                                Build {item.version}
                            </span>
                            <div className="h-[1px] w-12 bg-zinc-800 group-hover:bg-blue-600/50 transition-colors" />
                        </div>

                        {/* CORREÇÃO DA UI: 
                - leading-[1.1] em mobile e [1.0] em desktop para dar espaço aos acentos.
                - tracking-tight ao invés de tighter para não espremer as letras.
            */}
                        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-white group-hover:text-blue-500 transition-all duration-500 leading-[1.1] md:leading-[1.05] mb-8">
                            {item.title}
                        </h2>

                        <p className="text-zinc-500 text-lg md:text-xl font-medium leading-relaxed max-w-xl mb-8">
                            {item.description}
                        </p>

                        {/* Micro Versões - Agora separadas visualmente */}
                        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-10">
                            {item.logs
                                .slice(0, 3)
                                .map((log, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-2"
                                    >
                                        <span className="w-1 h-1 rounded-full bg-blue-600" />
                                        <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                                            v
                                            {
                                                log.microVersion
                                            }
                                        </span>
                                    </div>
                                ))}
                        </div>

                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white opacity-40 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
                            Ver detalhes da release{" "}
                            <ArrowUpRight size={14} />
                        </div>
                    </div>

                    {/* LADO DIREITO: IMAGEM/GIF (Resolução Fixa) */}
                    <div className="w-full md:w-[480px] aspect-video bg-zinc-900 rounded-[2rem] overflow-hidden border border-white/10 relative shadow-2xl shrink-0">
                        <img
                            src={item.image}
                            alt={item.title}
                            className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100 opacity-60 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default function ChangelogPage() {
    return (
        <ReactLenis
            root
            options={{ lerp: 0.1, duration: 1.2 }}
        >
            <main className="bg-black text-white min-h-screen selection:bg-blue-600/30">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-20">
                    <header className="mb-32">
                        <div className="flex items-center gap-3 text-blue-500 mb-8">
                            <Terminal size={20} />
                            <span className="font-mono text-[10px] uppercase tracking-[0.5em] font-black">
                                THLL_CONTROL / UPDATES
                            </span>
                        </div>

                        <h1 className="text-7xl md:text-[11rem] font-black uppercase tracking-tighter leading-[0.85] mb-12">
                            Change
                            <br />
                            Log.
                        </h1>
                    </header>

                    <div className="relative">
                        {CHANGELOG_DATA.map((item) => (
                            <MajorReleaseCard
                                key={item.version}
                                item={item}
                            />
                        ))}
                    </div>

                    <footer className="py-40 text-center opacity-20">
                        <Rocket
                            className="mx-auto mb-4"
                            size={24}
                        />
                        <span className="text-[10px] font-mono uppercase tracking-[0.4em]">
                            Fim da transmissão
                        </span>
                    </footer>
                </div>
            </main>
        </ReactLenis>
    );
}
