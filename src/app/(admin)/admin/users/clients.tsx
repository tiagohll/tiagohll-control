"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { AddUserModal } from "../components/AddUserModal";
import { AnimatePresence } from "framer-motion";

export function AddUserButton() {
    const [showAddModal, setShowAddModal] = useState(false);
    return (
        <>
            <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-zinc-200 text-black text-xs font-black rounded-xl transition-all shadow-lg shadow-white/5"
            >
                <Plus size={16} />
                CONVIDAR USUÁRIO
            </button>
            <AnimatePresence>
                {showAddModal && (
                    <AddUserModal
                        onClose={() =>
                            setShowAddModal(false)
                        }
                    />
                )}
            </AnimatePresence>
        </>
    );
}
