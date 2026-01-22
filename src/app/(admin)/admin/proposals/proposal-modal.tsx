"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Send, User, Hash } from "lucide-react";

export function CreateProposalModal({
    templates,
    isOpen,
    onClose,
}: any) {
    const [selectedTemplate, setSelectedTemplate] =
        useState<any>(null);
    const [clientName, setClientName] = useState("");

    const generateContractPreview = () => {
        if (!selectedTemplate) return "";
        return `
            CONTRATO DE PRESTAÇÃO DE SERVIÇO DIGITAL
            ---------------------------------------
            CONTRATADO: THLL CONTROL / SEU NOME
            CONTRATANTE: ${clientName || "[NOME DO CLIENTE]"}
            
            OBJETO: Desenvolvimento de ${selectedTemplate.name} (${selectedTemplate.pages_count} páginas).
            VALOR DO PROJETO: R$ ${selectedTemplate.price} (Pagamento único).
            MANUTENÇÃO MENSAL: R$ 39,00 (Hospedagem e suporte).
            
            CLÁUSULA DE CANCELAMENTO:
            Em caso de inadimplência da mensalidade, o serviço será suspenso após 7 dias.
            Taxa de reativação: R$ 79,00.
        `;
    };

    return (
        // UI similar às anteriores, focada na seleção do template e visualização do texto
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white">
            <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-zinc-500">
                    Selecione o Plano
                </label>
                <select
                    onChange={(e) =>
                        setSelectedTemplate(
                            templates.find(
                                (t: any) =>
                                    t.id === e.target.value
                            )
                        )
                    }
                    className="w-full bg-black border border-white/5 p-4 rounded-2xl outline-none focus:border-blue-500"
                >
                    <option value="">
                        Escolha um template...
                    </option>
                    {templates.map((t: any) => (
                        <option key={t.id} value={t.id}>
                            {t.name} - R$ {t.price}
                        </option>
                    ))}
                </select>

                <label className="text-[10px] font-black uppercase text-zinc-500">
                    Nome do Cliente
                </label>
                <input
                    value={clientName}
                    onChange={(e) =>
                        setClientName(e.target.value)
                    }
                    placeholder="Ex: João da Silva"
                    className="w-full bg-black border border-white/5 p-4 rounded-2xl outline-none focus:border-blue-500"
                />
            </div>

            <div className="bg-zinc-950 p-6 rounded-3xl border border-white/5">
                <h4 className="text-[10px] font-black uppercase text-blue-500 mb-4">
                    Prévia do Contrato
                </h4>
                <pre className="text-[10px] text-zinc-400 font-mono whitespace-pre-wrap leading-relaxed">
                    {generateContractPreview()}
                </pre>
            </div>
        </div>
    );
}
