import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/Buttons/logout";
import SiteCard from "./site-card";
import NewProjectFlow from "./sites/[id]/new-project-flow";
import { ArrowRight, Sparkles, X } from "lucide-react";
import { CHANGELOG_DATA } from "@/data/changelog";

export default async function Dashboard() {
    const supabase = await createClient();

    const latestRelease = CHANGELOG_DATA[0];
    const RELEASE_TOUR_KEY = `feat_${latestRelease.version}`;
    const SHOW_RELEASE_BANNER = true;

    // 1. Coleta dados do Usuário (Auth)
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    // 2. Busca sites e perfil em paralelo
    const [sitesRes, profileRes, onboardingRes] =
        await Promise.all([
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
            supabase
                .from("user_onboarding")
                .select("tour_key")
                .eq("user_id", user.id)
                .eq("tour_key", RELEASE_TOUR_KEY)
                .single(),
        ]);

    const sites = sitesRes.data || [];
    const profile = profileRes.data;

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

    const hasSeenRelease = !!onboardingRes.data;
    const shouldShowBanner =
        SHOW_RELEASE_BANNER && !hasSeenRelease;

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-6xl mx-auto">
                {/* BANNER DE NOVA RELEASE */}
                {shouldShowBanner && (
                    <div className="mb-8 relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative bg-zinc-950 border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                                    <Sparkles size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-[0.2em] text-white">
                                        {
                                            latestRelease.title
                                        }{" "}
                                    </p>
                                    <p className="text-[10px] font-mono text-zinc-500 uppercase">
                                        Release{" "}
                                        {
                                            latestRelease.version
                                        }{" "}
                                        — Disponível agora
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <form
                                    action={async () => {
                                        "use server";
                                        const supabase =
                                            await createClient();
                                        // Registra que viu
                                        await supabase
                                            .from(
                                                "user_onboarding"
                                            )
                                            .insert({
                                                user_id:
                                                    user.id,
                                                tour_key:
                                                    RELEASE_TOUR_KEY,
                                                completed_at:
                                                    new Date().toISOString(),
                                            });
                                        // Redireciona para a página específica da release
                                        redirect(
                                            `/changelog/${latestRelease.slug}`
                                        );
                                    }}
                                >
                                    <button className="w-full md:w-auto bg-white text-black text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-full hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2">
                                        Explorar Update{" "}
                                        <ArrowRight
                                            size={14}
                                        />
                                    </button>
                                </form>

                                {/* Botão apenas para fechar */}
                                <form
                                    action={async () => {
                                        "use server";
                                        const supabase =
                                            await createClient();
                                        await supabase
                                            .from(
                                                "user_onboarding"
                                            )
                                            .insert({
                                                user_id:
                                                    user.id,
                                                tour_key:
                                                    RELEASE_TOUR_KEY,
                                                completed_at:
                                                    new Date().toISOString(),
                                            });
                                        redirect(
                                            "/dashboard"
                                        );
                                    }}
                                >
                                    <button className="p-2.5 rounded-full border border-white/5 text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all">
                                        <X size={16} />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
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
