import { QrCode } from "lucide-react";

export function SummaryCards({
    totalPeriod,
    growth,
    totalQRScans,
    qrRank,
}: any) {
    return (
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
                            (totalQRScans / totalPeriod) *
                                100 || 0
                        ).toFixed(0)}
                        % <br /> do seu tráfego
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
    );
}
