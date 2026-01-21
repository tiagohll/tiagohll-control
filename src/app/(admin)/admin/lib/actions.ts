"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);

async function getAdminClient() {
    const cookieStore = await cookies();
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env
            .NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
            },
        }
    );
}

export async function updateUserSettings(
    userId: string,
    data: { limit: number; isAdmin: boolean }
) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env
            .NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
            },
        }
    );

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        console.error("Erro Auth:", authError);
        throw new Error("Sessão expirada. Refaça o login.");
    }

    const { error: updateError } = await supabase
        .from("profiles")
        .update({
            site_max_limit: data.limit,
            is_admin: data.isAdmin,
        })
        .eq("id", userId);

    if (updateError) {
        console.error("Erro Update:", updateError);
        throw new Error(updateError.message);
    }

    revalidatePath("/admin");
    return { success: true };
}

export async function deleteUser(userId: string) {
    try {
        // 2. Use o supabaseAdmin para deletar
        // O método auth.admin.deleteUser exige privilégios de Service Role
        const { error: authError } =
            await supabaseAdmin.auth.admin.deleteUser(
                userId
            );

        if (authError) {
            console.error(
                "Erro no Auth:",
                authError.message
            );
            throw new Error(authError.message);
        }

        // 3. Opcional: deletar o perfil manualmente se não houver CASCADE no banco
        await supabaseAdmin
            .from("profiles")
            .delete()
            .eq("id", userId);

        revalidatePath("/admin");
        return { success: true };
    } catch (error: any) {
        throw new Error(error.message);
    }
}

export async function addUser(data: {
    email: string;
    limit: number;
    isAdmin: boolean;
    password: string;
}) {
    const { data: authData, error: authError } =
        await supabaseAdmin.auth.admin.createUser({
            email: data.email,
            password: data.password,
            email_confirm: true,
            user_metadata: { is_admin: data.isAdmin },
        });

    if (authError) throw new Error(authError.message);

    const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .upsert(
            {
                id: authData.user.id,
                email: data.email,
                site_max_limit: data.limit,
                is_admin: data.isAdmin,
            },
            { onConflict: "id" }
        );

    if (profileError) {
        await supabaseAdmin.auth.admin.deleteUser(
            authData.user.id
        );
        throw new Error(
            "Erro ao configurar perfil: " +
                profileError.message
        );
    }

    revalidatePath("/admin");
    return { success: true };
}

export async function updateReportStatus(
    reportId: string,
    newStatus: string
) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase
        .from("reports")
        .update({ status: newStatus })
        .eq("id", reportId);

    if (error) throw new Error(error.message);
    revalidatePath("/admin/reports");
}

export async function addTransaction(formData: any) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { description, amount, type, category } =
        formData;

    // Se for custo (expense), garantimos que o número seja negativo para o cálculo de saldo
    const finalAmount =
        type === "expense"
            ? -Math.abs(amount)
            : Math.abs(amount);

    const { error } = await supabase
        .from("finances")
        .insert([
            {
                description,
                amount: finalAmount,
                type,
                category,
            },
        ]);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/finance"); // Atualiza a página automaticamente
}
