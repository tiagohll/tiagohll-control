"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";
import { createClient } from "@/lib/supabase/client";
import {
    X,
    CreditCard,
    User,
    Save,
    Power,
} from "lucide-react";

export function CustomerManagerModal({
    customer,
    isOpen,
    onClose,
    onUpdate,
}: any) {
    const { showToast } = useToast();
    const supabase = createClient();

    const [activeTab, setActiveTab] = useState<
        "info" | "subscription"
    >("info");
    const [loading, setLoading] = useState(false);

    // 1. Iniciamos os estados vazios para evitar o erro de 'null'
    const [formData, setFormData] = useState({
        name: "",
        whatsapp: "",
        email: "",
    });
    const [subData, setSubData] = useState({
        service_name: "",
        monthly_fee: 0,
        status: "inactive",
    });

    // 2. Sempre que o 'customer' mudar (ao clicar em outro cliente), atualizamos o form
    useEffect(() => {
        if (customer) {
            setFormData({
                name: customer.name || "",
                whatsapp: customer.whatsapp || "",
                email: customer.email || "",
            });
            setSubData({
                service_name:
                    customer.subscriptions?.service_name ||
                    "",
                monthly_fee:
                    customer.subscriptions?.monthly_fee ||
                    0,
                status:
                    customer.subscriptions?.status ||
                    "inactive",
            });
        }
    }, [customer]);

    // Se não estiver aberto ou não tiver cliente, não renderiza nada
    if (!isOpen || !customer) return null;

    const handleSave = async () => {
        setLoading(true);
        try {
            const { error: custError } = await supabase
                .from("customers")
                .update(formData)
                .eq("id", customer.id);

            const { error: subError } = await supabase
                .from("subscriptions")
                .upsert({
                    customer_id: customer.id,
                    service_name: subData.service_name,
                    monthly_fee: subData.monthly_fee,
                    status: subData.status,
                });

            if (custError || subError) throw new Error();

            showToast(
                "Sucesso",
                "success",
                "Dados atualizados!"
            );
            onUpdate();
            onClose();
        } catch (error) {
            showToast("Erro", "error", "Falha ao salvar.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-950 border border-white/10 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="p-8 border-b border-white/5 flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-black italic uppercase tracking-tighter">
                            Gestão do Cliente
                        </h2>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                            CÓDIGO: {customer.client_code}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/5">
                    <button
                        onClick={() => setActiveTab("info")}
                        className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === "info" ? "text-blue-500 bg-blue-500/5" : "text-zinc-500"}`}
                    >
                        <User
                            size={14}
                            className="inline mr-2"
                        />{" "}
                        Dados Básicos
                    </button>
                    <button
                        onClick={() =>
                            setActiveTab("subscription")
                        }
                        className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === "subscription" ? "text-blue-500 bg-blue-500/5" : "text-zinc-500"}`}
                    >
                        <CreditCard
                            size={14}
                            className="inline mr-2"
                        />{" "}
                        Assinatura
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    {activeTab === "info" ? (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">
                                    Nome
                                </label>
                                <input
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target
                                                .value,
                                        })
                                    }
                                    className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">
                                        WhatsApp
                                    </label>
                                    <input
                                        value={
                                            formData.whatsapp
                                        }
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                whatsapp:
                                                    e.target
                                                        .value,
                                            })
                                        }
                                        className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">
                                        E-mail
                                    </label>
                                    <input
                                        value={
                                            formData.email
                                        }
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                email: e
                                                    .target
                                                    .value,
                                            })
                                        }
                                        className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-6 bg-white/5 rounded-[2rem] border border-white/5">
                                <div>
                                    <p className="text-[10px] font-black uppercase text-zinc-500">
                                        Status da Assinatura
                                    </p>
                                    <p
                                        className={`text-xl font-black italic uppercase ${subData.status === "active" ? "text-green-500" : "text-zinc-500"}`}
                                    >
                                        {subData.status ===
                                        "active"
                                            ? "Ativada"
                                            : "Desativada"}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSubData({
                                            ...subData,
                                            status:
                                                subData.status ===
                                                "active"
                                                    ? "inactive"
                                                    : "active",
                                        })
                                    }
                                    className={`p-4 rounded-2xl transition-all ${subData.status === "active" ? "bg-red-500/10 text-red-500 hover:bg-red-500/20" : "bg-green-500/10 text-green-500 hover:bg-green-500/20"}`}
                                >
                                    <Power size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">
                                        Serviço
                                    </label>
                                    <input
                                        value={
                                            subData.service_name
                                        }
                                        onChange={(e) =>
                                            setSubData({
                                                ...subData,
                                                service_name:
                                                    e.target
                                                        .value,
                                            })
                                        }
                                        className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">
                                        Valor (R$)
                                    </label>
                                    <input
                                        type="number"
                                        value={
                                            subData.monthly_fee
                                        }
                                        onChange={(e) =>
                                            setSubData({
                                                ...subData,
                                                monthly_fee:
                                                    Number(
                                                        e
                                                            .target
                                                            .value
                                                    ),
                                            })
                                        }
                                        className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-8 border-t border-white/5 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl font-black uppercase italic text-xs transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-black uppercase italic text-xs transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            "Salvando..."
                        ) : (
                            <>
                                <Save size={16} /> Salvar
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
