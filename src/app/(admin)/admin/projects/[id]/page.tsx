import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import {
    ArrowLeft,
    FileText,
    User,
    Clock,
} from "lucide-react";
import Link from "next/link";
import { ProjectActions } from "./project-actions";

// 1. Defina a tipagem correta para Next.js 15 (Promise)
interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ProjectDetailsPage({
    params,
}: PageProps) {
    // 2. Aguarde o params ser resolvido
    const { id } = await params;

    const supabase = await createClient();

    // 3. Agora o 'id' é uma string válida, não "undefined"
    const { data: project, error } = await supabase
        .from("projects")
        .select(
            `
            *,
            customers (
                name,
                client_code
            )
        `
        )
        .eq("id", id)
        .maybeSingle();

    if (error) {
        console.error("ERRO SUPABASE:", error.message);
        return notFound();
    }

    if (!project) return notFound();

    const saldoDevedor =
        project.total_value - project.amount_paid;
    const porcentagemPaga =
        (project.amount_paid / project.total_value) * 100;

    return (
        <div className="p-8 max-w-[1200px] mx-auto space-y-8 text-white">
            <Link
                href="/admin/projects"
                className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group w-fit"
            >
                <ArrowLeft
                    size={18}
                    className="group-hover:-translate-x-1 transition-transform"
                />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                    Voltar para projetos
                </span>
            </Link>

            <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
                <div className="space-y-4">
                    <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                            project.status === "concluido"
                                ? "bg-green-500/10 text-green-500 border-green-500/20"
                                : "bg-orange-500/10 text-orange-500 border-orange-500/20"
                        }`}
                    >
                        {project.status?.replace("_", " ")}
                    </span>

                    <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
                        {project.name}
                    </h1>

                    <div className="flex items-center gap-6 text-zinc-500">
                        <div className="flex items-center gap-2 uppercase text-[10px] font-bold tracking-widest">
                            <User
                                size={14}
                                className="text-blue-500"
                            />
                            <span>
                                {project.customers?.name ||
                                    "Cliente não encontrado"}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 uppercase text-[10px] font-bold tracking-widest">
                            <Clock size={14} />
                            <span>
                                Iniciado em:{" "}
                                {new Date(
                                    project.created_at
                                ).toLocaleDateString(
                                    "pt-BR"
                                )}
                            </span>
                        </div>
                    </div>
                </div>

                <ProjectActions
                    projectId={project.id}
                    projectName={project.name}
                />
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-zinc-950 border border-white/10 rounded-[2.5rem] p-10 space-y-8">
                    <h3 className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em]">
                        Saúde Financeira
                    </h3>

                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <p className="text-zinc-500 text-[10px] font-black uppercase mb-1">
                                Total do Projeto
                            </p>
                            <p className="text-4xl font-black italic">
                                R${" "}
                                {project.total_value?.toLocaleString(
                                    "pt-BR",
                                    {
                                        minimumFractionDigits: 2,
                                    }
                                )}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-zinc-500 text-[10px] font-black uppercase mb-1">
                                Saldo a Receber
                            </p>
                            <p className="text-4xl font-black text-red-500 italic">
                                R${" "}
                                {saldoDevedor?.toLocaleString(
                                    "pt-BR",
                                    {
                                        minimumFractionDigits: 2,
                                    }
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3 bg-white/[0.02] p-6 rounded-3xl border border-white/5">
                        <div className="flex justify-between text-[10px] font-black uppercase text-zinc-400">
                            <span>
                                Status do Recebimento
                            </span>
                            <span className="text-blue-500">
                                {porcentagemPaga.toFixed(0)}
                                %
                            </span>
                        </div>
                        <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-600 transition-all duration-1000 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                                style={{
                                    width: `${porcentagemPaga}%`,
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-8">
                    <h3 className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em] mb-6">
                        Ações Rápidas
                    </h3>
                    <div className="space-y-4">
                        <div className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl text-left transition-all group">
                            <p className="text-[10px] font-black uppercase text-zinc-400 group-hover:text-white">
                                Código do Cliente
                            </p>
                            <p className="text-sm font-bold">
                                #
                                {project.customers
                                    ?.client_code || "000"}
                            </p>
                        </div>
                        <button className="w-full bg-white/5 hover:bg-white/10 border border-white/5 p-4 rounded-2xl text-left transition-all group">
                            <p className="text-[10px] font-black uppercase text-zinc-400 group-hover:text-white">
                                Proposta Original
                            </p>
                            <p className="text-sm font-bold flex items-center gap-2 italic">
                                Ver PDF{" "}
                                <FileText size={14} />
                            </p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
