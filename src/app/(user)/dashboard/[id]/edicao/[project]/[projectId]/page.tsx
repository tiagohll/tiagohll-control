"use client";

import {
    motion,
    AnimatePresence,
    Reorder,
} from "framer-motion";
import {
    ChevronLeft,
    Save,
    Trash2,
    Image as ImageIcon,
    Plus,
    AlertCircle,
    Loader2,
    GripVertical,
    Hash,
} from "lucide-react";
import Link from "next/link";
import {
    useState,
    useEffect,
    useCallback,
    memo,
} from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/context/ToastContext";

export default function EditPage() {
    const params = useParams();
    const siteId = params.id as string;
    const projectId = params.projectId as string;

    const router = useRouter();
    const supabase = createClient();
    const { showToast } = useToast();

    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [notFound, setNotFound] = useState(false);

    // Estados do Projeto
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [bannerUrl, setBannerUrl] = useState("");
    const [siteBaseUrl, setSiteBaseUrl] = useState("");
    const [slug, setSlug] = useState("");
    const [orderIndex, setOrderIndex] = useState<number>(0);

    // Listas Dinâmicas
    const [paragraphs, setParagraphs] = useState<any[]>([]);
    const [images, setImages] = useState<any[]>([]);

    const fetchProjectData = useCallback(async () => {
        try {
            setLoading(true);

            const { data: project, error } = await supabase
                .from("user_projects")
                .select(`*, sites:site_id ( url )`)
                .eq("id", projectId)
                .maybeSingle();

            if (error || !project) {
                setNotFound(true);
                return;
            }

            setTitle(project.title || "");
            setCategory(project.category_type || "");
            setBannerUrl(project.image_banner || "");
            setSlug(project.url || "");
            setOrderIndex(project.order_index ?? 0);

            const rawUrl =
                (project.sites as any)?.url || "";
            setSiteBaseUrl(rawUrl.replace(/\/$/, ""));

            const { data: paras, error: pError } =
                await supabase
                    .from("user_project_paragraphs")
                    .select("*")
                    .eq("project_id", projectId)
                    .order("order_index", {
                        ascending: true,
                    });

            if (!pError && paras) {
                setParagraphs(
                    paras.map((p) => ({
                        id: p.id,
                        title: p.p_title || "",
                        text: p.content || "",
                    }))
                );
            }

            const { data: imgData, error: imgError } =
                await supabase
                    .from("user_project_images")
                    .select("*")
                    .eq("project_id", projectId);

            if (!imgError && imgData) setImages(imgData);
        } catch (err) {
            console.error("Erro ao carregar:", err);
            showToast(
                "Erro de conexão",
                "error",
                "Não foi possível carregar os dados."
            );
        } finally {
            setLoading(false);
        }
    }, [projectId, supabase]);

    useEffect(() => {
        if (projectId) fetchProjectData();
    }, [projectId, fetchProjectData]);

    const getFullImageUrl = (path: string) => {
        if (!path) return "";
        if (path.startsWith("http")) return path;
        return `${siteBaseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
    };

    const handleSaveAll = async () => {
        setIsSaving(true);
        try {
            const { error: projectError } = await supabase
                .from("user_projects")
                .update({
                    title: title.toUpperCase(),
                    category_type: category,
                    image_banner: bannerUrl,
                    url: slug,
                    order_index: orderIndex,
                })
                .eq("id", projectId);

            if (projectError) throw projectError;

            await supabase
                .from("user_project_paragraphs")
                .delete()
                .eq("project_id", projectId);

            if (paragraphs.length > 0) {
                const toInsertParas = paragraphs.map(
                    (p, i) => ({
                        project_id: projectId,
                        p_title: p.title,
                        content: p.text,
                        order_index: i,
                    })
                );
                const { error: pError } = await supabase
                    .from("user_project_paragraphs")
                    .insert(toInsertParas);
                if (pError) throw pError;
            }

            await supabase
                .from("user_project_images")
                .delete()
                .eq("project_id", projectId);

            if (images.length > 0) {
                const toInsertImgs = images.map((img) => ({
                    project_id: projectId,
                    image_url: img.image_url,
                    image_type:
                        img.image_type.toLowerCase() ||
                        "sem descricão",
                }));

                const { error: iError } = await supabase
                    .from("user_project_images")
                    .insert(toInsertImgs);

                if (iError) throw iError;
            }

            showToast(
                "Sucesso!",
                "success",
                "As alterações foram gravadas no banco de dados."
            );
            router.refresh();
        } catch (error: any) {
            showToast(
                "Erro ao salvar",
                "error",
                error.message
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteProject = async () => {
        // Mantive o confirm nativo por segurança antes da ação destrutiva
        if (!confirm("Excluir projeto permanentemente?"))
            return;

        try {
            const { error } = await supabase
                .from("user_projects")
                .delete()
                .eq("id", projectId);

            if (error) throw error;

            showToast(
                "Projeto Excluído",
                "warning",
                "O registro foi removido permanentemente."
            );
            router.push(`/dashboard/sites/${siteId}`);
        } catch (err: any) {
            showToast(
                "Erro na exclusão",
                "error",
                err.message
            );
        }
    };

    // Sub-componente para Imagem com Fallback
    const ImagePreview = ({
        src,
        alt,
    }: {
        src: string;
        alt: string;
    }) => {
        const [error, setError] = useState(false);
        const [loadingImg, setLoadingImg] = useState(true);

        return (
            <div className="relative w-full h-full bg-zinc-900 flex items-center justify-center overflow-hidden">
                {loadingImg && !error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 z-10">
                        <Loader2
                            className="animate-spin text-zinc-700"
                            size={20}
                        />
                    </div>
                )}
                {error ? (
                    <div className="flex flex-col items-center gap-2 text-zinc-700">
                        <ImageIcon size={24} />
                        <span className="text-[8px] font-black uppercase">
                            Erro na URL
                        </span>
                    </div>
                ) : (
                    <img
                        src={src}
                        alt={alt}
                        className={`w-full h-full object-cover transition-opacity duration-300 ${loadingImg ? "opacity-0" : "opacity-100"}`}
                        onLoad={() => setLoadingImg(false)}
                        onError={() => {
                            setError(true);
                            setLoadingImg(false);
                        }}
                    />
                )}
            </div>
        );
    };

    const updateImage = useCallback(
        (index: number, field: string, value: string) => {
            setImages((prev) => {
                const newImgs = [...prev];
                if (newImgs[index][field] === value)
                    return prev; // Evita update se o valor for igual
                newImgs[index] = {
                    ...newImgs[index],
                    [field]: value,
                };
                return newImgs;
            });
        },
        []
    );

    const removeImage = useCallback((index: number) => {
        setImages((prev) =>
            prev.filter((_, i) => i !== index)
        );
    }, []);

    const GalleryItem = memo(
        ({ img, idx, updateImage, removeImage }: any) => {
            return (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-black/60 border border-white/5 p-4 rounded-2xl space-y-3 relative group"
                >
                    <div className="flex gap-2">
                        <input
                            defaultValue={img.image_url} // Use defaultValue para evitar re-render a cada letra
                            onBlur={(e) =>
                                updateImage(
                                    idx,
                                    "image_url",
                                    e.target.value
                                )
                            }
                            placeholder="URL da imagem..."
                            className="flex-1 bg-black border border-white/10 p-2 rounded-lg text-[9px] font-mono text-zinc-500 focus:border-blue-600 outline-none"
                        />
                        <input
                            defaultValue={img.image_type}
                            onBlur={(e) =>
                                updateImage(
                                    idx,
                                    "image_type",
                                    e.target.value
                                )
                            }
                            placeholder="Tipo"
                            className="w-20 bg-black border border-white/10 p-2 rounded-lg text-[9px] font-mono text-blue-400 focus:border-blue-600 outline-none uppercase"
                        />
                    </div>

                    {img.image_url && (
                        <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10">
                            <ImagePreview
                                src={img.image_url}
                                alt="Preview"
                            />
                        </div>
                    )}

                    <button
                        onClick={() => removeImage(idx)}
                        className="absolute -top-2 -right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Trash2 size={12} />
                    </button>
                </motion.div>
            );
        },
        (prev, next) => {
            // Só renderiza se a URL ou o Tipo mudarem de fato
            return (
                prev.img.image_url === next.img.image_url &&
                prev.img.image_type === next.img.image_type
            );
        }
    );

    if (loading)
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
                <Loader2
                    className="animate-spin text-blue-600"
                    size={32}
                />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    Sincronizando...
                </span>
            </div>
        );

    if (notFound)
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
                <AlertCircle
                    size={64}
                    className="text-red-600 mb-6"
                />
                <h1 className="text-4xl font-black text-white uppercase mb-2">
                    Não encontrado
                </h1>
                <Link
                    href={`/dashboard/${siteId}/database`}
                    className="bg-white text-black px-8 py-4 rounded-xl font-black uppercase text-[10px]"
                >
                    Voltar
                </Link>
            </div>
        );

    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <div className="max-w-[1400px] mx-auto space-y-8 pb-20 px-6 pt-10">
                <header className="flex flex-col items-center md:items-end md:flex-row justify-between gap-6 border-b border-white/5 pb-8">
                    <div className="space-y-1">
                        <Link
                            href={`/dashboard/sites/${siteId}`}
                            className="flex items-center gap-2 text-zinc-500 hover:text-blue-500 transition-colors text-[10px] font-black uppercase tracking-widest group"
                        >
                            <ChevronLeft
                                size={14}
                                className="group-hover:-translate-x-1 transition-transform"
                            />{" "}
                            Voltar ao Dashboard
                        </Link>
                        <div className="flex items-center gap-6">
                            <h1 className="text-5xl font-black uppercase tracking-tighter">
                                Editor
                                <span className="text-blue-600">
                                    .
                                </span>
                            </h1>
                            <div className="flex flex-col gap-1.5 bg-zinc-900/50 border border-white/5 p-2 px-4 rounded-2xl">
                                <label className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-1">
                                    <Hash size={8} /> Ordem
                                </label>
                                <input
                                    type="number"
                                    value={orderIndex}
                                    onChange={(e) =>
                                        setOrderIndex(
                                            parseInt(
                                                e.target
                                                    .value
                                            ) || 0
                                        )
                                    }
                                    className="bg-transparent text-blue-500 font-black text-lg w-16 outline-none focus:text-white transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        disabled={isSaving}
                        onClick={handleSaveAll}
                        className="bg-blue-600 text-white px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-500 transition-all flex items-center gap-2"
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
                            ? "Gravando..."
                            : "Gravar Alterações"}
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 space-y-10">
                        <section className="bg-zinc-950 border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* ID - Read Only */}
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-zinc-500">
                                        ID
                                    </label>
                                    <div className="bg-black/40 border border-white/5 p-4 rounded-xl text-zinc-600 font-mono text-xs overflow-hidden text-ellipsis">
                                        {projectId}
                                    </div>
                                </div>

                                {/* Categoria */}
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-zinc-500">
                                        Categoria
                                    </label>
                                    <input
                                        defaultValue={
                                            category
                                        }
                                        onBlur={(e) =>
                                            setCategory(
                                                e.target
                                                    .value
                                            )
                                        }
                                        placeholder="EX: DESIGN"
                                        className="w-full bg-black border border-white/10 p-4 rounded-xl text-white font-bold text-xs focus:border-blue-500 outline-none transition-colors"
                                    />
                                </div>

                                {/* NOVA URL (SLUG) */}
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-blue-500 flex items-center gap-2">
                                        URL do Projeto{" "}
                                        <span className="text-[8px] text-zinc-600">
                                            (ex:
                                            /meu-projeto)
                                        </span>
                                    </label>
                                    <div className="relative flex items-center">
                                        <span className="absolute left-4 text-zinc-500 font-mono text-xs">
                                            /
                                        </span>
                                        <input
                                            defaultValue={
                                                slug
                                            }
                                            onBlur={(e) =>
                                                setSlug(
                                                    e.target.value
                                                        .replace(
                                                            /\s+/g,
                                                            "-"
                                                        )
                                                        .toLowerCase()
                                                )
                                            }
                                            placeholder="url-personalizada"
                                            className="w-full bg-black border border-white/10 p-4 pl-7 rounded-xl text-blue-400 font-mono text-xs outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Título */}
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase text-zinc-500">
                                    Título
                                </label>
                                <input
                                    defaultValue={title}
                                    onBlur={(e) =>
                                        setTitle(
                                            e.target.value
                                        )
                                    }
                                    className="w-full bg-black border border-white/10 p-5 rounded-2xl font-black text-xl text-white focus:border-blue-500 outline-none transition-colors"
                                />
                            </div>
                        </section>

                        <section className="bg-zinc-950 border border-white/5 rounded-[2.5rem] p-8 space-y-4">
                            <div className="flex items-center gap-2">
                                <ImageIcon
                                    size={18}
                                    className="text-blue-600"
                                />
                                <span className="text-[10px] font-black uppercase tracking-widest">
                                    Banner do Projeto
                                </span>
                            </div>
                            <input
                                value={bannerUrl}
                                onChange={(e) =>
                                    setBannerUrl(
                                        e.target.value
                                    )
                                }
                                placeholder="/caminho/da/imagem.png"
                                className="w-full bg-black border border-white/10 p-4 rounded-xl text-zinc-400 font-mono text-[10px]"
                            />
                            {bannerUrl && (
                                <div className="overflow-hidden rounded-[2rem] border border-white/10 aspect-video">
                                    <ImagePreview
                                        src={getFullImageUrl(
                                            bannerUrl
                                        )}
                                        alt="Banner"
                                    />
                                </div>
                            )}
                        </section>

                        {/* CONTEÚDO */}
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
                                                id: Date.now(),
                                                title: "NOVO BLOCO",
                                                text: "",
                                            },
                                        ])
                                    }
                                    className="bg-white text-black px-4 py-2 rounded-full text-[10px] font-black uppercase flex items-center gap-2"
                                >
                                    <Plus size={14} />{" "}
                                    Adicionar Bloco
                                </button>
                            </div>

                            <Reorder.Group
                                axis="y"
                                values={paragraphs}
                                onReorder={setParagraphs}
                                className="space-y-4"
                            >
                                {paragraphs.map(
                                    (p, index) => (
                                        <Reorder.Item
                                            key={
                                                p.id ||
                                                index
                                            }
                                            value={p}
                                            className="bg-zinc-950 border border-white/5 rounded-3xl p-6 relative group flex gap-4"
                                        >
                                            <div className="cursor-grab active:cursor-grabbing text-zinc-700 hover:text-blue-600 pt-6">
                                                <GripVertical
                                                    size={
                                                        24
                                                    }
                                                />
                                            </div>
                                            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6">
                                                <div className="md:col-span-1 space-y-2">
                                                    <label className="text-[8px] font-black text-zinc-500 uppercase">
                                                        Subtítulo
                                                    </label>
                                                    <input
                                                        value={
                                                            p.title
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
                                                            ].title =
                                                                e.target.value;
                                                            setParagraphs(
                                                                newP
                                                            );
                                                        }}
                                                        className="w-full bg-black border border-white/10 p-3 rounded-lg text-white font-bold text-[10px]"
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
                                                        className="w-full bg-black border border-white/10 p-4 rounded-xl text-zinc-400 text-xs h-32 resize-none"
                                                    />
                                                </div>
                                            </div>
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
                                                        18
                                                    }
                                                />
                                            </button>
                                        </Reorder.Item>
                                    )
                                )}
                            </Reorder.Group>
                        </section>
                    </div>

                    <aside className="lg:col-span-4 space-y-6">
                        <div className="bg-zinc-950 border border-white/5 rounded-[2rem] p-6 space-y-6">
                            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                <h3 className="text-[10px] font-black uppercase text-white tracking-widest flex items-center gap-2">
                                    <ImageIcon size={14} />{" "}
                                    Galeria Sidebar
                                </h3>
                                <button
                                    onClick={() =>
                                        setImages([
                                            ...images,
                                            {
                                                image_url:
                                                    "",
                                                image_type:
                                                    "", // Valor inicial padrão
                                            },
                                        ])
                                    }
                                    className="text-blue-500 hover:text-white"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>

                            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                <AnimatePresence mode="popLayout">
                                    {" "}
                                    {/* popLayout ajuda na performance de saída */}
                                    {images.map(
                                        (img, idx) => (
                                            <GalleryItem
                                                key={
                                                    img.id ||
                                                    idx
                                                } // Se tiver ID do banco, use-o em vez do idx
                                                img={img}
                                                idx={idx}
                                                updateImage={
                                                    updateImage
                                                }
                                                removeImage={
                                                    removeImage
                                                }
                                            />
                                        )
                                    )}
                                </AnimatePresence>
                                {images.length === 0 && (
                                    <p className="text-[9px] text-zinc-600 text-center py-10 uppercase font-black">
                                        Nenhuma imagem
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="bg-red-950/10 border border-red-900/20 rounded-[2rem] p-6">
                            <button
                                onClick={
                                    handleDeleteProject
                                }
                                className="w-full p-4 flex items-center justify-center gap-3 text-red-900 hover:text-red-500 transition-all font-black uppercase text-[10px]"
                            >
                                <Trash2 size={18} /> Excluir
                                do Banco de Dados
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
