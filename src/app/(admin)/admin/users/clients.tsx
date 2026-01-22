"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { AddUserModal } from "../components/AddUserModal";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";

export function AddUserButton() {
    const [showAddModal, setShowAddModal] = useState(false);
    return (
        <>
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-2xl font-black uppercase text-[10px] flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20"
            >
                <Plus size={16} /> CONVIDAR USUÁRIO
            </motion.button>

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
