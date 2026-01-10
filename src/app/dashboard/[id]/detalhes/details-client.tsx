"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    AreaChart,
    Area,
    XAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import {
    ArrowLeft,
    TrendingUp,
    TrendingDown,
    MousePointer2,
    QrCode,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Calendar,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function DetailsClient({
    site,
    chartData,
    totalPeriod,
    growth,
    allEvents,
}: any) {
    const router = useRouter();
    const [range, setRange] = useState("7d");
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Paginação reduzida para 5 para ser mais direto
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Processamento amigável
    const pageRank = Object.entries(
        allEvents.reduce((acc: any, ev: any) => {
            acc[ev.path] = (acc[ev.path] || 0) + 1;
            return acc;
        }, {})
    ).sort((a: any, b: any) => b[1] - a[1]);

    const qrRank = Object.entries(
        allEvents.reduce((acc: any, ev: any) => {
            if (ev.event_type.startsWith("qr_")) {
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

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.refresh();
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-black text-zinc-100 p-4 md:p-8 font-sans"
        >
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header Amigável */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <Link
                        href={`/dashboard/sites/${site.id}`}
                        className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm"
                    >
                        <ArrowLeft size={16} /> Voltar para
                        o Início
                    </Link>

                    <div className="flex items-center gap-3 self-end md:self-auto">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
                            <Calendar
                                size={12}
                                className="text-blue-500"
                            />
                            {range === "7d"
                                ? "Últimos 7 dias"
                                : "Últimos 30 dias"}
                        </div>

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

                        <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-lg">
                            {["7d", "30d"].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => {
                                        setRange(t);
                                        setCurrentPage(1);
                                    }}
                                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                                        range === t
                                            ? "bg-zinc-800 text-white"
                                            : "text-zinc-500 hover:text-zinc-300"
                                    }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Cards de Resumo */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem]">
                        <p className="text-zinc-500 text-xs font-medium mb-1">
                            Acessos no site
                        </p>
                        <div className="flex items-center gap-3">
                            <span className="text-4xl font-black tracking-tighter">
                                {totalPeriod}
                            </span>
                            <div
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    growth >= 0
                                        ? "bg-green-500/10 text-green-400"
                                        : "bg-red-500/10 text-red-400"
                                }`}
                            >
                                {growth >= 0 ? "+" : ""}
                                {growth.toFixed(1)}%
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] border-l-blue-500/30">
                        <p className="text-zinc-500 text-xs font-medium mb-1">
                            Vindos do QR Code
                        </p>
                        <div className="flex items-center gap-3">
                            <span className="text-4xl font-black text-blue-500 tracking-tighter">
                                {totalQRScans}
                            </span>
                            <span className="text-zinc-500 text-[10px] font-medium leading-tight">
                                Corresponde a{" "}
                                {(
                                    (totalQRScans /
                                        totalPeriod) *
                                        100 || 0
                                ).toFixed(0)}
                                % <br />
                                do seu tráfego
                            </span>
                        </div>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] hidden lg:block">
                        <p className="text-zinc-500 text-xs font-medium mb-1">
                            QR Code mais usado
                        </p>
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                <QrCode size={18} />
                            </div>
                            <span className="text-xl font-bold truncate text-zinc-200 uppercase">
                                {qrRank[0]
                                    ? `${qrRank[0][0]}`
                                    : "Sem dados"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Gráfico Principal */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 md:p-8 rounded-[2.5rem]">
                    <h3 className="text-sm font-bold text-zinc-300 mb-6">
                        Fluxo de acessos diários
                    </h3>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient
                                        id="colorVisits"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#3b82f6"
                                            stopOpacity={
                                                0.2
                                            }
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#3b82f6"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#18181b"
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="date"
                                    stroke="#3f3f46"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor:
                                            "#09090b",
                                        border: "1px solid #27272a",
                                        borderRadius:
                                            "12px",
                                        fontSize: "12px",
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    name="Acessos"
                                    dataKey="visitors"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorVisits)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Seção de Origem por QR Code */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 px-2">
                        <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                        <h2 className="text-xl font-bold tracking-tight">
                            Desempenho por QR Code
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {qrRank.map(
                            ([source, count]: any) => (
                                <div
                                    key={source}
                                    className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-2xl hover:border-zinc-700 transition-all"
                                >
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">
                                            Origem: {source}
                                        </span>
                                        <span className="text-xl font-black text-white leading-none">
                                            {count}
                                        </span>
                                    </div>
                                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{
                                                width: 0,
                                            }}
                                            animate={{
                                                width: `${
                                                    (count /
                                                        totalQRScans) *
                                                    100
                                                }%`,
                                            }}
                                            className="bg-blue-500 h-full rounded-full"
                                        />
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>

                {/* Tabela de Páginas Acessadas (Limitada a 5) */}
                <div className="bg-zinc-900/20 border border-zinc-800 rounded-3xl overflow-hidden">
                    <div className="p-5 border-b border-zinc-800 bg-zinc-900/40 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-zinc-400">
                            <MousePointer2 size={14} />
                            <h3 className="text-xs font-bold uppercase tracking-widest">
                                Links mais acessados
                            </h3>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm min-w-[450px]">
                            <tbody className="divide-y divide-zinc-800/50">
                                {paginatedPages.map(
                                    ([
                                        path,
                                        count,
                                    ]: any) => (
                                        <tr
                                            key={path}
                                            className="hover:bg-zinc-900/30 transition-colors"
                                        >
                                            <td className="p-4 font-mono text-zinc-400 text-xs">
                                                {path}
                                            </td>
                                            <td className="p-4 text-right font-bold text-white whitespace-nowrap">
                                                {count}{" "}
                                                visitas
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginação Compacta */}
                    <div className="p-4 border-t border-zinc-800 flex items-center justify-between bg-zinc-900/40 text-[10px] font-bold uppercase text-zinc-500">
                        <span>
                            Página {currentPage} de{" "}
                            {totalPages || 1}
                        </span>
                        <div className="flex gap-1">
                            <button
                                onClick={() =>
                                    setCurrentPage((p) =>
                                        Math.max(1, p - 1)
                                    )
                                }
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-20"
                            >
                                <ChevronLeft size={14} />
                            </button>
                            <button
                                onClick={() =>
                                    setCurrentPage((p) =>
                                        Math.min(
                                            totalPages,
                                            p + 1
                                        )
                                    )
                                }
                                disabled={
                                    currentPage ===
                                        totalPages ||
                                    totalPages === 0
                                }
                                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-20"
                            >
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Rodapé Final */}
                <div className="text-center pt-12 pb-6 border-t border-zinc-900">
                    <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-[0.4em]">
                        THLL Control • Sistema de
                        Monitoramento • 2026
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
