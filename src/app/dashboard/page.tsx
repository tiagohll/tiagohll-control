import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Globe, Plus, ArrowRight } from "lucide-react";
import LogoutButton from "@/components/Buttons/logout";
import { Metadata } from "next";

export const metadata = {
    title: "Projetos | THLL Control",
    description:
        "Visão geral das suas propriedades digitais.",
};

export default async function Dashboard() {
    const supabase = await createClient();

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) redirect("/login");

    const { data: sites, error: sitesError } =
        await supabase
            .from("sites")
            .select("*")
            .eq("user_id", user.id);

    if (sitesError)
        throw new Error("Erro ao carregar seus dados.");

    // Lógica de Onboarding automática
    if (!sites || sites.length === 0) {
        const { data: newSite } = await supabase
            .from("sites")
            .insert({
                user_id: user.id,
                name: "Meu primeiro site",
                url: "",
            })
            .select()
            .single();

        if (newSite)
            redirect(`/dashboard/sites/${newSite.id}`);
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Meus Projetos
                        </h1>
                        <p className="text-zinc-500">
                            Gerencie o rastreamento de seus
                            sites.
                        </p>
                    </div>
                    {/* Botão para o futuro: Adicionar Site */}
                    <div className="flex gap-8 items-center">
                        <button className="bg-white text-black px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-zinc-200 transition">
                            <Plus size={16} /> Novo Projeto
                        </button>
                        <LogoutButton />
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sites?.map((site) => (
                        <Link
                            key={site.id}
                            href={`/dashboard/sites/${site.id}`}
                            className="group p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-600 transition-all flex flex-col justify-between min-h-[160px]"
                        >
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-zinc-800 rounded-lg group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-colors">
                                        <Globe size={20} />
                                    </div>
                                    <h3 className="font-bold text-lg">
                                        {site.name}
                                    </h3>
                                </div>
                                <p className="text-zinc-500 text-sm truncate">
                                    {site.url ||
                                        "Aguardando configuração..."}
                                </p>
                            </div>

                            <div className="flex items-center justify-between mt-6">
                                <span className="text-xs font-bold uppercase tracking-widest text-zinc-600 group-hover:text-zinc-400 transition-colors">
                                    Ver Analytics
                                </span>
                                <ArrowRight
                                    size={16}
                                    className="text-zinc-600 group-hover:translate-x-1 group-hover:text-white transition-all"
                                />
                            </div>
                        </Link>
                    ))}
                </div>

                <details className="mt-16 text-[10px] text-zinc-800 border-t border-zinc-900 pt-4">
                    <summary className="cursor-pointer hover:text-zinc-600">
                        System Logs (Debug)
                    </summary>
                    <pre className="mt-2">
                        {JSON.stringify(sites, null, 2)}
                    </pre>
                </details>
            </div>
        </div>
    );
}
