"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    TrendingUp,
    FileText,
    CheckCircle2,
    Plus,
    ArrowUpRight,
    Clock,
    ChevronRight,
} from "lucide-react";
import { motion, animate } from "framer-motion";
import {
    BarChart,
    Bar,
    XAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import Link from "next/link";

// Componente de Contador Animado (R$ 0 -> Valor Real)
function Counter({ value }: { value: number }) {
    const [displayValue, setDisplayValue] = useState(0);
    useEffect(() => {
        const controls = animate(0, value, {
            duration: 1.5,
            ease: "easeOut",
            onUpdate: (latest) =>
                setDisplayValue(Math.floor(latest)),
        });
        return () => controls.stop();
    }, [value]);
    return (
        <span>{displayValue.toLocaleString("pt-BR")}</span>
    );
}

export default function DashboardPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        count: 0,
        pending: 0,
    });
    const [recentProposals, setRecentProposals] = useState<
        any[]
    >([]);
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        async function loadDashboardData() {
            setLoading(true);
            const { data: props, error } = await supabase
                .from("proposals")
                .select("*")
                .order("created_at", { ascending: true });

            if (props) {
                // 1. Estatísticas Simples
                const totalVal = props.reduce(
                    (acc, curr) =>
                        acc +
                        (Number(curr.total_price) || 0),
                    0
                );
                setStats({
                    total: totalVal,
                    count: props.length,
                    pending: props.filter(
                        (p) => p.status === "pending"
                    ).length,
                });

                // 2. Histórico Rápido (últimas 5 propostas criadas)
                setRecentProposals(
                    [...props].reverse().slice(0, 5)
                );

                // 3. Gerar os últimos 6 meses para o gráfico (Eixo X)
                const last6Months = Array.from({
                    length: 6,
                }).map((_, i) => {
                    const d = new Date();
                    d.setMonth(d.getMonth() - (5 - i));
                    return {
                        // "2-digit" resolve o erro do TypeScript
                        key: d
                            .toLocaleDateString("pt-BR", {
                                month: "short",
                                year: "2-digit",
                            })
                            .replace(".", "")
                            .toUpperCase(),
                        name: d
                            .toLocaleDateString("pt-BR", {
                                month: "short",
                            })
                            .replace(".", "")
                            .toUpperCase(),
                        total: 0,
                    };
                });

                // 4. Somar os valores reais do banco em cada mês
                props.forEach((prop) => {
                    const propDate = new Date(
                        prop.created_at
                    );
                    const propKey = propDate
                        .toLocaleDateString("pt-BR", {
                            month: "short",
                            year: "2-digit",
                        })
                        .replace(".", "")
                        .toUpperCase();

                    const monthIndex =
                        last6Months.findIndex(
                            (m) => m.key === propKey
                        );
                    if (monthIndex !== -1) {
                        last6Months[monthIndex].total +=
                            Number(prop.total_price) || 0;
                    }
                });

                setChartData(last6Months);
            }
            setLoading(false);
        }
        loadDashboardData();
    }, [supabase]);

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
                        DASHBOARD
                        <span className="text-blue-600">
                            .
                        </span>
                    </h1>
                    <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mt-1">
                        PERFOMANCE COMERCIAL EM TEMPO REAL.
                    </p>
                </div>
                <Link
                    href="/admin/proposals"
                    className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-2xl font-black uppercase text-[10px] flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                >
                    <Plus size={16} /> Novo Orçamento
                </Link>
            </header>

            {/* CARDS DE RESUMO */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        label: "Volume Total",
                        value: stats.total,
                        icon: TrendingUp,
                        color: "text-blue-500",
                        prefix: "R$ ",
                    },
                    {
                        label: "Propostas Criadas",
                        value: stats.count,
                        icon: FileText,
                        color: "text-emerald-500",
                        prefix: "",
                    },
                    {
                        label: "Em Aberto",
                        value: stats.pending,
                        icon: CheckCircle2,
                        color: "text-amber-500",
                        prefix: "",
                    },
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-md"
                    >
                        <item.icon
                            className={`${item.color} mb-6`}
                            size={28}
                        />
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                            {item.label}
                        </p>
                        <h2 className="text-4xl font-black flex items-baseline gap-1">
                            <span className="text-lg font-bold text-zinc-600">
                                {item.prefix}
                            </span>
                            {loading ? (
                                <span className="animate-pulse">
                                    ...
                                </span>
                            ) : (
                                <Counter
                                    value={item.value}
                                />
                            )}
                        </h2>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ÁREA DO GRÁFICO */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2 bg-zinc-900/40 border border-white/5 p-8 rounded-[3rem] h-[450px]"
                >
                    <h3 className="font-black uppercase text-xs tracking-[0.2em] mb-10 flex items-center gap-2">
                        <ArrowUpRight
                            size={16}
                            className="text-blue-500"
                        />{" "}
                        Faturamento Mensal (R$)
                    </h3>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >
                            <BarChart data={chartData}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="#ffffff05"
                                />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fill: "#52525b",
                                        fontSize: 10,
                                        fontWeight: "bold",
                                    }}
                                    dy={15}
                                />
                                <Tooltip
                                    cursor={{
                                        fill: "#ffffff05",
                                    }}
                                    contentStyle={{
                                        backgroundColor:
                                            "#09090b",
                                        border: "1px solid #ffffff10",
                                        borderRadius:
                                            "16px",
                                        padding: "12px",
                                    }}
                                    labelStyle={{
                                        color: "#fff",
                                        fontWeight: "bold",
                                        marginBottom: "4px",
                                    }}
                                    itemStyle={{
                                        color: "#3b82f6",
                                        fontWeight: "black",
                                        fontSize: "12px",
                                    }}
                                    formatter={(
                                        value: number
                                    ) => [
                                        `R$ ${value.toLocaleString("pt-BR")}`,
                                        "Total",
                                    ]}
                                />
                                <Bar
                                    dataKey="total"
                                    radius={[8, 8, 8, 8]}
                                    barSize={40}
                                >
                                    {chartData.map(
                                        (entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    index ===
                                                    chartData.length -
                                                        1
                                                        ? "#3b82f6"
                                                        : "#27272a"
                                                }
                                                className="transition-all duration-500"
                                            />
                                        )
                                    )}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* HISTÓRICO RÁPIDO */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-zinc-900/60 border border-white/5 p-8 rounded-[3rem] flex flex-col"
                >
                    <h3 className="font-black uppercase text-xs tracking-widest mb-8 flex items-center gap-2">
                        <Clock
                            size={16}
                            className="text-blue-500"
                        />{" "}
                        Histórico Rápido
                    </h3>
                    <div className="space-y-6 flex-1">
                        {recentProposals.length > 0 ? (
                            recentProposals.map(
                                (prop, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between group"
                                    >
                                        <div className="space-y-1">
                                            <p className="font-bold text-xs uppercase group-hover:text-blue-500 transition-all">
                                                {
                                                    prop.client_name
                                                }
                                            </p>
                                            <p className="text-[10px] text-zinc-500 font-bold uppercase">
                                                {
                                                    prop.client_city
                                                }
                                            </p>
                                        </div>
                                        <p className="font-black text-xs text-blue-500">
                                            R${" "}
                                            {Number(
                                                prop.total_price
                                            ).toLocaleString(
                                                "pt-BR"
                                            )}
                                        </p>
                                    </div>
                                )
                            )
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-zinc-600 gap-2">
                                <FileText
                                    size={40}
                                    opacity={0.2}
                                />
                                <p className="text-[10px] uppercase font-bold">
                                    Sem propostas
                                </p>
                            </div>
                        )}
                    </div>
                    <Link
                        href="/admin/proposals/list"
                        className="mt-8 text-[10px] font-black uppercase text-zinc-500 hover:text-blue-500 flex items-center gap-2 transition-all"
                    >
                        Ver histórico completo{" "}
                        <ChevronRight size={14} />
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
