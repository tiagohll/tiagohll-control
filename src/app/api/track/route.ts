import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Função principal de POST
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { site_id, path, visitor_token } = body;

        const { error } = await supabaseAdmin
            .from("analytics_events")
            .insert({
                site_id,
                path: path.split("?")[0],
                visitor_hash: visitor_token,
                event_type: "page_view",
            });

        if (error) throw error;

        return new NextResponse(
            JSON.stringify({ ok: true }),
            {
                status: 201,
                headers: {
                    "Access-Control-Allow-Origin":
                        "http://localhost:3001", // Permite o site do cliente
                    "Content-Type": "application/json",
                },
            }
        );
    } catch (err) {
        return new NextResponse(
            JSON.stringify({ error: "Internal Error" }),
            {
                status: 500,
                headers: {
                    "Access-Control-Allow-Origin":
                        "http://localhost:3001",
                },
            }
        );
    }
}

// ESSA FUNÇÃO É VITAL PARA RESOLVER O ERRO DA IMAGEM 1d700f
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin":
                "http://localhost:3001",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}
