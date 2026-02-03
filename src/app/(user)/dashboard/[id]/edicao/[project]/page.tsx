"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Search,
    Edit3,
    ArrowUpRight,
    Loader2,
    Globe,
    X,
} from "lucide-react";
import Link from "next/link";
import {
    useState,
    useEffect,
    useCallback,
    useMemo,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";

export default function DatabasePage() {
    const supabase = createClient();
    const params = useParams();
    const siteId = params.id as string;

    // Estados de Dados
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newProjectTitle, setNewProjectTitle] =
        useState("");
    const [newProjectCategory, setNewProjectCategory] =
        useState("");
    const [isCustomCategory, setIsCustomCategory] =
        useState(false);

    const fetchData = useCallback(async () => {
        if (!siteId) return;
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("user_projects")
                .select("*")
                .eq("site_id", siteId)
                .order("order_index", { ascending: true });

            if (error) throw error;
            setProjects(data || []);
        } catch (err) {
            console.error("Erro ao buscar projetos:", err);
        } finally {
            setLoading(false);
        }
    }, [siteId, supabase]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredProjects = useMemo(() => {
        const cleanSearch = searchTerm.toLowerCase().trim();
        if (!cleanSearch) return projects;
        return projects.filter((p) => {
            const title = p.title?.toLowerCase() || "";
            const category =
                p.category_type?.toLowerCase() || "";
            return (
                title.includes(cleanSearch) ||
                category.includes(cleanSearch)
            );
        });
    }, [projects, searchTerm]);

    const existingCategories = useMemo(() => {
        return Array.from(
            new Set(
                projects
                    .map((p) => p.category_type)
                    .filter(Boolean)
            )
        );
    }, [projects]);

    async function handleCreateProject() {
        if (!newProjectTitle || !newProjectCategory)
            return alert("Preencha tudo!");
        try {
            const { error } = await supabase
                .from("user_projects")
                .insert([
                    {
                        title: newProjectTitle.toUpperCase(),
                        category_type: newProjectCategory,
                        site_id: siteId,
                        order_index: projects.length + 1,
                    },
                ]);
            if (error) throw error;
            setNewProjectTitle("");
            setIsAddOpen(false);
            fetchData();
        } catch (err: any) {
            alert(err.message);
        }
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <div className="max-w-[1400px] mx-auto px-6 py-10 space-y-12">
                {/* HEADER */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">
                            <Globe
                                size={12}
                                className="text-blue-600"
                            />
                            Database System
                        </div>
                        <h1 className="text-6xl font-black uppercase tracking-tighter">
                            Projetos
                            <span className="text-blue-600">
                                .
                            </span>
                        </h1>
                    </div>
                    <button
                        onClick={() => setIsAddOpen(true)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3 transition-all active:scale-95"
                    >
                        <Plus size={18} /> Novo Projeto
                    </button>
                </header>

                {/* SEARCH */}
                <div className="relative group">
                    <Search
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-600 transition-colors"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="BUSCAR PROJETOS..."
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(e.target.value)
                        }
                        className="w-full bg-zinc-950 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-xs font-bold uppercase tracking-widest outline-none focus:border-blue-600/50 transition-all placeholder:text-zinc-800"
                    />
                </div>

                {loading ? (
                    <div className="h-64 flex flex-col items-center justify-center gap-4">
                        <Loader2
                            className="animate-spin text-blue-600"
                            size={32}
                        />
                    </div>
                ) : (
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        <AnimatePresence
                            mode="popLayout"
                            initial={false}
                        >
                            {filteredProjects.map(
                                (project) => (
                                    <motion.div
                                        key={project.id}
                                        layout
                                        initial={{
                                            opacity: 0,
                                            y: 20,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            scale: 0.9,
                                        }}
                                        /* 'p-[1px]' cria o espaço da borda, 'relative' e 'group' controlam os efeitos */
                                        className="relative group p-[1.5px] rounded-[2.5rem] overflow-hidden transition-all bg-zinc-900"
                                    >
                                        {/* 1. O Gradiente que gira (A Borda) */}
                                        <div className="absolute inset-[-1000%] animate-[shimmer-spin_3s_linear_infinite] bg-ia-gradient opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-500" />

                                        {/* 2. Opcional: Glow/Brilho extra (mesmo gradiente com blur) */}
                                        <div className="absolute inset-[-1000%] animate-[shimmer-spin_3s_linear_infinite] bg-ia-gradient opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-500" />

                                        {/* 3. Conteúdo Principal (Overlay) */}
                                        <div className="relative h-full w-full bg-zinc-950 rounded-[calc(2.5rem-1px)] overflow-hidden">
                                            <div className="aspect-[16/10] overflow-hidden bg-zinc-900 relative">
                                                <img
                                                    src={
                                                        project.image_banner ||
                                                        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800"
                                                    }
                                                    alt=""
                                                    className="w-full h-full object-cover opacity-20 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />

                                                <Link
                                                    href={`/dashboard/${siteId}/edicao/projects/${project.id}`}
                                                    className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40"
                                                >
                                                    <div className="bg-white text-black p-4 rounded-full shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-300">
                                                        <Edit3
                                                            size={
                                                                20
                                                            }
                                                        />
                                                    </div>
                                                </Link>
                                            </div>

                                            <div className="p-8">
                                                <span className="text-blue-600 text-[9px] font-black uppercase tracking-widest">
                                                    {project.category_type ||
                                                        "Sem Categoria"}
                                                </span>
                                                <h3 className="text-2xl font-black tracking-tighter mt-1">
                                                    {project.title ||
                                                        "Sem Título"}
                                                </h3>
                                                <div className="mt-6 pt-6 border-t border-white/5 flex justify-end">
                                                    <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                                                        Gerenciar
                                                        Projeto{" "}
                                                        <ArrowUpRight
                                                            size={
                                                                12
                                                            }
                                                        />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>

            {/* MODAL ADICIONAR */}
            <AnimatePresence>
                {isAddOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsAddOpen(false)}
                        className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[9999] flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                            className="bg-zinc-950 border border-white/10 w-full max-w-xl rounded-[3rem] p-12 space-y-10 relative"
                        >
                            <button
                                onClick={() =>
                                    setIsAddOpen(false)
                                }
                                className="absolute top-8 right-8 text-zinc-500 hover:text-white"
                            >
                                <X />
                            </button>

                            <h2 className="text-4xl font-black uppercase tracking-tighter">
                                Novo Projeto
                                <span className="text-blue-600">
                                    .
                                </span>
                            </h2>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                                        Nome do Projeto
                                    </label>
                                    <input
                                        value={
                                            newProjectTitle
                                        }
                                        onChange={(e) =>
                                            setNewProjectTitle(
                                                e.target
                                                    .value
                                            )
                                        }
                                        className="w-full bg-black border border-white/10 p-5 rounded-2xl font-bold text-white outline-none focus:border-blue-600 transition-all"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                                            Categoria
                                        </label>
                                        <button
                                            onClick={() =>
                                                setIsCustomCategory(
                                                    !isCustomCategory
                                                )
                                            }
                                            className="text-[9px] font-black text-blue-600 uppercase"
                                        >
                                            {isCustomCategory
                                                ? "Ver existentes"
                                                : "+ Criar Nova"}
                                        </button>
                                    </div>

                                    {isCustomCategory ? (
                                        <input
                                            value={
                                                newProjectCategory
                                            }
                                            onChange={(e) =>
                                                setNewProjectCategory(
                                                    e.target
                                                        .value
                                                )
                                            }
                                            placeholder="EX: Identidade Visual"
                                            className="w-full bg-black border border-white/10 p-5 rounded-2xl font-bold text-white outline-none focus:border-blue-600 transition-all"
                                        />
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {existingCategories.map(
                                                (cat) => (
                                                    <button
                                                        key={
                                                            cat
                                                        }
                                                        onClick={() =>
                                                            setNewProjectCategory(
                                                                cat
                                                            )
                                                        }
                                                        className={`px-4 py-2 rounded-xl border text-[10px] font-black transition-all ${newProjectCategory === cat ? "bg-blue-600 border-blue-600 text-white" : "bg-black border-white/10 text-zinc-500 hover:border-white/30"}`}
                                                    >
                                                        {
                                                            cat
                                                        }
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={
                                    handleCreateProject
                                }
                                className="w-full bg-white text-black py-6 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-600 hover:text-white transition-all active:scale-95"
                            >
                                Criar Projeto
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
