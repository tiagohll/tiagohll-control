// components/header.tsx
import { motion } from "framer-motion";
import {
    ChevronLeft,
    ExternalLink,
    QrCode,
    Lock,
    RefreshCw,
    Calendar,
    Bot,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function HeaderNavigation({
    site,
    range,
    setRange,
    activeTab,
    setActiveTab,
}: any) {
    const router = useRouter();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.refresh();
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    return (
        <header className="backdrop-blur-md sticky top-0 z-50 -mx-4 md:-mx-8 mb-8">
            <div className="max-w-full mx-auto px-4 md:px-8">
                <div className="flex items-center justify-between border-b border-zinc-800 mb-8 py-2">
                    <nav className="flex gap-8 text-[11px] font-black uppercase tracking-widest">
                        {[
                            {
                                id: "acessos",
                                label: "Análises",
                            },
                            {
                                id: "cliques",
                                label: "Cliques",
                            },
                            {
                                id: "resumo",
                                label: "Resumo",
                                icon: <Bot size={16} />,
                            },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() =>
                                    setActiveTab(tab.id)
                                }
                                className={`pb-3 transition-colors relative flex items-center gap-2 ${
                                    activeTab === tab.id
                                        ? "text-white"
                                        : "text-zinc-600 hover:text-zinc-400"
                                }`}
                            >
                                {tab.icon}
                                {tab.label}

                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTabUnderline"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                                    />
                                )}
                            </button>
                        ))}
                    </nav>

                    {/* Botão Refresh no canto direito da navegação */}
                    <button
                        onClick={handleRefresh}
                        className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                    >
                        <motion.div
                            animate={{
                                rotate: isRefreshing
                                    ? 360
                                    : 0,
                            }}
                        >
                            <RefreshCw size={16} />
                        </motion.div>
                    </button>
                </div>
            </div>
        </header>
    );
}
