import { createClient } from "@/lib/supabase/server";
import { UserPlus } from "lucide-react";
import { CustomersList } from "./costomer-list";

export default async function CustomersPage() {
    const supabase = await createClient();

    const { data: customers } = await supabase
        .from("customers")
        .select(
            `
            *,
            projects (id),
            subscriptions (*)
        `
        )
        .order("name");

    return (
        <div className="p-8 max-w-[1400px] mx-auto space-y-8">
            <header className="flex justify-between items-end">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black italic uppercase tracking-tighter">
                        Clientes
                    </h1>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                        Gestão de assinaturas e base de
                        dados
                    </p>
                </div>

                <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black uppercase italic tracking-tighter text-xs transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20">
                    <UserPlus size={16} /> Novo Cliente
                </button>
            </header>

            <CustomersList customers={customers || []} />
        </div>
    );
}
