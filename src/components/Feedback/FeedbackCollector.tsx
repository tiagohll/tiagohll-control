"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle2,
    Sparkles,
    ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

// --- CONFIGURAÇÃO DAS PERGUNTAS (Fácil de editar/adicionar) ---
const FEEDBACK_STEPS = [
    {
        id: "valor_percebido",
        question:
            "Esse sistema está resolvendo o problema que você esperava?",
        type: "select",
        options: [
            "Nada",
            "Pouco",
            "Mais ou menos",
            "Bem",
            "Muito bem",
        ],
    },
    {
        id: "confusao_inicial",
        question: "O que foi mais confuso no início?",
        type: "select",
        options: [
            "Criar o site",
            "Editar conteúdo",
            "Entender analytics",
            "QR Code",
            "Nada foi confuso",
        ],
    },
    {
        id: "momento_irritacao",
        question:
            "Teve algum momento que você travou ou ficou irritado? O que houve?",
        type: "text",
        placeholder:
            "Seja sincero. Isso aqui é para melhorar o produto, não para agradar.",
    },
    {
        id: "uso_real",
        question: "O que você mais usa hoje?",
        type: "select",
        options: [
            "Edição de conteúdo",
            "Analytics",
            "QR Code",
            "Só publiquei e quase não mexo",
            "Ainda estou explorando",
        ],
    },
    {
        id: "churn_impacto",
        question:
            "Se esse sistema deixasse de existir amanhã, isso seria um problema?",
        type: "select",
        options: [
            "Nenhum",
            "Pequeno",
            "Médio",
            "Grande",
            "Muito grande",
        ],
    },
    {
        id: "motivo_parada",
        question:
            "O que faria você parar de usar esse sistema?",
        type: "text",
        placeholder:
            "Risco de cancelamento, falhas graves ou algo que o concorrente faz melhor...",
    },
];

