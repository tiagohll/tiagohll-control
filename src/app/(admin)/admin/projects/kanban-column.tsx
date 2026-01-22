import {
    Calendar,
    DollarSign,
    MoreHorizontal,
    CheckCircle2,
    Clock,
    Trash2,
} from "lucide-react";
import { motion } from "framer-motion";
import {
    deleteProjectWithPenalty,
    updateProjectStatus,
} from "../lib/actions";

export default function KanbanColumn({
    title,
    color,
    projects,
}: any) {
    const handleDeleteProject = async (project: any) => {
        deleteProjectWithPenalty(project);
    };
    const handleStatusChange = (project: any) => {
        updateProjectStatus(
            project.id,
            "concluido",
            project
        );
    };
    return (
        <div className="flex flex-col gap-4 bg-zinc-950/20 rounded-[2rem] p-4 border border-white/[0.02] min-w-[300px]">
            <div className="flex items-center justify-between px-4 py-2">
                <h2
                    className={`text-[10px] font-black uppercase tracking-[0.2em] ${color}`}
                >
                    {title}
                    <span className="ml-2 opacity-50">
                        ({projects?.length || 0})
                    </span>
                </h2>
                <MoreHorizontal
                    size={16}
                    className="text-zinc-600"
                />
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 scrollbar-hide">
                {projects?.map((project: any) => {
                    // Lógica para calcular a porcentagem paga
                    const total =
                        Number(project.total_value) || 0;
                    const paid =
                        Number(project.amount_paid) || 0;
                    const percent =
                        total > 0
                            ? Math.min(
                                  (paid / total) * 100,
                                  100
                              )
                            : 0;
                    const isFullyPaid =
                        paid >= total && total > 0;

                    return (
                        <motion.div
                            layoutId={project.id}
                            key={project.id}
                            className="bg-zinc-900/50 border border-white/5 p-5 rounded-[1.5rem] hover:border-blue-500/30 transition-all cursor-grab active:cursor-grabbing group relative overflow-hidden"
                        >
                            {/* Barra de Progresso de Pagamento Sutil no Topo */}
                            <div className="absolute top-0 left-0 h-[2px] bg-zinc-800 w-full">
                                <div
                                    className={`h-full transition-all duration-500 ${isFullyPaid ? "bg-green-500" : "bg-blue-500"}`}
                                    style={{
                                        width: `${percent}%`,
                                    }}
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <div>
                                    <h3 className="text-zinc-200 font-bold text-sm group-hover:text-blue-400 transition-colors truncate">
                                        {project.name}
                                    </h3>
                                    <p className="text-[10px] text-zinc-600 font-mono mt-1 uppercase">
                                        {project.client_name ||
                                            "Cliente não definido"}
                                    </p>
                                </div>

                                <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                                            Pagamento
                                        </span>
                                        <span
                                            className={`text-[9px] font-black uppercase ${isFullyPaid ? "text-green-500" : "text-blue-400"}`}
                                        >
                                            {percent.toFixed(
                                                0
                                            )}
                                            %
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1 text-zinc-200">
                                            <span className="text-[10px] font-bold">
                                                R${" "}
                                                {paid.toLocaleString()}
                                            </span>
                                            <span className="text-[10px] text-zinc-600">
                                                /
                                            </span>
                                            <span className="text-[10px] text-zinc-500 italic">
                                                R${" "}
                                                {total.toLocaleString()}
                                            </span>
                                        </div>
                                        {isFullyPaid ? (
                                            <CheckCircle2
                                                size={12}
                                                className="text-green-500"
                                            />
                                        ) : (
                                            <Clock
                                                size={12}
                                                className="text-zinc-600"
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-1 px-1">
                                    <div className="flex items-center gap-1.5 text-zinc-500">
                                        <Calendar
                                            size={12}
                                        />
                                        <span className="text-[9px] uppercase font-bold tracking-tighter">
                                            {project.deadline ||
                                                "Sem prazo"}
                                        </span>
                                    </div>

                                    {project.is_recurring && (
                                        <span className="text-[8px] bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-md font-black uppercase italic">
                                            Recorrente
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
                                <div className="flex gap-2">
                                    {/* Corrigido para "em_desenvolvimento" para bater com o ID da COLUMNS */}
                                    <button
                                        onClick={() =>
                                            updateProjectStatus(
                                                project.id,
                                                "em_desenvolvimento",
                                                project
                                            )
                                        }
                                        className="text-[9px] font-black uppercase p-2 bg-white/5 rounded-lg hover:bg-orange-500/20 hover:text-orange-500 transition-all"
                                    >
                                        Produção
                                    </button>

                                    <button
                                        onClick={() =>
                                            updateProjectStatus(
                                                project.id,
                                                "concluido",
                                                project
                                            )
                                        }
                                        className="text-[9px] font-black uppercase p-2 bg-white/5 rounded-lg hover:bg-green-500/20 hover:text-green-500 transition-all"
                                    >
                                        Concluir
                                    </button>
                                </div>

                                <button
                                    onClick={() => {
                                        if (
                                            confirm(
                                                "Deseja cancelar? Será aplicada a multa de 50% no financeiro."
                                            )
                                        ) {
                                            deleteProjectWithPenalty(
                                                project
                                            );
                                        }
                                    }}
                                    className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
