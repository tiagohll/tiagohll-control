"use client";

import { motion } from "framer-motion";
import {
    ChevronRight,
    Database,
    Layers,
    Users,
    FileText,
    CreditCard,
    Box,
} from "lucide-react";
import Link from "next/link";

// Mapeamento de ícones e imagens de fallback para as tabelas reais do seu print
const tableConfigs: any = {
    projects: {
        name: "Projetos",
        desc: "Gestão de cronogramas e entregas",
        icon: <Layers size={24} />,
        img: "https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?q=80&w=800&auto=format&fit=crop",
    },
    customers: {
        name: "Clientes",
        desc: "Base de dados e contatos comerciais",
        icon: <Users size={24} />,
        img: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=800&auto=format&fit=crop",
    },
    subscriptions: {
        name: "Assinaturas",
        desc: "Controle de recorrência e planos",
        icon: <CreditCard size={24} />,
        img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    },
    proposals: {
        name: "Propostas",
        desc: "Documentos e orçamentos enviados",
        icon: <FileText size={24} />,
        img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop",
    },
    project_details: {
        name: "Logs de Projeto",
        desc: "Detalhamento técnico e histórico",
        icon: <Box size={24} />,
        img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
    },
};

// Lista de tabelas baseada no seu print lateral do Supabase
const tables = [
    "projects",
    "customers",
    "subscriptions",
    "proposals",
    "project_details",
];

export default function DatabaseGrid({
    site,
}: {
    site: any;
}) {
    return (
        <div className="space-y-10">
            <header className="space-y-4 px-2 mb-10">
                <div className="flex items-center gap-3">
                    <span className="bg-blue-600/10 text-blue-500 border border-blue-600/20 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
                        Development Beta
                    </span>
                </div>

                <h2 className="text-4xl font-black text-white uppercase tracking-tighter">
                    Tabelas do Sistema
                    <span className="text-blue-600">.</span>
                </h2>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {tables.map((tableId, index) => {
                    const config = tableConfigs[
                        tableId
                    ] || {
                        name: tableId,
                        desc: "Tabela do banco de dados",
                        icon: <Database size={24} />,
                        img: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
                    };

                    return (
                        <motion.div
                            key={tableId}
                            initial={{
                                opacity: 0,
                                scale: 0.95,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                            }}
                            transition={{
                                delay: index * 0.05,
                            }}
                        >
                            <Link
                                href={`/dashboard/${site.id}/edicao/${tableId}`}
                                className="group relative block h-[320px] w-full rounded-[2.5rem] overflow-hidden bg-zinc-900 border border-white/5 transition-all duration-500 hover:border-blue-500/50 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)]"
                            >
                                {/* Imagem de Fundo com Overlay */}
                                <div className="absolute inset-0 z-0">
                                    <img
                                        src={config.img}
                                        alt={config.name}
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-40 group-hover:opacity-60"
                                    />
                                    {/* Gradiente para garantir leitura do texto na parte inferior */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                </div>

                                {/* Conteúdo do Card */}
                                <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end">
                                    <div className="space-y-1 transform transition-transform duration-500 group-hover:-translate-y-2">
                                        <div className="flex items-center gap-2 text-blue-500 mb-2">
                                            {config.icon}
                                        </div>
                                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">
                                            {config.name}
                                        </h3>
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest opacity-80 group-hover:text-zinc-200">
                                            {config.desc}
                                        </p>
                                    </div>

                                    {/* Botão flutuante que aparece no hover */}
                                    <div className="absolute top-8 right-8 h-12 w-12 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                                        <ChevronRight
                                            size={20}
                                            className="text-white"
                                        />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
