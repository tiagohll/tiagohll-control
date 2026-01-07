import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import SetupForm from "./setup-form";
import { ExternalLink, Lock, QrCode } from "lucide-react";
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

    const { data: qrEvents } = await supabase
        .from("analytics_events")
        .select("event_type")
        .eq("site_id", id)
        .ilike("event_type", "qr_%"); // Filtra apenas tipos que começam com "qr_"

    // Agrupar contagem
    const qrCounts: Record<string, number> = {};
    qrEvents?.forEach((ev) => {
        const source = ev.event_type.replace("qr_", "");
        qrCounts[source] = (qrCounts[source] || 0) + 1;
    });

    const qrStats = Object.entries(qrCounts).map(
        ([source, count]) => ({ source, count })
    );

    return (
        <DashboardClient
            site={site}
            stats={{
                total: totalRes.count,
                today: todayRes.count,
            }}
            topPages={topPages}
            qrStats={qrStats}
        />
    );
}
