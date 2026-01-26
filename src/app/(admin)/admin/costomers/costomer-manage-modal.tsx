"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    CreditCard,
    User,
    Save,
    Power,
    Loader2,
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

    const [formData, setFormData] = useState({
        name: "",
        whatsapp: "",
        email: "",
    });
    const [subData, setSubData] = useState({
        service_name: "Assinatura Mensal",
        monthly_fee: 0,
        status: "inactive",
    });

    useEffect(() => {
        setActiveTab("info");
        if (customer) {
            setFormData({
                name: customer.name,
                whatsapp: customer.whatsapp,
                email: customer.email,
            });
            setSubData({
                service_name:
                    customer.subscriptions?.service_name ||
                    "Assinatura Mensal",
                monthly_fee:
                    customer.subscriptions?.monthly_fee ||
                    0,
                status:
                    customer.subscriptions?.status ||
                    "inactive",
            });
        } else {
            setFormData({
                name: "",
                whatsapp: "",
                email: "",
            });
            setSubData({
                service_name: "Assinatura Mensal",
                monthly_fee: 0,
                status: "inactive",
            });
        }
    }, [customer, isOpen]);

    const handleSave = async () => {
        setLoading(true);
        try {
            let customerId = customer?.id;
            if (customer) {
                await supabase
                    .from("customers")
                    .update(formData)
                    .eq("id", customerId);
            } else {
                const { data: newCust, error: custError } =
                    await supabase
                        .from("customers")
                        .insert([formData])
                        .select()
                        .single();
                if (custError) throw custError;
                customerId = newCust.id;
            }

            const { error: subError } = await supabase
                .from("subscriptions")
                .upsert({
                    customer_id: customerId,
                    service_name: subData.service_name,
                    monthly_fee: subData.monthly_fee,
                    status: subData.status,
                });

            if (subError) throw subError;

            showToast(
                "Sucesso",
                "success",
                customer ? "Atualizado!" : "Cadastrado!"
            );
            onUpdate();
            onClose();
        } catch (error: any) {
            showToast(
                "Erro",
                "error",
                error.message || "Erro ao processar."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{
                            scale: 0.9,
                            opacity: 0,
                            y: 20,
                        }}
                        animate={{
                            scale: 1,
                            opacity: 1,
                            y: 0,
                        }}
                        exit={{
                            scale: 0.9,
                            opacity: 0,
                            y: 20,
                        }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 300,
                        }}
                        className="relative bg-zinc-950 border border-white/10 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)]"
                    >
                        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-b from-white/5 to-transparent">
                            <div>
                                <h2 className="text-3xl font-black italic uppercase tracking-tighter">
                                    {customer
                                        ? "Editar Cliente"
                                        : "Novo Cliente"}
                                </h2>
                                {customer && (
                                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1">
                                        ID:{" "}
                                        {
                                            customer.client_code
                                        }
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="p-3 hover:bg-white/10 rounded-full transition-colors group"
                            >
                                <X
                                    size={20}
                                    className="group-hover:rotate-90 transition-transform duration-300"
                                />
                            </button>
                        </div>

                        <div className="flex border-b border-white/5 px-4 bg-zinc-900/30">
                            {(
                                [
                                    "info",
                                    "subscription",
                                ] as const
                            ).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() =>
                                        setActiveTab(tab)
                                    }
                                    className={`relative flex-1 py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${
                                        activeTab === tab
                                            ? "text-blue-500"
                                            : "text-zinc-500"
                                    }`}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        {tab === "info" ? (
                                            <User
                                                size={14}
                                            />
                                        ) : (
                                            <CreditCard
                                                size={14}
                                            />
                                        )}
                                        {tab === "info"
                                            ? "Dados Básicos"
                                            : "Assinatura"}
                                    </div>
                                    {activeTab === tab && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.8)]"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Content Area */}
                        <div className="p-8 min-h-[300px]">
                            <AnimatePresence mode="wait">
                                {activeTab === "info" ? (
                                    <motion.div
                                        key="info"
                                        initial={{
                                            x: 10,
                                            opacity: 0,
                                        }}
                                        animate={{
                                            x: 0,
                                            opacity: 1,
                                        }}
                                        exit={{
                                            x: -10,
                                            opacity: 0,
                                        }}
                                        className="space-y-6"
                                    >
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">
                                                Nome
                                                Completo
                                            </label>
                                            <input
                                                value={
                                                    formData.name
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    setFormData(
                                                        {
                                                            ...formData,
                                                            name: e
                                                                .target
                                                                .value,
                                                        }
                                                    )
                                                }
                                                className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl focus:border-blue-500/50 focus:bg-white/[0.08] outline-none transition-all"
                                                placeholder="Ex: John Wick"
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
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        setFormData(
                                                            {
                                                                ...formData,
                                                                whatsapp:
                                                                    e
                                                                        .target
                                                                        .value,
                                                            }
                                                        )
                                                    }
                                                    className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl focus:border-blue-500/50 outline-none transition-all"
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
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        setFormData(
                                                            {
                                                                ...formData,
                                                                email: e
                                                                    .target
                                                                    .value,
                                                            }
                                                        )
                                                    }
                                                    className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl focus:border-blue-500/50 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="sub"
                                        initial={{
                                            x: 10,
                                            opacity: 0,
                                        }}
                                        animate={{
                                            x: 0,
                                            opacity: 1,
                                        }}
                                        exit={{
                                            x: -10,
                                            opacity: 0,
                                        }}
                                        className="space-y-6"
                                    >
                                        <motion.div
                                            whileHover={{
                                                scale: 1.01,
                                            }}
                                            className="flex items-center justify-between p-6 bg-blue-500/5 rounded-[2rem] border border-blue-500/10"
                                        >
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-blue-500/60">
                                                    Status
                                                    da Conta
                                                </p>
                                                <p
                                                    className={`text-2xl font-black italic uppercase ${subData.status === "active" ? "text-green-500" : "text-zinc-600"}`}
                                                >
                                                    {subData.status ===
                                                    "active"
                                                        ? "Assinatura Ativa"
                                                        : "Inativa"}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSubData(
                                                        {
                                                            ...subData,
                                                            status:
                                                                subData.status ===
                                                                "active"
                                                                    ? "inactive"
                                                                    : "active",
                                                        }
                                                    )
                                                }
                                                className={`p-5 rounded-2xl transition-all shadow-lg ${
                                                    subData.status ===
                                                    "active"
                                                        ? "bg-red-500 text-white hover:bg-red-600 shadow-red-500/20"
                                                        : "bg-green-600 text-white hover:bg-green-500 shadow-green-500/20"
                                                }`}
                                            >
                                                <Power
                                                    size={
                                                        24
                                                    }
                                                />
                                            </button>
                                        </motion.div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">
                                                    Plano /
                                                    Serviço
                                                </label>
                                                <input
                                                    value={
                                                        subData.service_name
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        setSubData(
                                                            {
                                                                ...subData,
                                                                service_name:
                                                                    e
                                                                        .target
                                                                        .value,
                                                            }
                                                        )
                                                    }
                                                    className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl outline-none focus:border-blue-500/50"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">
                                                    Valor
                                                    Mensal
                                                    (R$)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={
                                                        subData.monthly_fee
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        setSubData(
                                                            {
                                                                ...subData,
                                                                monthly_fee:
                                                                    Number(
                                                                        e
                                                                            .target
                                                                            .value
                                                                    ),
                                                            }
                                                        )
                                                    }
                                                    className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl outline-none focus:border-blue-500/50 font-mono"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Footer */}
                        <div className="p-8 border-t border-white/5 flex gap-4 bg-zinc-900/20">
                            <button
                                onClick={onClose}
                                className="flex-1 px-6 py-4 rounded-2xl font-black uppercase italic text-xs transition-all border border-white/5 hover:bg-white/5"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="flex-[2] bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-4 rounded-2xl font-black uppercase italic text-xs transition-all flex items-center justify-center gap-3 shadow-[0_10px_20px_-5px_rgba(37,99,235,0.4)]"
                            >
                                {loading ? (
                                    <Loader2
                                        className="animate-spin"
                                        size={18}
                                    />
                                ) : (
                                    <>
                                        <Save size={18} />
                                        {customer
                                            ? "Salvar Alterações"
                                            : "Confirmar Cadastro"}
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
