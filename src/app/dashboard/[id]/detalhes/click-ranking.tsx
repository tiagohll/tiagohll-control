import { MousePointer2 } from "lucide-react";

// components/details/click-ranking.tsx
export function ClickRanking({ allEvents }: any) {
    const clickEvents = allEvents.filter(
        (ev: any) => ev.event_type === "click"
    );

    const clickRank = Object.entries(
        clickEvents.reduce((acc: any, ev: any) => {
            // Usamos o visitor_hash (que guardamos o ID do botão) ou o campo que você definiu
            const label = ev.visitor_hash || "Botão sem ID";
            acc[label] = (acc[label] || 0) + 1;
            return acc;
        }, {})
    ).sort((a: any, b: any) => b[1] - a[1]);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clickRank.map(
                    ([label, count]: any, index) => (
                        <div
                            key={label}
                            className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <MousePointer2 size={40} />
                            </div>
                            <p className="text-[10px] font-black text-zinc-500 uppercase mb-1">
                                ID do Elemento
                            </p>
                            <h4 className="text-lg font-bold text-white truncate pr-10">
                                {label}
                            </h4>
                            <div className="mt-4 flex items-end justify-between">
                                <span className="text-3xl font-black text-blue-500">
                                    {count}
                                </span>
                                <span className="text-xs text-zinc-500 mb-1">
                                    cliques totais
                                </span>
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
