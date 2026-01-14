"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SummaryCards } from "./sumary-cards";
import { HeaderNavigation } from "./header";
import { MainChart } from "./main-chart";
import { PageTable } from "./page-table";
import { ClickRanking } from "./click-ranking";
import { SystemSummary } from "./system-sumary";

export function DetailsClient({
    site,
    allEvents = [],
}: any) {
    const router = useRouter();

    // Hooks de estado sempre no topo e em ordem constante
    const [range, setRange] = useState("7d");
    const [activeTab, setActiveTab] = useState("acessos");
    const [currentPage, setCurrentPage] = useState(1);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const itemsPerPage = 5;

    // Efeito para resetar a paginação
    // O erro de "size changed" é resolvido ao recarregar a página (F5) após salvar o código
    useEffect(() => {
        setCurrentPage(1);
    }, [range, activeTab]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.refresh();
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    // 1. FILTRAGEM DE EVENTOS (Corrigido para histórico desde 04/01)
    const filteredEvents = useMemo(() => {
        if (!allEvents || allEvents.length === 0) return [];
        if (range === "all") return allEvents;

        const now = new Date();
        const todayOnly = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        ).getTime();

        return allEvents.filter((ev: any) => {
            const evDate = new Date(ev.created_at);
            const evDateOnly = new Date(
                evDate.getFullYear(),
                evDate.getMonth(),
                evDate.getDate()
            ).getTime();

            if (range.includes("-")) {
                const [y, m, d] = range
                    .split("-")
                    .map(Number);
                return (
                    evDateOnly ===
                    new Date(y, m - 1, d).getTime()
                );
            }

            const diffDays =
                (todayOnly - evDateOnly) /
                (1000 * 3600 * 24);
            return range === "30d"
                ? diffDays <= 30
                : diffDays <= 7;
        });
    }, [allEvents, range]);

    // 2. DADOS DO GRÁFICO (Ajustado para o MainChart)
    const dynamicChartData = useMemo(() => {
        const daysToRender =
            range === "30d" ? 30 : range === "all" ? 45 : 7;
        const dataMap: Record<string, number> = {};

        if (range.includes("-")) {
            const label = range
                .split("-")
                .reverse()
                .slice(0, 2)
                .join("/");
            return [
                {
                    date: label,
                    visitors: filteredEvents.length,
                },
            ];
        }

        for (let i = daysToRender - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const label = d.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
            });
            dataMap[label] = 0;
        }

        filteredEvents.forEach((ev: any) => {
            const label = new Date(
                ev.created_at
            ).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
            });
            if (dataMap[label] !== undefined)
                dataMap[label]++;
        });

        return Object.entries(dataMap).map(
            ([date, visitors]) => ({ date, visitors })
        );
    }, [filteredEvents, range]);

    // 3. RANKING QR CODE
    const qrStats = useMemo(() => {
        const counts = filteredEvents.reduce(
            (acc: any, ev: any) => {
                const type =
                    ev.event_type?.toLowerCase() || "";
                if (
                    type.includes("qr_") ||
                    [
                        "instagram",
                        "guizao",
                        "testes",
                    ].includes(type)
                ) {
                    const name = type
                        .replace("qr_", "")
                        .toUpperCase();
                    acc[name] = (acc[name] || 0) + 1;
                }
                return acc;
            },
            {}
        );
        return Object.entries(counts).sort(
            (a: any, b: any) => b[1] - a[1]
        );
    }, [filteredEvents]);

    return (
        <div className="min-h-screen bg-black text-zinc-100 p-4 md:p-8">
            <div className="max-w-5xl mx-auto space-y-8">
                <HeaderNavigation
                    range={range}
                    setRange={setRange}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    handleRefresh={handleRefresh}
                    isRefreshing={isRefreshing}
                />

                <AnimatePresence mode="wait">
                    {activeTab === "acessos" && (
                        <motion.div
                            key="acessos"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            <SummaryCards
                                totalPeriod={
                                    filteredEvents.length
                                }
                                qrRank={qrStats}
                                totalQRScans={qrStats.reduce(
                                    (a: any, b: any) =>
                                        a + b[1],
                                    0
                                )}
                                totalAbsolute={
                                    allEvents.length
                                }
                            />
                            <MainChart
                                chartData={dynamicChartData}
                            />
                            {/* Passamos filteredEvents para a tabela processar */}
                            <PageTable
                                events={filteredEvents}
                            />
                        </motion.div>
                    )}

                    {activeTab === "cliques" && (
                        <motion.div
                            key="cliques"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <ClickRanking
                                events={filteredEvents}
                            />
                        </motion.div>
                    )}

                    {activeTab === "resumo" && (
                        <motion.div
                            key="resumo"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <SystemSummary
                                events={filteredEvents}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
