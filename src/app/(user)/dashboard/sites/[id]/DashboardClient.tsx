"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    Lock,
    QrCode,
    QrCode as QrIcon,
} from "lucide-react";
import AnalyticsSection from "./analytics-section";
import QRCodeSection from "./qr-code-section";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardClient({
    site,
    allEvents = [],
    stats,
    topPages,
    qrStats,
}: any) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("analises");

    const cleanStats = useMemo(() => {
        const realEvents = allEvents.filter(
            (e: any) => e.event_type !== "click"
        );
        const today = new Date()
            .toISOString()
            .split("T")[0];

        return {
            total: realEvents.length,
            today: realEvents.filter((e: any) =>
                e.created_at.startsWith(today)
            ).length,
        };
    }, [allEvents]);

    const cleanTopPages = useMemo(() => {
        const counts = allEvents
            .filter((e: any) => e.event_type !== "click")
            .reduce((acc: any, ev: any) => {
                const path = ev.path.split("?")[0];
                acc[path] = (acc[path] || 0) + 1;
                return acc;
            }, {});

        return Object.entries(counts)
            .sort((a: any, b: any) => b[1] - a[1])
            .slice(0, 5); // Pega os 5 principais
    }, [allEvents]);

    useEffect(() => {
        // Atualiza os dados (Server Components) a cada 15 segundos
        const interval = setInterval(() => {
            router.refresh();
        }, 15000);

        return () => clearInterval(interval);
    }, [router]);

    return (
        <div className="min-h-screen bg-black text-white">
            <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-8">
                    {/* Botão Voltar Discreto */}
                    <div className="pt-4">
                        <Link
                            href="/dashboard"
                            className="text-zinc-500 hover:text-white flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.2em] transition-colors w-fit"
                        >
                            <ChevronLeft size={12} /> Voltar
                            ao Painel
                        </Link>
                    </div>

                    <div className="flex items-center justify-between mt-4 mb-6">
                        <div className="flex items-center gap-4">
                            {/* Favicon do Site */}
                            <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 overflow-hidden flex items-center justify-center shrink-0 shadow-lg">
                                <img
                                    src={`https://www.google.com/s2/favicons?domain=${site.url}&sz=64`}
                                    alt="Favicon"
                                    className="w-6 h-6 object-contain"
                                    onError={(e) => {
                                        (
                                            e.target as HTMLImageElement
                                        ).src =
                                            "https://www.google.com/s2/favicons?domain=google.com&sz=64";
                                    }}
                                />
                            </div>

                            <div>
                                <h1 className="text-2xl font-black tracking-tighter text-white leading-none">
                                    {site.name}
                                </h1>
                                <a
                                    href={site.url}
                                    target="_blank"
                                    className="text-zinc-500 hover:text-blue-400 text-xs font-medium flex items-center gap-1 transition-colors mt-1"
                                >
                                    {site.url.replace(
                                        /^https?:\/\//,
                                        ""
                                    )}{" "}
                                    {/* Remove o https:// para ficar mais limpo */}
                                    <ExternalLink
                                        size={12}
                                        className="opacity-50"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Navegação de Tabs */}
                    <nav className="flex gap-8 text-[11px] font-black uppercase tracking-widest">
                        <button
                            onClick={() =>
                                setActiveTab("analises")
                            }
                            className={`pb-3 transition-colors relative ${
                                activeTab === "analises"
                                    ? "text-white"
                                    : "text-zinc-600 hover:text-zinc-400"
                            }`}
                        >
                            Análises
                            {activeTab === "analises" && (
                                <motion.div
                                    layoutId="tab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                                />
                            )}
                        </button>

                        <button
                            onClick={() =>
                                setActiveTab("qrcode")
                            }
                            className={`pb-3 transition-colors flex items-center gap-1.5 relative ${
                                activeTab === "qrcode"
                                    ? "text-white"
                                    : "text-zinc-600 hover:text-zinc-400"
                            }`}
                        >
                            <QrCode size={14} /> QR Code
                            {activeTab === "qrcode" && (
                                <motion.div
                                    layoutId="tab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                                />
                            )}
                        </button>

                        <div className="text-zinc-800 pb-3 cursor-not-allowed flex items-center gap-1.5 opacity-50">
                            Configurações <Lock size={10} />
                        </div>
                    </nav>
                </div>
            </header>

            <main className="p-8 max-w-6xl mx-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === "analises" ? (
                            <AnalyticsSection
                                site={site}
                                stats={stats}
                                topPages={topPages}
                            />
                        ) : (
                            <QRCodeSection
                                qrStats={qrStats}
                                site={site}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
