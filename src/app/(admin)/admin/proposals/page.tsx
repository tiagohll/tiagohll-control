"use client";

import { useState, useEffect } from "react";
import {
    ChevronDown,
    Copy,
    CheckCircle,
    MapPin,
    MessageCircle,
    DollarSign,
    Clock,
    Briefcase,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/context/ToastContext";

export default function ProposalsPage() {
    const supabase = createClient();
    const [templates, setTemplates] = useState<any[]>([]);
    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { showToast } = useToast();

    const [selectedTemplate, setSelectedTemplate] =
        useState<any>(null);

    // Estado para os dados do formulário
    const [formData, setFormData] = useState({
        clientName: "",
        clientCity: "",
        clientState: "",
        clientWhatsapp: "",
        paymentMethod: "50% entrada + 50% na entrega",
        // Campos para quando for customizado:
        customName: "",
        customPrice: "",
        customDelivery: "",
    });

    useEffect(() => {
        async function loadTemplates() {
            const { data } = await supabase
                .from("service_templates")
                .select("*")
                .order("price", { ascending: true });
            if (data) setTemplates(data);
        }
        loadTemplates();
    }, []);

    // Lógica para definir os valores que vão no texto final
    const infoServico = {
        nome:
            selectedTemplate?.id === "custom"
                ? formData.customName
                : selectedTemplate?.name,
        preco:
            selectedTemplate?.id === "custom"
                ? formData.customPrice
                : selectedTemplate?.price,
        prazo:
            selectedTemplate?.id === "custom"
                ? formData.customDelivery
                : selectedTemplate?.delivery_days,
    };

    const termoGerado = `
TERMO DE ACORDO / PROPOSTA ACEITA

PROFISSIONAL: Tiago Henrique Lopes de Lima
LOCALIDADE: Lagoa Formosa/MG
WHATSAPP: (34) 9 9680-5599

CLIENTE: ${formData.clientName || "____________________"}
CIDADE/UF: ${formData.clientCity || "____"}/${formData.clientState || "__"}

SERVIÇO CONTRATADO: ${infoServico.nome || "Não selecionado"}
VALOR TOTAL: R$ ${infoServico.preco || "0,00"}
FORMA DE PAGAMENTO: ${formData.paymentMethod}
PRAZO DE ENTREGA: ${infoServico.prazo || "X"} dias úteis.

REGRAS DE CANCELAMENTO E MANUTENÇÃO:
1. Manutenção mensal de R$ 39,90 obrigatória após o 1º mês.
2. Em caso de atraso na manutenção (>7 dias), o serviço será suspenso.
3. Taxa de reativação de serviço suspenso: R$ 79,00.

"Ao realizar o pagamento inicial, o cliente declara estar de acordo com os termos acima."`.trim();

    const handleSaveProposal = async () => {
        if (!selectedTemplate || !formData.clientName) {
            return showToast(
                "Erro",
                "error",
                "Preencha o nome do cliente e selecione um plano!"
            );
        }

        setIsSaving(true);
        const { error } = await supabase
            .from("proposals")
            .insert([
                {
                    client_name: formData.clientName,
                    client_whatsapp:
                        formData.clientWhatsapp,
                    client_city: formData.clientCity,
                    client_state: formData.clientState,
                    total_price: parseFloat(
                        String(infoServico.preco).replace(
                            ",",
                            "."
                        )
                    ),
                    status: "pending",
                    template_id:
                        selectedTemplate.id === "custom"
                            ? null
                            : selectedTemplate.id,
                    content: termoGerado,
                },
            ]);

        setIsSaving(false);
        if (!error)
            showToast(
                "Sucesso",
                "success",
                "Proposta salva!"
            );
        else showToast("Erro", "error", error.message);
    };

    const handleSendWhatsApp = () => {
        const cleanNumber = formData.clientWhatsapp.replace(
            /\D/g,
            ""
        );
        if (!cleanNumber)
            return showToast(
                "Erro",
                "error",
                "WhatsApp inválido!"
            );
        window.open(
            `https://wa.me/55${cleanNumber}?text=${encodeURIComponent(termoGerado)}`,
            "_blank"
        );
    };

    return (
        <div className="space-y-10">
            <div>
                {" "}
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
                    TEMPLATES DE SERVIÇOS
                    <span className="text-blue-600">.</span>
                </h1>
                <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mt-1">
                    {templates.length} registros encontrados
                    na base
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* COLUNA ESQUERDA: FORMULÁRIO */}
                <div className="space-y-6 bg-zinc-900/40 p-6 md:p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-sm">
                    {/* SELECT DE PLANOS */}
                    <div className="relative">
                        <label className="text-[10px] font-black uppercase text-zinc-500 ml-2 mb-2 block">
                            Plano Base
                        </label>
                        <button
                            onClick={() =>
                                setIsSelectOpen(
                                    !isSelectOpen
                                )
                            }
                            className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white text-left flex justify-between items-center hover:border-blue-500/50 transition-all"
                        >
                            <span className="font-bold text-xs uppercase">
                                {selectedTemplate?.name ||
                                    "Escolha uma base..."}
                            </span>
                            <ChevronDown
                                size={18}
                                className={
                                    isSelectOpen
                                        ? "rotate-180 transition-transform"
                                        : "transition-transform"
                                }
                            />
                        </button>

                        <AnimatePresence>
                            {isSelectOpen && (
                                <motion.div
                                    initial={{
                                        opacity: 0,
                                        y: -10,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    exit={{
                                        opacity: 0,
                                        y: -10,
                                    }}
                                    className="absolute z-50 w-full mt-2 bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                                >
                                    <button
                                        onClick={() => {
                                            setSelectedTemplate(
                                                {
                                                    id: "custom",
                                                    name: "➕ PERSONALIZADO",
                                                }
                                            );
                                            setIsSelectOpen(
                                                false
                                            );
                                        }}
                                        className="w-full p-4 text-left hover:bg-blue-600 text-[10px] font-black uppercase text-blue-400 hover:text-white border-b border-white/5"
                                    >
                                        + Criar do Zero
                                        (Customizado)
                                    </button>
                                    {templates.map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => {
                                                setSelectedTemplate(
                                                    t
                                                );
                                                setIsSelectOpen(
                                                    false
                                                );
                                            }}
                                            className="w-full p-4 text-left hover:bg-zinc-800 text-[11px] font-bold uppercase text-zinc-300 flex justify-between"
                                        >
                                            {t.name}{" "}
                                            <span className="text-blue-500 text-[10px]">
                                                R$ {t.price}
                                            </span>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* CAMPOS DINÂMICOS PARA CUSTOMIZADO */}
                    {selectedTemplate?.id === "custom" && (
                        <motion.div
                            initial={{
                                opacity: 0,
                                height: 0,
                            }}
                            animate={{
                                opacity: 1,
                                height: "auto",
                            }}
                            className="space-y-4 pt-2"
                        >
                            <div className="grid grid-cols-1 gap-4">
                                <div className="relative">
                                    <Briefcase
                                        className="absolute left-4 top-4 text-zinc-500"
                                        size={16}
                                    />
                                    <input
                                        placeholder="Nome do Serviço Customizado"
                                        className="w-full bg-blue-500/5 border border-blue-500/20 rounded-2xl p-4 pl-12 text-white text-sm outline-none focus:border-blue-500"
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                customName:
                                                    e.target
                                                        .value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative">
                                        <DollarSign
                                            className="absolute left-4 top-4 text-zinc-500"
                                            size={16}
                                        />
                                        <input
                                            placeholder="Valor (ex: 1200)"
                                            type="number"
                                            className="w-full bg-blue-500/5 border border-blue-500/20 rounded-2xl p-4 pl-12 text-white text-sm outline-none focus:border-blue-500"
                                            onChange={(e) =>
                                                setFormData(
                                                    {
                                                        ...formData,
                                                        customPrice:
                                                            e
                                                                .target
                                                                .value,
                                                    }
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="relative">
                                        <Clock
                                            className="absolute left-4 top-4 text-zinc-500"
                                            size={16}
                                        />
                                        <input
                                            placeholder="Dias úteis"
                                            type="number"
                                            className="w-full bg-blue-500/5 border border-blue-500/20 rounded-2xl p-4 pl-12 text-white text-sm outline-none focus:border-blue-500"
                                            onChange={(e) =>
                                                setFormData(
                                                    {
                                                        ...formData,
                                                        customDelivery:
                                                            e
                                                                .target
                                                                .value,
                                                    }
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <hr className="border-white/5" />

                    {/* DADOS DO CLIENTE */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-zinc-500 ml-2 block">
                            Dados do Cliente
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                placeholder="Nome do Cliente"
                                className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-blue-500"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        clientName:
                                            e.target.value,
                                    })
                                }
                            />
                            <input
                                placeholder="WhatsApp (com DDD)"
                                className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-blue-500"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        clientWhatsapp:
                                            e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <input
                                placeholder="Cidade"
                                className="col-span-2 bg-black border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-blue-500"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        clientCity:
                                            e.target.value,
                                    })
                                }
                            />
                            <input
                                placeholder="UF"
                                maxLength={2}
                                className="bg-black border border-white/10 rounded-2xl p-4 text-white text-sm text-center uppercase outline-none focus:border-blue-500"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        clientState:
                                            e.target.value,
                                    })
                                }
                            />
                        </div>

                        <input
                            value={formData.paymentMethod}
                            placeholder="Forma de Pagamento"
                            className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-blue-500"
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    paymentMethod:
                                        e.target.value,
                                })
                            }
                        />
                    </div>

                    <button
                        onClick={handleSaveProposal}
                        disabled={isSaving}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 text-white py-5 rounded-2xl font-black uppercase text-xs transition-all flex justify-center items-center gap-2 shadow-lg shadow-blue-900/20"
                    >
                        {isSaving ? (
                            "Salvando..."
                        ) : (
                            <>
                                <CheckCircle size={16} />{" "}
                                Salvar Proposta
                            </>
                        )}
                    </button>
                </div>

                {/* COLUNA DIREITA: PREVIEW */}
                <div className="bg-[#050505] border border-white/5 rounded-[3rem] p-8  flex flex-col shadow-2xl h-fit sticky top-8">
                    <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                            Preview do Termo
                        </span>
                        <MapPin
                            size={16}
                            className="text-zinc-700"
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto max-h-[450px] mb-6 scrollbar-hide">
                        <pre className="text-[11px] text-zinc-400 font-mono whitespace-pre-wrap leading-relaxed bg-zinc-900/30 p-5 rounded-3xl border border-white/5">
                            {termoGerado}
                        </pre>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(
                                    termoGerado
                                );
                                showToast(
                                    "Copiado!",
                                    "success",
                                    "Texto na área de transferência."
                                );
                            }}
                            className="flex-1 flex items-center justify-center gap-2 text-zinc-500 text-[10px] font-black uppercase border border-white/5 rounded-xl py-4 hover:bg-white/5 transition-all"
                        >
                            <Copy size={14} /> Copiar
                        </button>
                        <button
                            onClick={handleSendWhatsApp}
                            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-4 rounded-xl font-black text-[10px] uppercase hover:bg-emerald-500 transition-all"
                        >
                            <MessageCircle size={14} />{" "}
                            WhatsApp
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
