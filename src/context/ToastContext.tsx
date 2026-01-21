"use client";

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle2,
    AlertCircle,
    Info,
    X,
    AlertTriangle,
} from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
    id: number;
    message: string;
    description?: string;
    type: ToastType;
}

interface ToastContextData {
    showToast: (
        message: string,
        type: ToastType,
        description?: string
    ) => void;
}

const ToastContext = createContext<ToastContextData>(
    {} as ToastContextData
);

export const ToastProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback(
        (
            message: string,
            type: ToastType,
            description?: string
        ) => {
            const id = Date.now();
            setToasts((prev) => [
                ...prev,
                { id, message, type, description },
            ]);
            setTimeout(() => {
                setToasts((prev) =>
                    prev.filter((t) => t.id !== id)
                );
            }, 4000);
        },
        []
    );

    const removeToast = (id: number) => {
        setToasts((prev) =>
            prev.filter((t) => t.id !== id)
        );
    };

    const icons = {
        success: (
            <CheckCircle2
                className="text-blue-500"
                size={20}
            />
        ),
        error: (
            <AlertCircle
                className="text-red-500"
                size={20}
            />
        ),
        warning: (
            <AlertTriangle
                className="text-amber-500"
                size={20}
            />
        ),
        info: <Info className="text-zinc-400" size={20} />,
    };

    const colors = {
        success: "bg-blue-600",
        error: "bg-red-600",
        warning: "bg-amber-600",
        info: "bg-zinc-600",
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Container Centralizado no Topo */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 w-full max-w-[400px] px-4">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            // Ajuste na animação para vir de cima
                            initial={{
                                opacity: 0,
                                y: -20,
                                scale: 0.95,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.95,
                                transition: {
                                    duration: 0.2,
                                },
                            }}
                            className="bg-zinc-950/90 backdrop-blur-md border border-zinc-800 w-full rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden pointer-events-auto"
                        >
                            <div className="p-4 flex items-start gap-4">
                                <div className="bg-zinc-900 p-2 rounded-full shadow-inner">
                                    {icons[toast.type]}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-white font-bold text-sm leading-tight">
                                        {toast.message}
                                    </h4>
                                    {toast.description && (
                                        <p className="text-zinc-500 text-xs mt-1 leading-relaxed">
                                            {
                                                toast.description
                                            }
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={() =>
                                        removeToast(
                                            toast.id
                                        )
                                    }
                                    className="text-zinc-600 hover:text-white transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Barra de progresso */}
                            <motion.div
                                initial={{ width: "100%" }}
                                animate={{ width: "0%" }}
                                transition={{
                                    duration: 4,
                                    ease: "linear",
                                }}
                                className={`h-[3px] ${colors[toast.type]}`}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
