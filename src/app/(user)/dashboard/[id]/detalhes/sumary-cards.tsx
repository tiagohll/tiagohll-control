import { QrCode, Users } from "lucide-react";

export function SummaryCards({
    totalPeriod = 0,
    growth = 0,
    totalQRScans = 0,
    qrRank = [],
}: any) {
    const safeGrowth = Number(growth || 0);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* CARD 1: ACESSOS NO SITE */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] space-y-4">
                <div className="flex justify-between items-start">
                    <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">
                        Acessos no site
                    </span>
                    <div
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            safeGrowth >= 0
                                ? "bg-green-500/10 text-green-500"
                                : "bg-red-500/10 text-red-500"
                        }`}
                    >
                        {safeGrowth >= 0 ? "+" : ""}
                        {safeGrowth.toFixed(1)}%
                    </div>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white">
                        {totalPeriod}
                    </span>
                </div>
            </div>

            {/* CARD 2: VINDOS DO QR CODE */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] space-y-4">
                <div className="flex justify-between items-start">
                    <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">
                        Vindos do QR Code
                    </span>
                    <QrCode
                        size={16}
                        className="text-zinc-600"
                    />
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-blue-500">
                        {totalQRScans}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase">
                        {totalPeriod > 0
                            ? `Corresponde a ${Math.round(
                                  (totalQRScans /
                                      totalPeriod) *
                                      100
                              )}%`
                            : "0% do tráfego"}
                    </span>
                </div>
            </div>

            {/* CARD 3: QR CODE MAIS USADO - Onde ocorria o erro */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] space-y-4">
                <div className="flex justify-between items-start">
                    <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">
                        QR Code mais usado
                    </span>
                    <Users
                        size={16}
                        className="text-zinc-600"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-800 rounded-lg">
                        <QrCode
                            size={14}
                            className="text-blue-500"
                        />
                    </div>
                    <span className="text-xl font-bold truncate text-zinc-200 uppercase">
                        {/* 2. Proteção para o qrRank: verifica se existe o item e a sub-propriedade */}
                        {qrRank &&
                        qrRank.length > 0 &&
                        qrRank[0] &&
                        qrRank[0][0]
                            ? String(qrRank[0][0])
                            : "Sem dados"}
                    </span>
                </div>
            </div>
        </div>
    );
}
