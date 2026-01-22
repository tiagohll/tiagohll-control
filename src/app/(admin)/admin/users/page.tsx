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
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 min-h-screen text-white bg-[#050505]">
            {/* HEADER */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter italic">
                        User
                        <span className="text-blue-500">
                            {" "}
                            Control
                        </span>
                    </h1>
                    <p className="text-zinc-500 text-sm font-medium italic">
                        Gerenciamento central de usuários e
                        permissões.
                    </p>
                </div>
                <AddUserButton />
            </header>

            {/* MÉTRICAS (Estilo Cards do Dashboard) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        label: "Total de Usuários",
                        value: totalUsers,
                        color: "text-blue-500",
                    },
                    {
                        label: "Administradores",
                        value: totalAdmins,
                        color: "text-emerald-500",
                    },
                    {
                        label: "Status do Sistema",
                        value: "Ativo",
                        color: "text-blue-500",
                        isStatus: true,
                    },
                ].map((item, i) => (
                    <div
                        key={i}
                        className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-md"
                    >
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                            {item.label}
                        </p>
                        <h2 className="text-4xl font-black flex items-center gap-3">
                            {item.value}
                            {item.isStatus && (
                                <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                            )}
                        </h2>
                    </div>
                ))}
            </div>

            {/* SEÇÃO DE FILTROS E TABELA */}
            <div className="bg-zinc-900/40 border border-white/5 p-4 md:p-8 rounded-[3rem] backdrop-blur-md">
                <div className="mb-8">
                    <AdminFilters />
                </div>

                <div className="overflow-hidden">
                    <AdminTable profiles={profiles} />
                </div>
            </div>
        </div>
    );
}
