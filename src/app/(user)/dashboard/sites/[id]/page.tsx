import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import SetupForm from "./setup-form";
import DashboardClient from "./DashboardClient";

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

    // 1. BUSCA TODOS OS EVENTOS (Para o DashboardClient processar)
    // Buscamos os últimos 2000 eventos para ter um histórico bom sem pesar o banco
    const { data: allEvents } = await supabase
        .from("analytics_events")
        .select("*")
        .eq("site_id", id)
        .order("created_at", { ascending: false })
        .limit(2000);

    const events = allEvents || [];

    // 2. FILTRAGEM DE ACESSOS REAIS (Ignora cliques para os cards principais)
    const realAccesses = events.filter(
        (ev) => ev.event_type !== "click"
    );

    // 3. ESTATÍSTICAS HOJE (Apenas Visitas)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayISO = startOfToday.toISOString();

    const statsToday = realAccesses.filter(
        (ev) => ev.created_at >= todayISO
    ).length;
    const statsTotal = realAccesses.length;

    // 4. TOP PAGES (Limpar Query Strings)
    const pathCounts: Record<string, number> = {};
    realAccesses.forEach((row) => {
        const cleanPath = row.path.split("?")[0]; // Remove ?utm...
        pathCounts[cleanPath] =
            (pathCounts[cleanPath] || 0) + 1;
    });

    const topPages = Object.entries(pathCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

    // 5. QR STATS (Já filtrando do que temos na memória)
    const qrCounts: Record<string, number> = {};
    events
        .filter((ev) => ev.event_type?.startsWith("qr_"))
        .forEach((ev) => {
            const source = ev.event_type
                .replace("qr_", "")
                .toUpperCase();
            qrCounts[source] = (qrCounts[source] || 0) + 1;
        });

    const qrStats = Object.entries(qrCounts).map(
        ([source, count]) => ({
            source,
            count,
        })
    );

    const { data: rawTours } = await supabase
        .from("user_onboarding")
        .select("tour_key")
        .eq("user_id", site.user_id);

    const completedTours =
        rawTours?.map((t) => t.tour_key) || [];

    const { data: activeTablesData } = await supabase
        .from("site_tables")
        .select("table_id")
        .eq("site_id", id);

    const activeTableIds =
        activeTablesData?.map((t) => t.table_id) || [];

    // Lógica de 14 dias
    const siteCreatedAt = new Date(
        site.created_at
    ).getTime();
    const fourteenDaysInMs = 14 * 24 * 60 * 60 * 1000;
    const isOldEnough =
        Date.now() - siteCreatedAt > fourteenDaysInMs;

    const { data: existingFeedback } = await supabase
        .from("user_feedback")
        .select("id")
        .eq("site_id", site.id)
        .eq("user_id", site.user_id)
        .maybeSingle();

    const showTrigger = isOldEnough && !existingFeedback;

    return (
        <DashboardClient
            site={site}
            allEvents={events} // ESSENCIAL: Passamos a lista bruta para o gráfico
            stats={{
                total: statsTotal,
                today: statsToday,
            }}
            topPages={topPages}
            qrStats={qrStats}
            completedTours={completedTours}
            activeTableIds={activeTableIds}
            showFeedback={showTrigger}
        />
    );
}
