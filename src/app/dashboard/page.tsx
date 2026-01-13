import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Lock } from "lucide-react";
import LogoutButton from "@/components/Buttons/logout";
import SiteCard from "./site-card";
import NewProjectFlow from "./sites/[id]/new-project-flow";

export default async function Dashboard() {
    const supabase = await createClient();

    // 1. Coleta dados do Usuário (Auth)
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    // 2. Busca sites e perfil em paralelo
    const [sitesRes, profileRes] = await Promise.all([
        supabase
            .from("sites")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),
        supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single(),
    ]);

    const sites = sitesRes.data || [];
    const profile = profileRes.data;

    // 3. Lógica de auto-correção do limite
    let limit = profile?.site_max_limit;
    if (limit === null || limit === undefined) {
        limit = 1;
        await supabase
            .from("profiles")
            .update({ site_max_limit: 1 })
            .eq("id", user.id);
    }

    const isLimitReached = sites.length >= limit;

    // 4. Objeto completo para o Debug
    const debugInfo = {
        auth_user: {
            id: user.id,
            email: user.email,
            last_sign_in: user.last_sign_in_at,
            app_metadata: user.app_metadata,
            user_metadata: user.user_metadata,
        },
        database_profile: profile,
        stats: {
            sites_count: sites.length,
            limit_applied: limit,
            is_limit_reached: isLimitReached,
        },
        raw_sites_data: sites,
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex md: flex-col md:flex-row md:justify-between items-center md:items-end gap-2 md:gap-0 mb-12 duration-200">
                    <div className="space-y-1 text-center md:text-left">
                        <h1 className="text-4xl font-black tracking-tighter uppercase">
                            Meus Projetos
                        </h1>
                        <p className="text-zinc-500 font-bold text-xs mt-1 uppercase tracking-widest">
                            {sites.length} / {limit} slots
                            utilizados
                        </p>
                    </div>

                    <div className="flex gap-4 items-center">
                        {/* Chamamos o componente que gerencia o botão e o formulário */}
                        <NewProjectFlow
                            isLimitReached={isLimitReached}
                        />
                        <LogoutButton />
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sites.map((site) => (
                        <SiteCard
                            key={site.id}
                            site={site}
                        />
                    ))}
                </div>

                {/* System Logs Expandido */}
                <footer className="mt-20">
                    <details className="group opacity-20 hover:opacity-100 transition-opacity border-t border-zinc-900 pt-8">
                        <summary className="text-[10px] font-black cursor-pointer uppercase tracking-[0.3em] text-zinc-500 list-none flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                            System Logs (Full Session Data)
                        </summary>
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <p className="text-[9px] font-bold text-zinc-600 uppercase">
                                    Perfil & Limites
                                </p>
                                <pre className="text-[10px] bg-zinc-950 p-4 rounded-2xl border border-zinc-900 overflow-x-auto text-emerald-400">
                                    {JSON.stringify(
                                        debugInfo.database_profile,
                                        null,
                                        2
                                    )}
                                </pre>
                            </div>
                            <div className="md:col-span-2 space-y-4">
                                <p className="text-[9px] font-bold text-zinc-600 uppercase">
                                    Dados Brutos dos Sites
                                </p>
                                <pre className="text-[10px] bg-zinc-950 p-4 rounded-2xl border border-zinc-900 overflow-x-auto text-zinc-400">
                                    {JSON.stringify(
                                        debugInfo.raw_sites_data,
                                        null,
                                        2
                                    )}
                                </pre>
                            </div>
                        </div>
                    </details>
                </footer>
            </div>
        </div>
    );
}
