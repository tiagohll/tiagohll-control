"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft,
    Save,
    Trash2,
    Image as ImageIcon,
    Plus,
    AlertCircle,
    Loader2,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function EditPage() {
    const params = useParams();
    const siteId = params.id as string;
    const projectId = params.projectId as string;

    const router = useRouter();
    const supabase = createClient();

    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [notFound, setNotFound] = useState(false);

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [bannerUrl, setBannerUrl] = useState("");
    const [siteBaseUrl, setSiteBaseUrl] = useState("");
    const [paragraphs, setParagraphs] = useState<any[]>([]);

    const fetchProjectData = useCallback(async () => {
        try {
            setLoading(true);

            // 1. Busca os dados do projeto E os dados do site (Join)
            // Precisamos do site_id que está no user_projects para buscar a URL na tabela de sites
            const { data: project, error } = await supabase
                .from("user_projects")
                .select(
                    `
                    *,
                    sites:site_id ( url )
                `
                )
                .eq("id", projectId)
                .maybeSingle();

            if (error || !project) {
                console.error(
                    "Erro na query ou projeto não encontrado"
                );
                setNotFound(true);
                return;
            }

            // 2. Popula os estados
            setTitle(project.title || "");
            setCategory(project.category_type || "");
            setBannerUrl(project.image_banner || "");

            // Pega a URL do site pai
            const rawUrl =
                (project.sites as any)?.url || "";
            // Garante que termina sem '/' para não duplicar na concatenação
            setSiteBaseUrl(rawUrl.replace(/\/$/, ""));

            // 3. Busca os parágrafos
            const { data: paras, error: pError } =
                await supabase
                    .from("project_paragraphs")
                    .select("*")
                    .eq("project_id", projectId)
                    .order("order_index", {
                        ascending: true,
                    });

            if (!pError && paras) setParagraphs(paras);
        } catch (err) {
            console.error("Erro inesperado:", err);
        } finally {
            setLoading(false);
        }
    }, [projectId, supabase]);

    useEffect(() => {
        if (projectId) fetchProjectData();
    }, [projectId, fetchProjectData]);

    // Função auxiliar para resolver a URL da imagem
    const getFullImageUrl = (path: string) => {
        if (!path) return "";
        if (path.startsWith("http")) return path;
        return `${siteBaseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
    };

    const handleSaveAll = async () => {
        setIsSaving(true);
        try {
            // 1. Atualiza Projeto
            const { error: projectError } = await supabase
                .from("user_projects")
                .update({
                    title: title.toUpperCase(),
                    category_type: category.toUpperCase(),
                    image_banner: bannerUrl,
                })
                .eq("id", projectId);

            if (projectError) throw projectError;

            // 2. Sincroniza Parágrafos
            await supabase
                .from("project_paragraphs")
                .delete()
                .eq("project_id", projectId);

            if (paragraphs.length > 0) {
                const toInsert = paragraphs.map((p, i) => ({
                    project_id: projectId,
                    pTitle: p.pTitle,
                    text: p.text,
                    order_index: i,
                }));
                const { error: pError } = await supabase
                    .from("project_paragraphs")
                    .insert(toInsert);
                if (pError) throw pError;
            }

            alert("Alterações salvas!");
            router.refresh();
        } catch (error: any) {
            alert(`Erro: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    async function handleDeleteProject() {
        if (
            !confirm(
                "Tem certeza que deseja excluir este projeto?"
            )
        )
            return;
        try {
            const { error } = await supabase
                .from("user_projects")
                .delete()
                .eq("id", projectId);
            if (error) throw error;
            router.push(`/dashboard/${siteId}/database`);
        } catch (err: any) {
            alert(err.message);
        }
    }

    if (loading)
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
                <Loader2
                    className="animate-spin text-blue-600"
                    size={32}
                />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    Carregando Projeto...
                </span>
            </div>
        );

    if (notFound)
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
                <AlertCircle
                    size={64}
                    className="text-red-600 mx-auto mb-6"
                />
                <h1 className="text-4xl font-black text-white uppercase mb-2">
                    Projeto não encontrado
                </h1>
                <p className="text-zinc-500 mb-8">
                    O ID {projectId} não existe neste banco
                    de dados.
                </p>
                <Link
                    href={`/dashboard/${siteId}/database`}
                    className="bg-white text-black px-8 py-4 rounded-xl font-black uppercase text-[10px]"
                >
                    Voltar para Lista
                </Link>
            </div>
        );

    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <div className="max-w-[1400px] mx-auto space-y-8 pb-20 px-6 pt-10">
                {/* HEADER */}
                <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
                    <div className="space-y-1">
                        <Link
                            href={`/dashboard/${siteId}/database`}
                            className="flex items-center gap-2 text-zinc-500 hover:text-blue-500 transition-colors text-[10px] font-black uppercase tracking-widest group"
                        >
                            <ChevronLeft
                                size={14}
                                className="group-hover:-translate-x-1 transition-transform"
                            />
                            Voltar ao Database
                        </Link>
                        <h1 className="text-5xl font-black uppercase tracking-tighter">
                            Editor
                            <span className="text-blue-600">
                                .
                            </span>
                        </h1>
                    </div>

                    <button
                        disabled={isSaving}
                        onClick={handleSaveAll}
                        className="bg-blue-600 text-white px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-500 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSaving ? (
                            <Loader2
                                className="animate-spin"
                                size={16}
                            />
                        ) : (
                            <Save size={16} />
                        )}
                        {isSaving
                            ? "Salvando..."
                            : "Gravar Alterações"}
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 space-y-10">
                        {/* INFO BÁSICA */}
                        <section className="bg-zinc-950 border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-zinc-500 ml-1">
                                        ID do Projeto
                                    </label>
                                    <div className="bg-black/40 border border-white/5 p-4 rounded-xl text-zinc-600 font-mono text-xs">
                                        {projectId}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-zinc-500 ml-1">
                                        Categoria
                                    </label>
                                    <input
                                        value={category}
                                        onChange={(e) =>
                                            setCategory(
                                                e.target
                                                    .value
                                            )
                                        }
                                        className="w-full bg-black border border-white/10 p-4 rounded-xl text-white font-bold text-xs outline-none focus:border-blue-600 uppercase"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase text-zinc-500 ml-1">
                                    Título do Projeto
                                </label>
                                <input
                                    value={title}
                                    onChange={(e) =>
                                        setTitle(
                                            e.target.value
                                        )
                                    }
                                    className="w-full bg-black border border-white/10 p-5 rounded-2xl font-black text-xl text-white outline-none focus:border-blue-600"
                                />
                            </div>
                        </section>
                        {/* SEÇÃO BANNER COM PREVIEW INTELIGENTE */}
                        <section className="bg-zinc-950 border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <ImageIcon
                                        size={18}
                                        className="text-blue-600"
                                    />
                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                        Banner do Projeto
                                    </span>
                                </div>
                                <span className="text-[8px] text-zinc-600 font-mono">
                                    {siteBaseUrl}
                                </span>
                            </div>

                            <div className="space-y-4">
                                <input
                                    value={bannerUrl}
                                    onChange={(e) =>
                                        setBannerUrl(
                                            e.target.value
                                        )
                                    }
                                    placeholder="/_next/static/media/imagem.png ou https://..."
                                    className="w-full bg-black border border-white/10 p-4 rounded-xl text-zinc-400 text-[10px] font-mono outline-none focus:border-blue-600"
                                />

                                {bannerUrl && (
                                    <div className="relative group overflow-hidden rounded-[2rem] border border-white/10">
                                        <img
                                            src={getFullImageUrl(
                                                bannerUrl
                                            )}
                                            alt="Preview"
                                            className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-105"
                                            onError={(
                                                e
                                            ) => {
                                                (
                                                    e.target as HTMLImageElement
                                                ).src =
                                                    "https://placehold.co/600x400/000000/FFFFFF?text=Erro+ao+carregar+imagem";
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                            <p className="text-[8px] font-mono text-white/50 truncate w-full">
                                                Fonte:{" "}
                                                {getFullImageUrl(
                                                    bannerUrl
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* BLOCOS DE TEXTO */}
                        <section className="space-y-6">
                            <div className="flex justify-between items-center px-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                                    Conteúdo
                                </h3>
                                <button
                                    onClick={() =>
                                        setParagraphs([
                                            ...paragraphs,
                                            {
                                                pTitle: "NOVO BLOCO",
                                                text: "",
                                            },
                                        ])
                                    }
                                    className="bg-white text-black px-4 py-2 rounded-full text-[10px] font-black uppercase flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-colors"
                                >
                                    <Plus size={14} />{" "}
                                    Adicionar Bloco
                                </button>
                            </div>

                            <AnimatePresence>
                                {paragraphs.map(
                                    (p, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{
                                                opacity: 0,
                                                y: 10,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                            }}
                                            exit={{
                                                opacity: 0,
                                                scale: 0.95,
                                            }}
                                            className="bg-zinc-950 border border-white/5 rounded-3xl p-6 relative group"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                                <div className="md:col-span-1 space-y-2">
                                                    <label className="text-[8px] font-black text-zinc-500 uppercase">
                                                        Subtítulo
                                                    </label>
                                                    <input
                                                        value={
                                                            p.pTitle
                                                        }
                                                        onChange={(
                                                            e
                                                        ) => {
                                                            const newP =
                                                                [
                                                                    ...paragraphs,
                                                                ];
                                                            newP[
                                                                index
                                                            ].pTitle =
                                                                e.target.value;
                                                            setParagraphs(
                                                                newP
                                                            );
                                                        }}
                                                        className="w-full bg-black border border-white/10 p-3 rounded-lg text-white font-bold text-[10px] outline-none"
                                                    />
                                                </div>
                                                <div className="md:col-span-3 space-y-2">
                                                    <label className="text-[8px] font-black text-zinc-500 uppercase">
                                                        Texto
                                                    </label>
                                                    <textarea
                                                        value={
                                                            p.text
                                                        }
                                                        onChange={(
                                                            e
                                                        ) => {
                                                            const newP =
                                                                [
                                                                    ...paragraphs,
                                                                ];
                                                            newP[
                                                                index
                                                            ].text =
                                                                e.target.value;
                                                            setParagraphs(
                                                                newP
                                                            );
                                                        }}
                                                        className="w-full bg-black border border-white/10 p-4 rounded-xl text-zinc-400 text-xs h-32 resize-none outline-none focus:border-blue-600"
                                                    />
                                                    <button
                                                        onClick={() =>
                                                            setParagraphs(
                                                                paragraphs.filter(
                                                                    (
                                                                        _,
                                                                        i
                                                                    ) =>
                                                                        i !==
                                                                        index
                                                                )
                                                            )
                                                        }
                                                        className="absolute top-4 right-4 text-red-900 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                )}
                            </AnimatePresence>
                        </section>
                    </div>

                    {/* SIDEBAR */}
                    <aside className="lg:col-span-4 space-y-6">
                        <div className="bg-zinc-950 border border-white/5 rounded-[2rem] p-6 space-y-6">
                            <h3 className="text-[10px] font-black uppercase text-white tracking-widest border-b border-white/5 pb-4">
                                Ações Rápidas
                            </h3>
                            <button
                                onClick={
                                    handleDeleteProject
                                }
                                className="w-full p-6 border border-red-900/20 rounded-2xl flex items-center justify-center gap-3 group hover:bg-red-900/10 transition-all"
                            >
                                <Trash2
                                    size={18}
                                    className="text-red-900 group-hover:text-red-500"
                                />
                                <span className="text-[10px] font-black uppercase text-red-900 group-hover:text-red-500">
                                    Excluir Projeto
                                </span>
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
