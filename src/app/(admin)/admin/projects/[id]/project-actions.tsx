"use client";

import { useToast } from "@/context/ToastContext";
import { FileText, Pencil, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProjectActionsProps {
    projectId: string;
    projectName: string;
}

export function ProjectActions({
    projectId,
    projectName,
}: ProjectActionsProps) {
    const { showToast } = useToast();
    const router = useRouter();
    const [isGenerating, setIsGenerating] = useState(false);

    // Função para Gerar PDF (Lógica de Impressão)
    const handleGeneratePDF = () => {
        setIsGenerating(true);
        showToast(
            "Gerando Documento",
            "info",
            "Preparando versão de impressão..."
        );

        // Pequeno delay para o feedback visual
        setTimeout(() => {
            window.print(); // Abre a janela de impressão do navegador
            setIsGenerating(false);
        }, 1000);
    };

    // Função para Editar (Redirecionamento ou Modal)
    const handleEdit = () => {
        // Se sua lógica de edição for em uma página separada:
        router.push(`/admin/projects/edit/${projectId}`);

        // Se for um modal que você já tem, você dispararia o estado do modal aqui
        showToast(
            "Editar Projeto",
            "info",
            "Abrindo editor..."
        );
    };

    return (
        <div className="flex gap-3 no-print">
            {" "}
            {/* 'no-print' evita que os botões saiam no PDF */}
            <button
                onClick={handleGeneratePDF}
                disabled={isGenerating}
                className="bg-white/5 hover:bg-white/10 text-white px-6 py-4 rounded-2xl font-black uppercase italic tracking-tighter text-xs transition-all border border-white/5 flex items-center gap-2 disabled:opacity-50"
            >
                {isGenerating ? (
                    <Loader2
                        size={14}
                        className="animate-spin"
                    />
                ) : (
                    <FileText size={14} />
                )}
                Gerar Ordem de Serviço
            </button>
            <button
                onClick={handleEdit}
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black uppercase italic tracking-tighter text-xs transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
            >
                <Pencil size={14} />
                Editar Projeto
            </button>
        </div>
    );
}
