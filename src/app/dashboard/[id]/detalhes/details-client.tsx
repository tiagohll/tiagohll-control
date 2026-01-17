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
    const [range, setRange] = useState("7d");
    const [activeTab, setActiveTab] = useState("acessos");
    const [currentPage, setCurrentPage] = useState(1);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const itemsPerPage = 5;

    useEffect(() => {
        setCurrentPage(1);
    }, [range, activeTab]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.refresh();
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    // 1. FILTRAGEM TEMPORAL BASE
    const filteredEventsByTime = useMemo(() => {
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

    // 2. SEPARAÇÃO DE ACESSOS REAIS (Remove os Cliques para não sujar gráfico/tabela)
    const realAccesses = useMemo(() => {
        return filteredEventsByTime.filter(
            (ev: any) => ev.event_type !== "click"
        );
    }, [filteredEventsByTime]);

    // 3. ESTATÍSTICAS DE TRÁFEGO (QR vs SOCIAL)
    const trafficStats = useMemo(() => {
        const counts = realAccesses.reduce(
            (acc: any, ev: any) => {
                const type =
                    ev.event_type?.toLowerCase() || "";
                if (type.startsWith("qr_")) {
                    const name = type
                        .replace("qr_", "")
                        .toUpperCase();
                    acc.qr[name] = (acc.qr[name] || 0) + 1;
                } else if (type.startsWith("ref_")) {
                    const name = type
                        .replace("ref_", "")
                        .toUpperCase();
                    acc.social[name] =
                        (acc.social[name] || 0) + 1;
                }
                return acc;
            },
            { qr: {}, social: {} }
        );

        return {
            qrRank: Object.entries(counts.qr).sort(
                (a: any, b: any) => b[1] - a[1]
            ),
            socialRank: Object.entries(counts.social).sort(
                (a: any, b: any) => b[1] - a[1]
            ),
        };
    }, [realAccesses]);

    // 4. DADOS PARA O GRÁFICO (Apenas Acessos Reais)
    const dynamicChartData = useMemo(() => {
        const daysToRender =
            range === "30d" ? 30 : range === "all" ? 45 : 7;
        const dataMap: Record<string, number> = {};

        for (let i = daysToRender - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const label = d.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
            });
            dataMap[label] = 0;
        }

        realAccesses.forEach((ev: any) => {
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
    }, [realAccesses, range]);

    // 5. PAGINAÇÃO DA TABELA (Caminhos limpos sem fbclid)
    const tableData = useMemo(() => {
        const counts = realAccesses.reduce(
            (acc: any, ev: any) => {
                const cleanPath = ev.path.split("?")[0]; // LIMPA A URL AQUI
                acc[cleanPath] = (acc[cleanPath] || 0) + 1;
                return acc;
            },
            {}
        );

        const sorted = Object.entries(counts).sort(
            (a: any, b: any) => b[1] - a[1]
        );
        const totalPages = Math.ceil(
            sorted.length / itemsPerPage
        );
        const paginated = sorted.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );

        return { paginated, totalPages };
    }, [realAccesses, currentPage]);

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
                                    realAccesses.length
                                }
                                qrRank={trafficStats.qrRank}
                                socialRank={
                                    trafficStats.socialRank
                                } // Nova prop para o Instagram
                                totalQRScans={trafficStats.qrRank.reduce(
                                    (a: any, b: any) =>
                                        a + b[1],
                                    0
                                )}
                                totalAbsolute={
                                    allEvents.filter(
                                        (e: any) =>
                                            e.event_type !==
                                            "click"
                                    ).length
                                }
                            />
                            <MainChart
                                chartData={dynamicChartData}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                {/* Ranking de Redes Sociais / Links Externos */}
                                <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
                                        Redes Sociais &
                                        Links
                                    </h3>
                                    <div className="space-y-4">
                                        {trafficStats
                                            .socialRank
                                            .length > 0 ? (
                                            trafficStats.socialRank.map(
                                                ([
                                                    source,
                                                    count,
                                                ]: any) => (
                                                    <div
                                                        key={
                                                            source
                                                        }
                                                        className="flex items-center justify-between"
                                                    >
                                                        <span className="text-sm font-bold text-zinc-300">
                                                            {
                                                                source
                                                            }
                                                        </span>
                                                        <div className="flex items-center gap-3 flex-1 ml-4">
                                                            <div className="h-1.5 bg-zinc-800 rounded-full flex-1 overflow-hidden">
                                                                <motion.div
                                                                    initial={{
                                                                        width: 0,
                                                                    }}
                                                                    animate={{
                                                                        width: `${(count / realAccesses.length) * 100}%`,
                                                                    }}
                                                                    className="h-full bg-pink-500/50"
                                                                />
                                                            </div>
                                                            <span className="text-xs font-black text-white w-8 text-right">
                                                                {
                                                                    count
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                )
                                            )
                                        ) : (
                                            <p className="text-xs text-zinc-600 italic">
                                                Nenhum
                                                acesso via
                                                link externo
                                                identificado.
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Ranking Detalhado de QR Codes */}
                                <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                        Localização dos QR
                                        Codes
                                    </h3>
                                    <div className="space-y-4">
                                        {trafficStats.qrRank
                                            .length > 0 ? (
                                            trafficStats.qrRank.map(
                                                ([
                                                    code,
                                                    count,
                                                ]: any) => (
                                                    <div
                                                        key={
                                                            code
                                                        }
                                                        className="flex items-center justify-between"
                                                    >
                                                        <span className="text-sm font-bold text-zinc-300">
                                                            {
                                                                code
                                                            }
                                                        </span>
                                                        <div className="flex items-center gap-3 flex-1 ml-4">
                                                            <div className="h-1.5 bg-zinc-800 rounded-full flex-1 overflow-hidden">
                                                                <motion.div
                                                                    initial={{
                                                                        width: 0,
                                                                    }}
                                                                    animate={{
                                                                        width: `${(count / realAccesses.length) * 100}%`,
                                                                    }}
                                                                    className="h-full bg-blue-500/50"
                                                                />
                                                            </div>
                                                            <span className="text-xs font-black text-white w-8 text-right">
                                                                {
                                                                    count
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                )
                                            )
                                        ) : (
                                            <p className="text-xs text-zinc-600 italic">
                                                Nenhum scan
                                                de QR Code
                                                identificado.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <PageTable
                                paginatedPages={
                                    tableData.paginated
                                }
                                currentPage={currentPage}
                                totalPages={
                                    tableData.totalPages
                                }
                                setCurrentPage={
                                    setCurrentPage
                                }
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
                                events={
                                    filteredEventsByTime
                                }
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
                                events={allEvents}
                                siteName={site.name}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
