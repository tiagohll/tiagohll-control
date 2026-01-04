import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*", // Libera o acesso para o site do cliente
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}

export async function POST(req: Request) {
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
        process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
    );

    try {
        const body = await req.json();
        const { error } = await supabaseAdmin
            .from("analytics_events")
            .insert([
                {
                    site_id: body.site_id,
                    path: body.path,
                    event_type: "page_view",
                    visitor_hash: body.visitor_token,
                },
            ]);

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
