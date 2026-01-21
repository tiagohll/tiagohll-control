"use client";

import { AlertTriangle, Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteUser } from "../../lib/actions";
import { motion } from "framer-motion";
import { useToast } from "@/context/ToastContext";

export function ConfirmDeleteModal({
    userId,
    userEmail,
    onClose,
}: any) {
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const handleDelete = async () => {
        try {
            setLoading(true);
            await deleteUser(userId);
            onClose();
            showToast(
                "Usuário excluído!",
                "success",
                "O usuário foi excluído com sucesso."
            );
        } catch (error: any) {
            showToast(
                "Erro ao excluir",
                "error",
                error.message
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            {/* Modal */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative bg-zinc-950 border border-red-500/20 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden shadow-red-500/5 p-8 text-center"
            >
                <div className="h-16 w-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6">
                    <AlertTriangle size={32} />
                </div>

                <h3 className="text-xl font-bold text-white mb-2">
                    Excluir Usuário?
                </h3>
                <p className="text-zinc-400 text-sm mb-6">
                    Remover{" "}
                    <span className="text-white font-bold">
                        {userEmail}
                    </span>
                    ? Esta ação não pode ser desfeita.
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? (
                            "EXCLUINDO..."
                        ) : (
                            <>
                                <Trash2 size={18} />{" "}
                                CONFIRMAR EXCLUSÃO
                            </>
                        )}
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-zinc-900 text-zinc-400 rounded-2xl text-sm font-bold"
                    >
                        CANCELAR
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
