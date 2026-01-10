import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { DetailsClient } from "./details-client";

export default async function DetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    // 1. Busca o site
    const { data: site } = await supabase
        .from("sites")
        .select("*")
        .eq("id", id)
        .single();
    if (!site) notFound();

    // 2. Definir intervalos (Últimos 7 dias vs 7 dias anteriores)
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(now.getDate() - 14);

    // 3. Buscar todos os eventos dos últimos 14 dias
    const { data: allEvents } = await supabase
        .from("analytics_events")
        .select("*")
        .eq("site_id", id)
        .gte("created_at", fourteenDaysAgo.toISOString());

    const events = allEvents || [];

    // 4. Separar períodos para o cálculo de crescimento
    const currentWeek = events.filter(
        (e) => new Date(e.created_at) >= sevenDaysAgo
    );
    const lastWeek = events.filter(
        (e) =>
            new Date(e.created_at) < sevenDaysAgo &&
            new Date(e.created_at) >= fourteenDaysAgo
    );

    const currentCount = currentWeek.length;
    const lastCount = lastWeek.length;

    // Cálculo da porcentagem (Regra de três simples)
    let growth = 0;
    if (lastCount > 0) {
        growth =
            ((currentCount - lastCount) / lastCount) * 100;
    } else if (currentCount > 0) {
        growth = 100;
    }

    // 5. Preparar dados do gráfico (Somente os últimos 7 dias)
    const chartDataMap: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const label = d.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
        });
        chartDataMap[label] = 0;
    }

    currentWeek.forEach((event) => {
        const dateLabel = new Date(
            event.created_at
        ).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
        });
        if (chartDataMap[dateLabel] !== undefined)
            chartDataMap[dateLabel]++;
    });

    const chartData = Object.entries(chartDataMap).map(
        ([date, visitors]) => ({
            date,
            visitors,
        })
    );

    return (
        <DetailsClient
            site={site}
            chartData={chartData}
            totalPeriod={currentCount}
            growth={growth}
            allEvents={currentWeek} // Passamos apenas os da semana atual para os rankings
        />
    );
}
