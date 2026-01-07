import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}

export async function POST(req: Request) {
    // Inicialização dentro do POST para evitar erro de build na Vercel
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
        process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
    );

    try {
        const body = await req.json();

        // LOG para você ver no console da Vercel o que está chegando
        console.log("Payload recebido:", body);

        const { error } = await supabaseAdmin
            .from("analytics_events")
            .insert([
                {
                    site_id: body.site_id,
                    path: body.path,
                    // Agora usamos o event_type que vem do cliente (page_view ou qr_...)
                    event_type:
                        body.event_type || "page_view",
                    // Mudamos de body.visitor_token para body.visitor_hash
                    visitor_hash: body.visitor_hash,
                },
            ]);

        if (error) {
            console.error("Erro Supabase:", error.message);
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true },
            {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
            }
        );
    } catch (err) {
        return NextResponse.json(
            { error: "Fail" },
            { status: 400 }
        );
    }
}
