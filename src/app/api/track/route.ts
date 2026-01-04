import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Forçamos a rota a ser dinâmica para evitar erro no build da Vercel
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
    // Inicialização dentro da função para evitar erro "supabaseUrl is required" no build
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
        process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
    );

    try {
        const body = await req.json();

        // Aqui você faz o insert no banco...
        // const { error } = await supabaseAdmin.from('events').insert(body);

        return NextResponse.json(
            { success: true },
            {
                headers: {
                    "Access-Control-Allow-Origin": "*", // Libera para todos os clientes
                },
            }
        );
    } catch (err) {
        return NextResponse.json(
            { error: "Invalid request" },
            { status: 400 }
        );
    }
}
