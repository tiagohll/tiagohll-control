import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

// Headers padrão para reutilizar
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: corsHeaders,
    });
}

export async function POST(req: Request) {
    // Inicialização idêntica à sua API de track que funciona
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
        process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
    );

    try {
        const body = await req.json();
        console.log("Payload Report recebido:", body);

        const { site_id, code, page, description, isDev } =
            body;

        if (!site_id) {
            return NextResponse.json(
                { error: "site_id é obrigatório" },
                { status: 400, headers: corsHeaders }
            );
        }

        const { data, error } = await supabaseAdmin
            .from("reports")
            .insert([
                {
                    site_id,
                    error_code: code,
                    page_url: page,
                    description: description || "",
                    is_dev_error: isDev || false,
                },
            ])
            .select();

        if (error) {
            console.error(
                "Erro Supabase Report:",
                error.message
            );
            return NextResponse.json(
                { error: error.message },
                { status: 500, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data },
            {
                status: 201,
                headers: corsHeaders,
            }
        );
    } catch (err) {
        console.error("Fail Report:", err);
        return NextResponse.json(
            { error: "Fail" },
            { status: 400, headers: corsHeaders }
        );
    }
}
