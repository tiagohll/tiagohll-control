"use client";

import { useState } from "react";
import {
    Plus,
    Search,
    ExternalLink,
    MoreVertical,
    CircleDot,
    CheckCircle2,
    Clock,
    AlertCircle,
} from "lucide-react";
import NewProjectModal from "./new-project";
import {
    convertProposalToProject,
    updateProject,
} from "../lib/actions";
import EditProjectModal from "./edit-project";
import Link from "next/link";

// Tipagem para clareza
interface Project {
    id: string;
    name: string;
    customer_name: string;
    formatted_client_code: string;
    status:
        | "pendente"
        | "em_producao"
        | "concluido"
        | "cancelado";
    total_value: number;
    amount_paid: number;
}

interface ProjectsClientProps {
    initialProjects: Project[];
    proposals: any[];
    customers: any[];
}

export default function ProjectsClient({
    initialProjects,
    proposals,
    customers,
}: ProjectsClientProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] =
        useState<Project | null>(null);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "concluido":
                return "bg-green-500/10 text-green-500 border-green-500/20";
            case "em_producao":
                return "bg-orange-500/10 text-orange-500 border-orange-500/20";
            case "cancelado":
                return "bg-red-500/10 text-red-500 border-red-500/20";
            default:
                return "bg-blue-500/10 text-blue-500 border-blue-500/20";
        }
    };

    const handleUpdate = async (updates: any) => {
        if (editingProject) {
            await updateProject(editingProject.id, updates);
            setEditingProject(null);
        }
    };

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
                        Projetos
                        <span className="text-blue-600">
                            .
                        </span>
                    </h1>{" "}
                    <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mt-1">
                        Controle de fluxo de trabalho e
                        saúde financeira por projeto.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
                            size={18}
                        />
                        <input
                            type="text"
                            placeholder="Buscar projeto ou cliente..."
                            className="bg-zinc-900/50 border border-white/5 rounded-2xl pl-10 pr-4 py-3 text-sm text-white w-[300px] focus:outline-none focus:border-blue-500/50 transition-all"
                            onChange={(e) =>
                                setSearchTerm(
                                    e.target.value
                                )
                            }
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                    >
                        <Plus size={20} />
                        Novo Projeto
                    </button>
                </div>
            </header>

            <NewProjectModal
                onClose={() => setIsModalOpen(false)}
                isOpen={isModalOpen}
                proposals={proposals || []}
                customers={customers || []}
                onCreate={async (data: any) => {
                    await convertProposalToProject(data);
                    setIsModalOpen(false);
                }}
            />

            <EditProjectModal
                project={editingProject}
                isOpen={!!editingProject}
                onClose={() => setEditingProject(null)}
                onUpdate={handleUpdate}
            />

            {/* Tabela de Projetos */}
            <div className="bg-zinc-950/40 border border-white/[0.05] rounded-[2rem] overflow-hidden backdrop-blur-md">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.02]">
                            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                                Cód. Cliente
                            </th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                                Projeto & Cliente
                            </th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                                Status
                            </th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                                Financeiro
                            </th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-right">
                                Ações
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {initialProjects?.map((project) => (
                            <tr
                                key={project.id}
                                className="group hover:bg-white/[0.02] transition-colors"
                            >
                                <td className="p-6">
                                    <span className="font-mono text-blue-500 font-bold bg-blue-500/5 px-3 py-1 rounded-lg border border-blue-500/10">
                                        #
                                        {
                                            project.formatted_client_code
                                        }
                                    </span>
                                </td>
                                <td className="p-6">
                                    <div className="flex flex-col">
                                        <span className="text-zinc-200 font-bold group-hover:text-blue-400 transition-colors">
                                            {project.name}
                                        </span>
                                        <span className="text-zinc-500 text-xs uppercase tracking-tighter">
                                            {
                                                project.customer_name
                                            }
                                        </span>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <span
                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusStyle(project.status)}`}
                                    >
                                        <CircleDot
                                            size={10}
                                        />
                                        {project.status.replace(
                                            "_",
                                            " "
                                        )}
                                    </span>
                                </td>
                                <td className="p-6">
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500 w-32">
                                            <span>
                                                Progresso
                                            </span>
                                            <span className="text-zinc-300">
                                                {(
                                                    (project.amount_paid /
                                                        project.total_value) *
                                                    100
                                                ).toFixed(
                                                    0
                                                )}
                                                %
                                            </span>
                                        </div>
                                        <div className="w-32 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 transition-all duration-700"
                                                style={{
                                                    width: `${(project.amount_paid / project.total_value) * 100}%`,
                                                }}
                                            />
                                        </div>
                                        <div className="text-[11px] text-zinc-400 font-medium">
                                            R${" "}
                                            {project.amount_paid.toLocaleString()}{" "}
                                            <span className="text-zinc-600">
                                                / R${" "}
                                                {project.total_value.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link
                                            href={`/admin/projects/${project.id}`}
                                            className="p-2 hover:bg-blue-500/10 rounded-xl text-zinc-400 hover:text-blue-400 transition-all group/btn"
                                            title="Ver detalhes completos"
                                        >
                                            <ExternalLink
                                                size={18}
                                            />
                                        </Link>
                                        <button
                                            onClick={() =>
                                                setEditingProject(
                                                    project
                                                )
                                            }
                                            title="Editar dados"
                                            className="p-2 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white transition-all"
                                        >
                                            <MoreVertical
                                                size={18}
                                            />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {initialProjects?.length === 0 && (
                    <div className="p-20 text-center flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-700">
                            <AlertCircle size={32} />
                        </div>
                        <p className="text-zinc-500 font-medium">
                            Nenhum projeto encontrado.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
