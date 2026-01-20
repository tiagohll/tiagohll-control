"use client";

import {
    useEffect,
    useState,
    useRef,
    useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
    Sparkles,
    Send,
    User,
    Terminal,
} from "lucide-react";

const getProcessedStats = (events: any[]) => {
    if (!events || events.length === 0)
        return "Sem dados disponíveis.";

    const total = events.length;
    const clicks = events.filter(
        (e) => e.event_type === "click"
    ).length;
    const qrTraffic = events.filter((e) =>
        e.event_type.startsWith("qr_")
    ).length;
    const ctr = ((clicks / total) * 100).toFixed(2);

    // Identificar horários de pico
    const hours = events.map((e) =>
        new Date(e.created_at).getHours()
    );
    const hourCounts: Record<number, number> = {};
    hours.forEach(
        (h) => (hourCounts[h] = (hourCounts[h] || 0) + 1)
    );
    const peakHour = Object.keys(hourCounts).reduce(
        (a, b) =>
            hourCounts[Number(a)] > hourCounts[Number(b)]
                ? a
                : b,
        "0"
    );

    // Identificar conversão noturna (exemplo de insight profundo)
    const nightEvents = events.filter((e) => {
        const h = new Date(e.created_at).getHours();
        return h >= 18 || h <= 6;
    });
    const nightClicks = nightEvents.filter(
        (e) => e.event_type === "click"
    ).length;
    const nightCtr =
        nightEvents.length > 0
            ? (
                  (nightClicks / nightEvents.length) *
                  100
              ).toFixed(2)
            : "0";

    return `
    RESUMO ESTATÍSTICO (CONTEXTO REAL):
    - Volume Total: ${total} eventos.
    - Taxa de Clique Geral (CTR): ${ctr}%.
    - Origem QR Code: ${qrTraffic} acessos (${((qrTraffic / total) * 100).toFixed(1)}% do tráfego).
    - Horário de Pico: ${peakHour}:00h.
    - Performance Noturna (18h-06h): ${nightEvents.length} visitas com ${nightCtr}% de conversão.
    `;
};

export function SystemSummary({
    events = [],
    siteName = "este projeto",
}) {
    const [messages, setMessages] = useState<any[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [input, setInput] = useState("");

    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const hasFetched = useRef(false);
    const abortControllerRef =
        useRef<AbortController | null>(null);

    // Função de Scroll otimizada
    const scrollToBottom = useCallback(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isAnalyzing, scrollToBottom]);

    // Ajuste da Textarea
    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "auto";
            textAreaRef.current.style.height = `${Math.min(textAreaRef.current.scrollHeight, 160)}px`;
        }
    }, [input]);

    const askAI = async (userText?: string) => {
        const text = userText || input;
        if (!text || isAnalyzing) return;

        if (!userText) {
            setMessages((prev) => [
                ...prev,
                { role: "user", text },
            ]);
            setInput("");
        }

        setIsAnalyzing(true);

        try {
            const response = await fetch(
                "/api/ai/analyze",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        statsContext:
                            getProcessedStats(events), // DADOS MASTIGADOS
                        siteName,
                        userQuestion: text,
                        events: events.slice(0, 150), // MENOS EVENTOS CRUS (POUPA TOKEN)
                    }),
                }
            );

            const data = await response.json();
            setMessages((prev) => [
                ...prev,
                {
                    role: "ai",
                    text: data.text || "Sem resposta.",
                },
            ]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    role: "ai",
                    text: "⚠️ Erro de conexão ou limite atingido.",
                },
            ]);
        } finally {
            setIsAnalyzing(false);
        }
    };

    useEffect(() => {
        if (events.length >= 1 && !hasFetched.current) {
            hasFetched.current = true;
            askAI(
                "Com base nos dados reais fornecidos, faça uma análise executiva focada em conversão."
            );
        }
    }, [events.length]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            askAI();
        }
    };

    return (
        <div className="w-full flex flex-col gap-4 antialiased">
            <div className="flex flex-col h-[600px] bg-[#09090b] border border-zinc-800/50 rounded-3xl overflow-hidden shadow-2xl relative">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-zinc-900/40 border-b border-zinc-800/50 backdrop-blur-md z-10">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <Terminal
                                size={16}
                                className="text-blue-500"
                            />
                        </div>
                        <div>
                            <h2 className="text-[11px] font-bold text-zinc-100 uppercase tracking-wider">
                                AI Analytics Engine
                            </h2>
                            <p className="text-[9px] text-zinc-500 font-medium uppercase tracking-[0.1em]">
                                Llama 3.3 Insight
                            </p>
                        </div>
                    </div>
                    {isAnalyzing && (
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/5 border border-blue-500/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-[9px] font-bold text-blue-500 uppercase">
                                Processando...
                            </span>
                        </div>
                    )}
                </div>

                {/* Chat Display */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-6 space-y-6 bg-transparent custom-scrollbar"
                >
                    <AnimatePresence initial={false}>
                        {messages.map((m, i) => (
                            <motion.div
                                key={i}
                                initial={{
                                    opacity: 0,
                                    y: 10,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                            >
                                <div
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border shadow-sm ${
                                        m.role === "user"
                                            ? "bg-zinc-100 border-white text-zinc-900"
                                            : "bg-zinc-900 border-zinc-800 text-blue-400"
                                    }`}
                                >
                                    {m.role === "user" ? (
                                        <User size={14} />
                                    ) : (
                                        <Sparkles
                                            size={14}
                                        />
                                    )}
                                </div>

                                <div
                                    className={`flex flex-col max-w-[85%] ${m.role === "user" ? "items-end" : "items-start"}`}
                                >
                                    <div
                                        className={`p-4 rounded-2xl text-[13px] leading-relaxed ${
                                            m.role ===
                                            "user"
                                                ? "bg-zinc-100 text-zinc-900 rounded-tr-none font-medium"
                                                : "bg-zinc-900/60 text-zinc-300 border border-zinc-800/50 rounded-tl-none shadow-xl"
                                        } ${m.role === "error" ? "border-red-500/50 bg-red-500/5 text-red-200" : ""}`}
                                    >
                                        <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed">
                                            <ReactMarkdown>
                                                {m.text}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                    <span className="mt-1.5 text-[9px] text-zinc-600 font-bold uppercase tracking-widest px-1">
                                        {m.role === "user"
                                            ? "Solicitação"
                                            : "Resposta da IA"}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Input Area */}
                <div className="p-4 bg-zinc-900/30 border-t border-zinc-800/50 backdrop-blur-md">
                    <div className="relative flex items-end gap-2 bg-black border border-zinc-800 rounded-2xl p-2 focus-within:border-blue-500/50 transition-all shadow-inner">
                        <textarea
                            ref={textAreaRef}
                            rows={1}
                            className="flex-1 bg-transparent border-none py-2.5 pl-3 pr-2 text-sm text-zinc-200 focus:outline-none resize-none max-h-40 placeholder:text-zinc-700"
                            placeholder="Pergunte sobre os dados..."
                            value={input}
                            onChange={(e) =>
                                setInput(e.target.value)
                            }
                            onKeyDown={handleKeyDown}
                            disabled={isAnalyzing}
                        />
                        <button
                            onClick={() => askAI()}
                            disabled={
                                isAnalyzing || !input.trim()
                            }
                            className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl disabled:opacity-30 transition-all shadow-lg shrink-0"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                    <div className="mt-2 text-center">
                        <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-[0.2em]">
                            {siteName} Analytics
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
