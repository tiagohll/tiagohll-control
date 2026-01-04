import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
    // Definimos dentro da função para evitar erro no build estático
    const supabaseUrl =
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    const supabaseKey =
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

    return createBrowserClient(supabaseUrl, supabaseKey);
};
