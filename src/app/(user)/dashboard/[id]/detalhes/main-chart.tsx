import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
} from "recharts";

export function MainChart({ chartData }: any) {
    return (
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
                                    stopOpacity={0.2}
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
                                backgroundColor: "#09090b",
                                border: "1px solid #27272a",
                                borderRadius: "12px",
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
    );
}
