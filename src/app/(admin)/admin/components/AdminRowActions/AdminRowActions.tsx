// AdminRowActions.tsx
"use client";

import { useState } from "react";
import { Settings, Trash2 } from "lucide-react";
import { AdminSettingsModal } from "../AdminSettingsModal";
import { ConfirmDeleteModal } from "../ConfirmDeleteModal";
import { AnimatePresence } from "framer-motion";

export function AdminRowActions({
    profile,
}: {
    profile: any;
}) {
    const [showSettings, setShowSettings] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    return (
        <div className="flex justify-end gap-2">
            <button
                onClick={() => setShowSettings(true)}
                className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-all"
            >
                <Settings size={18} />
            </button>

            <button
                onClick={() => setShowDelete(true)}
                className="p-2 hover:bg-red-500/10 rounded-lg text-zinc-400 hover:text-red-500 transition-all"
            >
                <Trash2 size={18} />
            </button>

            <AnimatePresence>
                {showSettings && (
                    <AdminSettingsModal
                        profile={profile}
                        onClose={() =>
                            setShowSettings(false)
                        }
                    />
                )}
                {showDelete && (
                    <ConfirmDeleteModal
                        profile={profile}
                        onClose={() => setShowDelete(false)}
                        userId={profile.id}
                        userEmail={profile.email}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
