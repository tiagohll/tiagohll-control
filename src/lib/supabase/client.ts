import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
    // Pegamos os valores dentro da função, com um fallback de string vazia
    const supabaseUrl =
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    const supabaseKey =
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

    return createBrowserClient(supabaseUrl, supabaseKey);
};
