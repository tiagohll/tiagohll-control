"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ExternalLink,
    Lock,
    QrCode as QrIcon,
} from "lucide-react";
import AnalyticsSection from "./analytics-section";
import QRCodeSection from "./qr-code-section";
import { useRouter } from "next/navigation";

export default function DashboardClient({
    site,
    stats,
    topPages,
    qrStats,
}: any) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("analises");

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
                <div className="max-w-6xl mx-auto px-8 pt-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                {site.name}
                            </h1>
                            <a
                                href={site.url}
                                target="_blank"
                                className="text-zinc-500 hover:text-blue-400 text-sm flex items-center gap-1 transition-colors"
                            >
                                {site.url}{" "}
                                <ExternalLink size={14} />
                            </a>
                        </div>
                    </div>

                    <nav className="flex gap-8 text-sm font-medium">
                        <button
                            onClick={() =>
                                setActiveTab("analises")
                            }
                            className={`pb-3 transition-colors relative ${
                                activeTab === "analises"
                                    ? "text-white"
                                    : "text-zinc-500 hover:text-white"
                            }`}
                        >
                            Análises
                            {activeTab === "analises" && (
                                <motion.div
                                    layoutId="tab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
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
                                    : "text-zinc-500 hover:text-white"
                            }`}
                        >
                            <QrIcon size={14} /> QR Code
                            {activeTab === "qrcode" && (
                                <motion.div
                                    layoutId="tab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                                />
                            )}
                        </button>
                        <div className="text-zinc-700 pb-3 cursor-not-allowed flex items-center gap-1.5">
                            Edição <Lock size={12} />
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
