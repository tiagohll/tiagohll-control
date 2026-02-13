"use client";

import { motion } from "framer-motion";

export default function FeedbackItem({
    feedback,
    index,
}: {
    feedback: any;
    index: number;
}) {
    // Garante que answers seja sempre um objeto, mesmo se vier nulo do banco
    const answers = feedback.answers || {};
    // Garante um nome padrão se o join com a tabela 'sites' falhar
    const siteName =
        feedback.sites?.name ||
        (Array.isArray(feedback.sites)
            ? feedback.sites[0]?.name
            : null) ||
        "SITE NÃO VINCULADO";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#0c0c0c] border border-white/5 rounded-[2rem] p-8 flex flex-col justify-between hover:border-blue-500/30 transition-all group min-h-[300px]"
        >
            <div>
                <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-col">
                        <span className="text-white font-black uppercase text-sm tracking-tighter">
                            {siteName}
                        </span>
                        <span className="text-zinc-600 font-bold text-[10px] uppercase tracking-widest mt-1">
                            {feedback.created_at
                                ? new Date(
                                      feedback.created_at
                                  ).toLocaleDateString(
                                      "pt-BR"
                                  )
                                : "DATA INDISPONÍVEL"}
                        </span>
                    </div>
                    <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-black text-zinc-400 uppercase">
                        {feedback.version || "v1"}
                    </span>
                </div>

                <div className="space-y-4">
                    {Object.entries(answers).length > 0 ? (
                        Object.entries(answers).map(
                            ([pergunta, resposta]) => (
                                <div
                                    key={pergunta}
                                    className="flex flex-col gap-2"
                                >
                                    <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">
                                        {pergunta.replace(
                                            /_/g,
                                            " "
                                        )}
                                    </span>
                                    <p className="text-zinc-300 text-xs font-medium leading-relaxed italic">
                                        "{String(resposta)}"
                                    </p>
                                </div>
                            )
                        )
                    ) : (
                        <span className="text-[10px] text-zinc-700 uppercase font-bold tracking-widest italic">
                            Sem respostas detalhadas
                        </span>
                    )}
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                <span className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.3em]">
                    ID:{" "}
                    {feedback.id
                        ? feedback.id.split("-")[0]
                        : "---"}
                </span>
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            </div>
        </motion.div>
    );
}
