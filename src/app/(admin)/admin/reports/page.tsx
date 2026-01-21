import { createServerClient } from "@supabase/ssr";
import { ReportsList } from "./report-list";
import { cookies } from "next/headers";

// src/app/(admin)/admin/reports/page.tsx
export default async function ReportsPage() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use Service Role para garantir acesso
        { cookies: { getAll: () => cookieStore.getAll() } }
    );

    // 1. Tente buscar sem o relacionamento primeiro para testar se há dados
    const { data: reports } = await supabase
        .from("reports")
        .select(
            `
            id,
            error_code,
            page_url,
            description,
            is_dev_error,
            status,
            created_at,
            sites ( name )
        `
        )
        .order("created_at", { ascending: false });

    // Lógica de ordenação por prioridade de Status
    const statusPriority: Record<string, number> = {
        pending: 1, // Primeiro
        progress: 2, // Segundo
        solved: 3, // Terceiro
    };

    const sortedReports = reports?.sort((a, b) => {
        const priorityA = statusPriority[a.status] || 99;
        const priorityB = statusPriority[b.status] || 99;
        return priorityA - priorityB;
    });

    return (
        <div className="space-y-10">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
                        Reports
                        <span className="text-blue-600">
                            .
                        </span>
                    </h1>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-black text-white">
                        {reports?.length || 0}
                    </p>
                </div>
            </header>

            <ReportsList
                initialReports={sortedReports || []}
            />
        </div>
    );
}
