"use client";

import { useState } from "react";
import {
    BarChart3,
    ArrowUpRight,
    EyeOff,
} from "lucide-react";
import Link from "next/link";

export default function AnalyticsSection({
    site,
    stats,
    topPages,
}: any) {
    const [iframeError, setIframeError] = useState(false);

    return (
        <div className="space-y-10">
            {/* Header com Botão de Detalhes */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-white">
                        Visão Geral
                    </h2>
                    <p className="text-zinc-500 text-sm font-medium">
                        Relatórios e tráfego do domínio
                    </p>
                </div>

                <Link
                    href={`/dashboard/${site.id}/detalhes`}
                    className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-black px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-white/5"
                >
                    <BarChart3 size={14} /> Detalhes do
                    Tráfego
                </Link>
            </div>

            {/* Grid de Stats - Minimalista e Direto */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-8 bg-zinc-900/40 border border-zinc-800 rounded-[2rem] group hover:border-zinc-700 transition-colors">
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        Total Acumulado
                    </p>
                    <p className="text-4xl font-black tracking-tighter text-white">
                        {/* Agora este número ignora cliques automaticamente */}
                        {stats.total.toLocaleString()}
                    </p>
                </div>

                <div className="p-8 bg-zinc-900/40 border border-zinc-800 rounded-[2rem] group hover:border-zinc-700 transition-colors">
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        Acessos Hoje
                    </p>
                    <p className="text-4xl font-black tracking-tighter text-blue-500">
                        {stats.today.toLocaleString()}
                    </p>
                </div>

                <div className="p-8 bg-zinc-900/40 border border-zinc-800 rounded-[2rem] group hover:border-zinc-700 transition-colors">
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        Páginas Mapeadas
                    </p>
                    <p className="text-4xl font-black tracking-tighter text-white">
                        {/* topPages já vem filtrado do pai */}
                        {topPages.length}
                    </p>
                </div>
            </div>

            {/* Preview do Site com Fallback */}
            <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between px-2">
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                        Visualização ao vivo
                    </p>
                    <a
                        href={site.url}
                        target="_blank"
                        className="text-zinc-400 text-[10px] font-bold flex items-center gap-1 hover:text-white transition-colors"
                    >
                        VISITAR DOMÍNIO{" "}
                        <ArrowUpRight size={10} />
                    </a>
                </div>

                <div className="relative aspect-video w-full bg-zinc-950 border border-zinc-800 rounded-[2.5rem] overflow-hidden group shadow-2xl">
                    {!iframeError ? (
                        <iframe
                            src={site.url}
                            onError={() =>
                                setIframeError(true)
                            }
                            className="w-[1280px] h-[720px] origin-top-left pointer-events-none opacity-30 group-hover:opacity-100 transition-all duration-1000"
                            style={{
                                transform:
                                    "scale(calc(100% / 1280))",
                                width: "1280px",
                                height: "720px",
                            }}
                        />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-zinc-950">
                            <EyeOff
                                className="text-zinc-800"
                                size={40}
                            />
                            <div className="text-center">
                                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                                    Preview Restrito
                                </p>
                                <p className="text-zinc-700 text-[10px] mt-1">
                                    O site não permite
                                    visualização interna por
                                    segurança.
                                </p>
                            </div>
                            <a
                                href={site.url}
                                target="_blank"
                                className="bg-zinc-900 text-zinc-400 border border-zinc-800 px-5 py-2 rounded-xl text-[10px] font-black hover:bg-zinc-800 hover:text-white transition-all uppercase tracking-widest"
                            >
                                Abrir manualmente
                            </a>
                        </div>
                    )}

                    {/* Overlay de Interação */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all backdrop-blur-[2px]">
                        <a
                            href={site.url}
                            target="_blank"
                            className="bg-white text-black px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all hover:scale-105 active:scale-95"
                        >
                            Explorar Interface
                        </a>
                    </div>
                </div>
            </div>

            {/* Tabela de Páginas Mais Visitadas */}
            <section className="space-y-6 pt-4">
                {/* ... header da seção ... */}
                <div className="bg-zinc-900/20 border border-zinc-800 rounded-[2rem] overflow-hidden">
                    {topPages.length > 0 ? (
                        <div className="divide-y divide-zinc-800/50">
                            {topPages.map(
                                (
                                    [path, count]: any,
                                    index: number
                                ) => (
                                    <div
                                        key={path}
                                        className="flex items-center justify-between p-6 hover:bg-zinc-800/30 transition-all group"
                                    >
                                        <div className="flex items-center gap-6">
                                            <span className="text-zinc-800 text-xs font-black group-hover:text-blue-500 transition-colors">
                                                {(index + 1)
                                                    .toString()
                                                    .padStart(
                                                        2,
                                                        "0"
                                                    )}
                                            </span>
                                            <span className="font-mono text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors truncate max-w-[180px] md:max-w-md">
                                                {path}{" "}
                                                {/* Path já virá limpo sem ?utm=... */}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <span className="text-sm font-black text-white block leading-none">
                                                    {count}
                                                </span>
                                                <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter">
                                                    Visitas
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    ) : (
                        <div className="p-16 text-center">
                            <p className="text-zinc-700 text-xs font-black uppercase tracking-[0.2em]">
                                Sem dados disponíveis
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