export default function FeedbackCollector({
    userId,
    siteId,
    showTrigger,
}: {
    userId: string;
    siteId: string;
    showTrigger: boolean;
}) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);
    const [step, setStep] = useState(0); // Index do array (0 a 5)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    // Estado inicial dinâmico baseado no ID das perguntas
    const [answers, setAnswers] = useState<
        Record<string, string>
    >(
        Object.fromEntries(
            FEEDBACK_STEPS.map((s) => [s.id, ""])
        )
    );

    const totalSteps = FEEDBACK_STEPS.length;
    const currentQuestion = FEEDBACK_STEPS[step];

    const submitFeedback = async () => {
        setIsSubmitting(true);
        const supabase = createClient();
        const { error } = await supabase
            .from("user_feedback")
            .insert({
                user_id: userId,
                site_id: siteId,
                answers: answers, // Envia o objeto JSON completo
                version: "v1",
            });

        if (!error) {
            setIsFinished(true);
            router.refresh();
            setTimeout(() => {
                setIsOpen(false);
                setIsDismissed(true);
            }, 3000);
        }
        setIsSubmitting(false);
    };

    const handleNext = () => {
        if (step < totalSteps - 1) setStep(step + 1);
        else submitFeedback();
    };

    if (!showTrigger || isDismissed) return null;

    return (
        <>
            {/* BANNER DE CONVITE */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full mb-8 p-6 bg-gradient-to-r from-blue-600/20 via-blue-600/5 to-transparent border border-blue-500/20 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-4"
            >
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                        <Sparkles
                            className="text-white"
                            size={24}
                        />
                    </div>
                    <div>
                        <h4 className="text-white font-black uppercase tracking-tighter text-lg">
                            Sua opinião molda o sistema
                            <span className="text-blue-500">
                                .
                            </span>
                        </h4>
                        <p className="text-zinc-400 text-xs font-medium">
                            Leva 2 minutos e nos ajuda a não
                            criar coisas inúteis.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsDismissed(true)}
                        className="px-4 py-2 text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors"
                    >
                        Agora não
                    </button>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="px-8 py-3 bg-white text-black hover:bg-blue-50 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-95"
                    >
                        Dar Feedback
                    </button>
                </div>
            </motion.div>

            {/* MODAL MULTI-STEP */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0.9,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.9,
                            }}
                            className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl"
                        >
                            {/* Barra de Progresso */}
                            <div className="h-1.5 w-full bg-zinc-800">
                                <motion.div
                                    className="h-full bg-blue-600"
                                    initial={{ width: 0 }}
                                    animate={{
                                        width: `${((step + 1) / totalSteps) * 100}%`,
                                    }}
                                />
                            </div>

                            <div className="p-10">
                                {isFinished ? (
                                    <div className="py-10 text-center space-y-4">
                                        <CheckCircle2
                                            size={48}
                                            className="text-green-500 mx-auto"
                                        />
                                        <h3 className="text-2xl font-black uppercase italic text-white">
                                            Valeu pela
                                            honestidade!
                                        </h3>
                                        <p className="text-zinc-400 text-sm">
                                            Suas respostas
                                            foram salvas.
                                            Isso nos ajuda
                                            muito.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="min-h-[400px] flex flex-col justify-between">
                                        <div>
                                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">
                                                Pergunta{" "}
                                                {step + 1}{" "}
                                                de{" "}
                                                {totalSteps}
                                            </span>

                                            <AnimatePresence mode="wait">
                                                <motion.div
                                                    key={
                                                        step
                                                    }
                                                    initial={{
                                                        opacity: 0,
                                                        x: 20,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        x: 0,
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        x: -20,
                                                    }}
                                                    className="mt-4"
                                                >
                                                    <h2 className="text-2xl font-black text-white leading-tight tracking-tighter uppercase italic mb-6">
                                                        {
                                                            currentQuestion.question
                                                        }
                                                    </h2>

                                                    {currentQuestion.type ===
                                                    "select" ? (
                                                        <div className="grid gap-2">
                                                            {currentQuestion.options?.map(
                                                                (
                                                                    opt
                                                                ) => (
                                                                    <button
                                                                        key={
                                                                            opt
                                                                        }
                                                                        onClick={() =>
                                                                            setAnswers(
                                                                                {
                                                                                    ...answers,
                                                                                    [currentQuestion.id]:
                                                                                        opt,
                                                                                }
                                                                            )
                                                                        }
                                                                        className={`w-full text-left px-6 py-4 rounded-2xl border transition-all text-sm font-bold ${
                                                                            answers[
                                                                                currentQuestion
                                                                                    .id
                                                                            ] ===
                                                                            opt
                                                                                ? "bg-blue-600/10 border-blue-500 text-white"
                                                                                : "bg-zinc-800/50 border-white/5 text-zinc-400 hover:border-white/20 hover:text-white"
                                                                        }`}
                                                                    >
                                                                        {
                                                                            opt
                                                                        }
                                                                    </button>
                                                                )
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <textarea
                                                            className="w-full bg-zinc-800 border border-white/5 rounded-2xl p-4 text-white placeholder:text-zinc-600 focus:border-blue-500 outline-none transition-all resize-none"
                                                            rows={
                                                                5
                                                            }
                                                            placeholder={
                                                                currentQuestion.placeholder
                                                            }
                                                            value={
                                                                answers[
                                                                    currentQuestion
                                                                        .id
                                                                ]
                                                            }
                                                            onChange={(
                                                                e
                                                            ) =>
                                                                setAnswers(
                                                                    {
                                                                        ...answers,
                                                                        [currentQuestion.id]:
                                                                            e
                                                                                .target
                                                                                .value,
                                                                    }
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </motion.div>
                                            </AnimatePresence>
                                        </div>

                                        <div className="mt-10 flex justify-between items-center">
                                            <button
                                                onClick={() =>
                                                    setIsOpen(
                                                        false
                                                    )
                                                }
                                                className="text-zinc-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest"
                                            >
                                                Sair
                                            </button>

                                            <button
                                                disabled={
                                                    isSubmitting ||
                                                    (currentQuestion.type ===
                                                        "select" &&
                                                        !answers[
                                                            currentQuestion
                                                                .id
                                                        ])
                                                }
                                                onClick={
                                                    handleNext
                                                }
                                                className="flex items-center gap-2 px-10 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-blue-500 disabled:opacity-30 transition-all active:scale-95"
                                            >
                                                {isSubmitting
                                                    ? "Enviando..."
                                                    : step ===
                                                        totalSteps -
                                                            1
                                                      ? "Finalizar"
                                                      : "Próximo"}
                                                <ChevronRight
                                                    size={
                                                        14
                                                    }
                                                />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
