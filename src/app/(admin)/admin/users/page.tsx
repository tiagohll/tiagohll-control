import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Plus } from "lucide-react";
import { AdminFilters } from "../components/AdminFilters";
import AdminTable from "../components/Table";
import { AddUserButton } from "./clients";

interface PageProps {
    searchParams: Promise<{
        search?: string;
        role?: string;
        order?: string;
    }>;
}

export default async function AdminPage({
    searchParams,
}: PageProps) {
    // 1. Setup inicial e Cookies
    const filters = await searchParams;
    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env
            .NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
            },
        }
    );

    // 2. Query ao Supabase com Filtro de Cargo (Server-side)
    let query = supabase.from("profiles").select("*");

    if (filters.role === "admin")
        query = query.eq("is_admin", true);
    if (filters.role === "user")
        query = query.eq("is_admin", false);

    const { data: rawProfiles } = await query;

    // 3. Processamento de Busca e Ordenação (In-memory)
    let profiles = rawProfiles || [];

    if (filters.search) {
        const s = filters.search.toLowerCase();
        profiles = profiles.filter(
            (p) =>
                p.email?.toLowerCase().includes(s) ||
                p.id.toLowerCase().includes(s)
        );
    }

    profiles = [...profiles].sort((a, b) => {
        if (filters.order === "alphabetical")
            return a.email.localeCompare(b.email);
        if (filters.order === "sites")
            return b.site_max_limit - a.site_max_limit;
        return (
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        );
    });

    const totalUsers = profiles.length;
    const totalAdmins = profiles.filter(
        (p) => p.is_admin
    ).length;

    return (
        <div className="min-h-screen bg-[#050505] text-zinc-300 pb-20">
            <div className="max-w-6xl mx-auto px-6 pt-12">
                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight italic">
                            THLL CONTROL
                        </h1>
                        <p className="text-zinc-500 mt-1 text-sm italic opacity-70">
                            Gerenciamento Central de
                            Usuários e Permissões.
                        </p>
                    </div>
                    <AddUserButton />
                </div>

                {/* MÉTRICAS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="p-6 bg-zinc-900/30 border border-zinc-800/50 rounded-3xl backdrop-blur-sm">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">
                            Total de Usuários
                        </p>
                        <p className="text-3xl font-bold text-white">
                            {totalUsers}
                        </p>
                    </div>
                    <div className="p-6 bg-zinc-900/30 border border-zinc-800/50 rounded-3xl backdrop-blur-sm">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">
                            Administradores
                        </p>
                        <p className="text-3xl font-bold text-white">
                            {totalAdmins}
                        </p>
                    </div>
                    <div className="p-6 bg-zinc-900/30 border rounded-3xl border-blue-500/20 backdrop-blur-sm">
                        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">
                            Status do Sistema
                        </p>
                        <div className="text-3xl font-bold text-white flex items-center gap-2">
                            Ativo{" "}
                            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* FILTROS - Agora sem a prop onFilterChange */}
                <AdminFilters />

                {/* TABELA */}
                <AdminTable profiles={profiles} />
            </div>
        </div>
    );
}
