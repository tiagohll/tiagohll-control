"use client";

import { useEffect, useState } from "react";
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
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted && !iframeError) {
            const updateScale = () => {
                const iframe = document.getElementById(
                    "preview-iframe"
                );
                const container = iframe?.parentElement;

                if (iframe && container) {
                    // Calcula a escala exata para a largura do container
                    const scale =
                        container.offsetWidth / 1280;

                    iframe.style.transform = `scale(${scale})`;

                    // Ajusta a altura do iframe para que o scale não deixe buracos
                    // (Opcional: se quiser que o site preencha o fundo perfeitamente)
                    iframe.style.height = `${container.offsetHeight / scale}px`;

                    iframe.style.opacity = "1";
                }
            };

            // Pequeno delay para o Next.js terminar de renderizar o container
            const timer = setTimeout(updateScale, 100);

            window.addEventListener("resize", updateScale);
            return () => {
                window.removeEventListener(
                    "resize",
                    updateScale
                );
                clearTimeout(timer);
            };
        }
    }, [isMounted, iframeError]);

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
                        <div className="absolute inset-0 w-full h-full overflow-hidden flex items-start justify-start">
                            <iframe
                                id="preview-iframe"
                                src={`${site.url}?preview=true`}
                                loading="lazy"
                                title="Preview do site"
                                onError={() =>
                                    setIframeError(true)
                                }
                                className="absolute top-0 left-0 border-none pointer-events-none origin-top-left transition-opacity duration-1000"
                                style={{
                                    width: "1280px",
                                    height: "800px",
                                    transform:
                                        "scale(0.86)",
                                    opacity: 0.8,
                                }}
                            />
                        </div>
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950">
                            <EyeOff
                                className="text-zinc-800"
                                size={40}
                            />
                            <p className="text-zinc-500 text-xs font-bold uppercase mt-4">
                                Preview Restrito
                            </p>
                        </div>
                    )}
                    <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.5)] rounded-[2.5rem]" />
                    {/* Overlay para facilitar clique */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-all backdrop-blur-[1px]">
                        <a
                            href={
                                site.url + "?preview=true"
                            }
                            target="_blank"
                            className="bg-white text-black px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]"
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
