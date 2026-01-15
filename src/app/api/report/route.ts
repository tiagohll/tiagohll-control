import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Inicializa o cliente Supabase com a Service Role para ignorar RLS no insert
const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Mapeamento dos campos do Modal
        const { site_id, code, page, description, isDev } =
            body;

        if (!site_id) {
            return NextResponse.json(
                { error: "site_id é obrigatório" },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from("reports")
            .insert([
                {
                    site_id,
                    error_code: code,
                    page_url: page,
                    description,
                    is_dev_error: isDev,
                },
            ])
            .select();

        if (error) throw error;

        return NextResponse.json(
            { success: true, data },
            { status: 201 }
        );
    } catch (error: any) {
        console.error(
            "Erro na API de Report:",
            error.message
        );
        return NextResponse.json(
            { error: "Erro interno ao salvar report" },
            { status: 500 }
        );
    }
}
