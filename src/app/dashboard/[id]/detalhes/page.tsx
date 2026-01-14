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

    const { data: site } = await supabase
        .from("sites")
        .select("*")
        .eq("id", id)
        .single();

    if (!site) notFound();

    // BUSCA TUDO: Removemos a trava de 14 dias para carregar o histórico desde 04/01
    const { data: allEvents } = await supabase
        .from("analytics_events")
        .select("*")
        .eq("site_id", id)
        .order("created_at", { ascending: true });

    return (
        <DetailsClient
            site={site}
            allEvents={allEvents || []}
        />
    );
}
