"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";
import { addServiceTemplate } from "../lib/actions";

export function AddTemplateModal({ isOpen, onClose }: any) {
    const [loading, setLoading] = useState(false);
    const [hasThll, setHasThll] = useState(false);
    const [features, setFeatures] = useState<string[]>([
        "",
    ]);

    const addFeatureField = () =>
        setFeatures([...features, ""]);

    const updateFeature = (
        index: number,
        value: string
    ) => {
        const newFeatures = [...features];
        newFeatures[index] = value;
        setFeatures(newFeatures);
    };

    async function handleSubmit(
        e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);

        const data = {
            name: formData.get("name"),
            price: parseFloat(
                formData.get("price") as string
            ),
            delivery_days: parseInt(
                formData.get("delivery_days") as string
            ),
            pages_count: parseInt(
                formData.get("pages_count") as string
            ),
            has_thll_control: hasThll,
            features: features.filter(
                (f) => f.trim() !== ""
            ),
        };

        try {
            await addServiceTemplate(data);
            onClose();
        } catch (err) {
            alert("Erro ao salvar template.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
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
                        className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black uppercase text-white">
                                Novo Template de Pacote
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/5 rounded-full"
                            >
                                <X
                                    size={20}
                                    className="text-zinc-500"
                                />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">
                                        Nome do Plano
                                    </label>
                                    <input
                                        name="name"
                                        required
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">
                                        Preço (R$)
                                    </label>
                                    <input
                                        name="price"
                                        type="number"
                                        step="0.01"
                                        required
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase ml-2 tracking-widest text-center block">
                                        Dias p/ Entrega
                                    </label>
                                    <input
                                        name="delivery_days"
                                        type="number"
                                        required
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-center outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase ml-2 tracking-widest text-center block">
                                        Nº de Páginas
                                    </label>
                                    <input
                                        name="pages_count"
                                        type="number"
                                        required
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-center outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center block">
                                        THLL Control?
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setHasThll(
                                                !hasThll
                                            )
                                        }
                                        className={`w-full h-[56px] rounded-2xl border transition-all flex items-center justify-center font-black text-[10px] uppercase ${hasThll ? "bg-emerald-500/10 border-emerald-500 text-emerald-500" : "bg-black/40 border-white/5 text-zinc-500"}`}
                                    >
                                        {hasThll
                                            ? "Sim, incluso"
                                            : "Não incluso"}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">
                                    Benefícios (Features)
                                </label>
                                {features.map((feat, i) => (
                                    <input
                                        key={i}
                                        value={feat}
                                        onChange={(e) =>
                                            updateFeature(
                                                i,
                                                e.target
                                                    .value
                                            )
                                        }
                                        placeholder="Ex: Domínio Configurado"
                                        className="w-full bg-black/20 border border-white/5 rounded-xl p-3 text-xs text-white outline-none mb-2"
                                    />
                                ))}
                                <button
                                    type="button"
                                    onClick={
                                        addFeatureField
                                    }
                                    className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase hover:text-blue-400 transition-colors"
                                >
                                    <Plus size={14} />{" "}
                                    Adicionar Benefício
                                </button>
                            </div>

                            <button
                                disabled={loading}
                                className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-[2px] text-xs hover:scale-[1.02] transition-all disabled:opacity-50"
                            >
                                {loading
                                    ? "Salvando..."
                                    : "Criar Template"}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
