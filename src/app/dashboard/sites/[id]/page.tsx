import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import SetupForm from "./setup-form";
import { ExternalLink, Lock } from "lucide-react";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: site } = await supabase
        .from("sites")
        .select("name")
        .eq("id", id)
        .single();

    return {
        title: site?.name
            ? `${site.name} - Dashboard`
            : "Carregando... | THLL Control",
        description: `Análise de tráfego em tempo real para ${
            site?.name || "seu projeto"
        }.`,
    };
}

export const revalidate = 30;

export default async function SitePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: site, error } = await supabase
        .from("sites")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !site) notFound();

    if (!site.url) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh]">
                <div className="w-full max-w-md p-8 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl">
                    <h1 className="text-2xl font-bold mb-2 text-white">
                        Configuração Inicial
                    </h1>
                    <SetupForm site={site} />
                </div>
            </div>
        );
    }

    // Analytics Data
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [totalRes, todayRes, allEventsRes] =
        await Promise.all([
            supabase
                .from("analytics_events")
                .select("*", { count: "exact", head: true })
                .eq("site_id", id),
            supabase
                .from("analytics_events")
                .select("*", { count: "exact", head: true })
                .eq("site_id", id)
                .gte(
                    "created_at",
                    startOfToday.toISOString()
                ),
            supabase
                .from("analytics_events")
                .select("path")
                .eq("site_id", id)
                .limit(1000),
        ]);

    const pathCounts: Record<string, number> = {};
    allEventsRes.data?.forEach((row) => {
        pathCounts[row.path] =
            (pathCounts[row.path] || 0) + 1;
    });

    const topPages = Object.entries(pathCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header Estilo Vercel */}
            <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-8 pt-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                {site.name}
                            </h1>
                            <a
                                href={site.url}
                                target="_blank"
                                className="text-zinc-500 hover:text-blue-400 text-sm flex items-center gap-1 transition-colors"
                            >
                                {site.url}{" "}
                                <ExternalLink size={14} />
                            </a>
                        </div>
                    </div>

                    {/* Tabs de Navegação */}
                    <nav className="flex gap-8 text-sm font-medium">
                        <div className="border-b-2 border-white pb-3 cursor-pointer">
                            Análises
                        </div>
                        <div className="text-zinc-500 pb-3 cursor-not-allowed flex items-center gap-1.5">
                            Edição <Lock size={12} />
                        </div>
                    </nav>
                </div>
            </header>

            <main className="p-8 max-w-6xl mx-auto">
                {/* Grid de Métricas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
                        <p className="text-zinc-400 text-xs uppercase tracking-widest font-bold mb-2">
                            Total de Visitas
                        </p>
                        <p className="text-3xl font-bold tracking-tighter">
                            {totalRes.count || 0}
                        </p>
                    </div>
                    <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl border-l-blue-500">
                        <p className="text-zinc-400 text-xs uppercase tracking-widest font-bold mb-2">
                            Visitas Hoje
                        </p>
                        <p className="text-3xl font-bold tracking-tighter text-blue-400">
                            {todayRes.count || 0}
                        </p>
                    </div>
                    <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
                        <p className="text-zinc-400 text-xs uppercase tracking-widest font-bold mb-2">
                            Páginas Visitadas
                        </p>
                        <p className="text-3xl font-bold tracking-tighter">
                            {Object.keys(pathCounts).length}
                        </p>
                    </div>
                </div>

                {/* Preview Mockup (Estilo Vercel) */}
                <div className="mb-12 group">
                    <p className="text-zinc-400 text-xs uppercase tracking-widest font-bold mb-4">
                        Preview
                    </p>
                    <div className="relative aspect-video w-full bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden cursor-pointer hover:border-zinc-600 transition-all">
                        {/* Aqui usamos um iframe do próprio site do cliente para simular a print, 
                            com pointer-events-none para ser apenas visual.
                        */}
                        <iframe
                            src={site.url}
                            className="w-[1280px] h-[720px] origin-top-left scale-[calc(100%/1280*1)] pointer-events-none opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-80 transition-all"
                            style={{
                                width: "1280px",
                                height: "720px",
                                transform:
                                    "scale(var(--tw-scale-x))",
                            }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-all">
                            <a
                                href={site.url}
                                target="_blank"
                                className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold opacity-0 group-hover:opacity-100 transition-all shadow-xl"
                            >
                                Abrir no navegador
                            </a>
                        </div>
                    </div>
                </div>

                {/* Top Páginas */}
                <section>
                    <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">
                        Páginas Mais Visitadas
                    </h2>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl divide-y divide-zinc-800">
                        {topPages.length > 0 ? (
                            topPages.map(
                                ([path, count], index) => (
                                    <div
                                        key={path}
                                        className="flex items-center justify-between p-4 hover:bg-zinc-800/30 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="text-zinc-600 text-xs font-mono">
                                                {String(
                                                    index +
                                                        1
                                                ).padStart(
                                                    2,
                                                    "0"
                                                )}
                                            </span>
                                            <a
                                                href={`${
                                                    site.url
                                                }${
                                                    path ===
                                                    "/"
                                                        ? ""
                                                        : path
                                                }`}
                                                target="_blank"
                                                className="font-mono text-sm text-blue-400 hover:underline flex items-center gap-1.5"
                                            >
                                                {path}{" "}
                                                <ExternalLink
                                                    size={
                                                        12
                                                    }
                                                    className="text-zinc-600"
                                                />
                                            </a>
                                        </div>
                                        <span className="text-sm font-medium">
                                            {count} views
                                        </span>
                                    </div>
                                )
                            )
                        ) : (
                            <div className="p-8 text-center text-zinc-500 text-sm italic">
                                Waiting for traffic data...
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
