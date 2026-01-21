"use client";

import {
    AlertCircle,
    Terminal,
    Globe,
    Activity,
} from "lucide-react";
import { motion } from "framer-motion";
import { CustomSelect } from "../components/AdminFilters";
import { updateReportStatus } from "../lib/actions";

const STATUS_OPTIONS = [
    { label: "Pendente", value: "pending" },
    { label: "Em curso", value: "progress" },
    { label: "Concluído", value: "solved" },
];

// Cores dinâmicas para o ícone do CustomSelect
const STATUS_THEME: any = {
    pending: "text-amber-500",
    progress: "text-blue-500",
    solved: "text-emerald-500",
};

export function ReportItem({ report }: any) {
    const currentTheme =
        STATUS_THEME[report.status] || STATUS_THEME.pending;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="group bg-zinc-950/40 border border-white/5 p-5 rounded-[2rem] transition-all hover:bg-zinc-950/60"
        >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                {/* Lado Esquerdo: Info do Erro */}
                <div className="flex items-center gap-4 flex-1">
                    <div
                        className={`p-3 rounded-2xl ${report.is_dev_error ? "bg-red-500/10 text-red-500" : "bg-zinc-900 text-zinc-500"}`}
                    >
                        <AlertCircle size={20} />
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Globe
                                size={12}
                                className="text-blue-500/50"
                            />
                            <span className="text-[10px] text-zinc-600 font-black uppercase tracking-[2px]">
                                {report.sites?.name ||
                                    "Desconhecido"}
                            </span>
                        </div>
                        <h3 className="text-sm font-black text-white uppercase tracking-tight">
                            {report.error_code}
                        </h3>
                        <div className="flex items-center gap-2 text-zinc-500 text-[11px] mt-1 font-mono">
                            <Terminal
                                size={12}
                                className="opacity-30"
                            />
                            {report.page_url}
                        </div>
                    </div>
                </div>

                {/* Lado Direito: Status via CustomSelect */}
                <div className="w-full md:w-auto">
                    <CustomSelect
                        value={report.status}
                        options={STATUS_OPTIONS}
                        onChange={(newStatus: string) =>
                            updateReportStatus(
                                report.id,
                                newStatus
                            )
                        }
                        icon={
                            <Activity
                                size={14}
                                className={currentTheme}
                            />
                        }
                    />
                </div>
            </div>

            {/* Descrição em estilo terminal */}
            <div className="mt-5 p-4 bg-black/40 rounded-2xl border border-white/[0.03] text-xs text-zinc-400 italic leading-relaxed relative overflow-hidden group-hover:border-white/10 transition-colors">
                <div
                    className={`absolute left-0 top-0 bottom-0 w-1 ${report.is_dev_error ? "bg-red-500/40" : "bg-zinc-800"}`}
                />
                "
                {report.description ||
                    "No specific details provided for this report."}
                "
            </div>
        </motion.div>
    );
}
