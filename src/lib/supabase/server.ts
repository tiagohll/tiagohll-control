import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // Use a mesma chave do cliente
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(
                            ({ name, value, options }) =>
                                cookieStore.set(
                                    name,
                                    value,
                                    options
                                )
                        );
                    } catch {
                        // O Next.js vai dar erro se isso rodar dentro de um Server Component.
                        // Ignoramos aqui, pois o Middleware deve cuidar da atualização do token.
                    }
                },
            },
        }
    );
}
