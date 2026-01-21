// report-list.tsx
"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { ReportItem } from "./report-items";

export function ReportsList({
    initialReports,
}: {
    initialReports: any[];
}) {
    const [search, setSearch] = useState("");

    const filteredReports = initialReports.filter(
        (report) => {
            // Normalizamos para string vazia caso venha null/undefined do banco
            const errorCode = (
                report.error_code || ""
            ).toLowerCase();
            const siteName = (
                report.sites?.name || ""
            ).toLowerCase();
            const description = (
                report.description || ""
            ).toLowerCase();
            const searchTerm = search.toLowerCase();

            return (
                errorCode.includes(searchTerm) ||
                siteName.includes(searchTerm) ||
                description.includes(searchTerm)
            );
        }
    );

    return (
        <div className="space-y-6">
            {/* Barra de Busca */}
            <div className="relative group">
                <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors"
                    size={18}
                />
                <input
                    type="text"
                    placeholder="Buscar por erro, site ou descrição..."
                    className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all shadow-2xl"
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />
            </div>

            {/* Lista com verificação de array vazio */}
            <div className="grid grid-cols-1 gap-6">
                {filteredReports.length > 0 ? (
                    filteredReports.map((report) => (
                        <div
                            key={report.id}
                            className="relative group"
                        >
                            <div className="absolute -top-2 left-6 px-3 py-1 bg-blue-600 rounded-full text-[9px] font-black text-white uppercase tracking-tighter z-10 shadow-lg">
                                {report.sites?.name ||
                                    "Site Desconhecido"}
                            </div>
                            <ReportItem report={report} />
                        </div>
                    ))
                ) : (
                    <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                        <p className="text-zinc-600 font-bold uppercase text-xs tracking-widest">
                            Nenhum resultado para "{search}"
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
