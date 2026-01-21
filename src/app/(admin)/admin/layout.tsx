import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Sidebar } from "./components/Sidebar/Sidebar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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
        data: { session },
    } = await supabase.auth.getSession();
    if (!session) redirect("/login");

    const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", session.user.id)
        .single();

    if (!profile || !profile.is_admin)
        redirect("/dashboard");

    return (
        <div className="flex h-screen w-full bg-[#050505] text-zinc-200 overflow-hidden font-sans antialiased">
            <Sidebar />

            <main className="relative flex-1 flex flex-col min-w-0 overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] pointer-events-none z-0" />

                <div className="flex-1 overflow-y-auto custom-scroll z-10">
                    <div className="max-w-[1400px] mx-auto p-6 md:p-10">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
