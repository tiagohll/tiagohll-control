"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
    const supabase = createClient();
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh(); // Limpa o cache do servidor
        router.push("/login");
    };

    return (
        <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-zinc-500 hover:text-red-400 transition-colors text-sm font-medium"
        >
            <LogOut size={16} />
            Sair
        </button>
    );
}
