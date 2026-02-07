import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Lottie from "lottie-react";
import stepOne from "../../../../../../public/animations/tour-step-1.json";

const steps = [
    {
        title: "Bem-vindo ao Dashboard",
        description:
            "Conheça a nova funcionalidade de Banco de Dados e edite seus projetos em tempo real.",
        animation: stepOne,
    },
    {
        title: "Gerencie seus Projetos",
        description:
            "Altere capas, títulos e categorias com apenas alguns cliques de forma intuitiva.",
        animation: null,
    },
    {
        title: "Analytics e QR Codes",
        description:
            "Acompanhe o tráfego de cada projeto e gere QR Codes personalizados para seus clientes.",
        animation: null,
    },
];

export function ProductTourModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [currentStep, setCurrentStep] = useState(0);

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative w-full max-w-[480px] bg-zinc-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
                {/* Botão Fechar */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors z-10"
                >
                    <X size={20} />
                </button>

                <div className="p-10 pt-12">
                    <div className="aspect-square w-full max-w-[320px] mx-auto bg-zinc-950 rounded-3xl mb-8 flex items-center justify-center border border-white/5 overflow-hidden">
                        <Lottie
                            animationData={
                                steps[currentStep].animation
                            }
                            loop={true}
                            style={{
                                width: "100%",
                                height: "100%",
                            }}
                        />
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="text-center space-y-3"
                        >
                            <h2 className="text-2xl font-black tracking-tight text-white">
                                {steps[currentStep].title}
                            </h2>
                            <p className="text-zinc-400 text-sm leading-relaxed px-4">
                                {
                                    steps[currentStep]
                                        .description
                                }
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    {/* Footer / Controles */}
                    <div className="mt-10 flex items-center justify-between">
                        {/* Indicadores de Página (Dots) */}
                        <div className="flex gap-2">
                            {steps.map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                        index ===
                                        currentStep
                                            ? "w-6 bg-blue-600"
                                            : "w-1.5 bg-zinc-700"
                                    }`}
                                />
                            ))}
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={onClose}
                                className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                            >
                                Pular
                            </button>

                            <button
                                onClick={nextStep}
                                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-widest rounded-2xl transition-all shadow-lg active:scale-95"
                            >
                                {currentStep ===
                                steps.length - 1
                                    ? "Começar"
                                    : "Próximo"}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
