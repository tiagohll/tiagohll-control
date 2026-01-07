"use client";

import { ExternalLink } from "lucide-react";

export default function AnalyticsSection({
    site,
    stats,
    topPages,
}: any) {
    return (
        <div className="space-y-8">
            {/* Grid de Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
                    <p className="text-zinc-400 text-xs uppercase tracking-widest font-bold mb-2">
                        Total de Visitas
                    </p>
                    <p className="text-3xl font-bold tracking-tighter">
                        {stats.total || 0}
                    </p>
                </div>
                <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl border-l-blue-500">
                    <p className="text-zinc-400 text-xs uppercase tracking-widest font-bold mb-2">
                        Visitas Hoje
                    </p>
                    <p className="text-3xl font-bold tracking-tighter text-blue-400">
                        {stats.today || 0}
                    </p>
                </div>
                <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
                    <p className="text-zinc-400 text-xs uppercase tracking-widest font-bold mb-2">
                        Páginas Únicas
                    </p>
                    <p className="text-3xl font-bold tracking-tighter">
                        {topPages.length}
                    </p>
                </div>
            </div>

            {/* Preview Mockup */}
            <div className="group">
                <p className="text-zinc-400 text-xs uppercase tracking-widest font-bold mb-4">
                    Preview do Site
                </p>
                <div className="relative aspect-video w-full bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-600 transition-all">
                    <iframe
                        src={site.url}
                        className="w-[1280px] h-[720px] origin-top-left pointer-events-none opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-80 transition-all"
                        style={{
                            transform:
                                "scale(calc(100% / 1280))",
                            width: "1280px",
                            height: "720px",
                        }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-all">
                        <a
                            href={site.url}
                            target="_blank"
                            className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold opacity-0 group-hover:opacity-100 transition-all shadow-xl"
                        >
                            Abrir no navegador
                        </a>
                    </div>
                </div>
            </div>

            {/* Tabela de Páginas */}
            <section>
                <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">
                    Páginas Mais Visitadas
                </h2>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl divide-y divide-zinc-800">
                    {topPages.length > 0 ? (
                        topPages.map(
                            (
                                [path, count]: any,
                                index: number
                            ) => (
                                <div
                                    key={path}
                                    className="flex items-center justify-between p-4 hover:bg-zinc-800/30 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-zinc-600 text-xs font-mono">
                                            {(index + 1)
                                                .toString()
                                                .padStart(
                                                    2,
                                                    "0"
                                                )}
                                        </span>
                                        <a
                                            href={`${
                                                site.url
                                            }${
                                                path === "/"
                                                    ? ""
                                                    : path
                                            }`}
                                            target="_blank"
                                            className="font-mono text-sm text-blue-400 hover:underline flex items-center gap-1.5"
                                        >
                                            {path}{" "}
                                            <ExternalLink
                                                size={12}
                                                className="text-zinc-600"
                                            />
                                        </a>
                                    </div>
                                    <span className="text-sm font-medium">
                                        {count} visitas
                                    </span>
                                </div>
                            )
                        )
                    ) : (
                        <div className="p-8 text-center text-zinc-500 text-sm italic">
                            Nenhum dado de tráfego capturado
                            ainda.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
