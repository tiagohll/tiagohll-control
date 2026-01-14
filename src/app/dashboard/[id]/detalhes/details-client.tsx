"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SummaryCards } from "./sumary-cards";
import { HeaderNavigation } from "./header";
import { MainChart } from "./main-chart";
import { PageTable } from "./page-table";
import { ClickRanking } from "./click-ranking";
import { SystemSummary } from "./system-sumary";

export function DetailsClient({
    site,
    chartData,
    totalPeriod,
    growth,
    allEvents,
}: any) {
    const [range, setRange] = useState("7d");
    const [activeTab, setActiveTab] = useState("acessos");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const pageRank = Object.entries(
        allEvents.reduce((acc: any, ev: any) => {
            acc[ev.path] = (acc[ev.path] || 0) + 1;
            return acc;
        }, {})
    ).sort((a: any, b: any) => b[1] - a[1]);

    const qrRank = Object.entries(
        allEvents.reduce((acc: any, ev: any) => {
            if (ev.event_type?.startsWith("qr_")) {
                const source = ev.event_type.replace(
                    "qr_",
                    ""
                );
                acc[source] = (acc[source] || 0) + 1;
            }
            return acc;
        }, {})
    ).sort((a: any, b: any) => b[1] - a[1]);

    const totalQRScans = qrRank.reduce(
        (acc, [_, count]: any) => acc + count,
        0
    );
    const totalPages = Math.ceil(
        pageRank.length / itemsPerPage
    );

    const paginatedPages = pageRank.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-black text-zinc-100 p-4 md:p-8"
        >
            <div className="max-w-5xl mx-auto space-y-8">
                <HeaderNavigation
                    site={site}
                    range={range}
                    setRange={setRange}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
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
                                totalPeriod={totalPeriod}
                                growth={growth}
                                totalQRScans={totalQRScans}
                                qrRank={qrRank}
                            />
                            <MainChart
                                chartData={chartData}
                            />
                            <PageTable
                                paginatedPages={
                                    paginatedPages
                                }
                                currentPage={currentPage}
                                totalPages={totalPages}
                                setCurrentPage={
                                    setCurrentPage
                                }
                            />
                        </motion.div>
                    )}
                    {activeTab === "cliques" && (
                        <motion.div
                            key="cliques"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <ClickRanking
                                allEvents={allEvents}
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
                                allEvents={allEvents}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
