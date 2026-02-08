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
    Lock,
} from "lucide-react";
import Link from "next/link";

const tableConfigs: any = {
    projects: {
        name: "Projetos",
        desc: "Gestão de cronogramas e entregas",
        icon: <Layers size={24} />,
        img: "https://images.unsplash.com/photo-1510074377623-8cf13fb86c08",
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

export default function DatabaseGrid({
    site,
    activeTableIds = [],
}: {
    site: any;
    activeTableIds: string[];
}) {
    // ESTADO: Funcionalidade não disponível
    if (activeTableIds.length === 0) {
        return (
            <div className="space-y-10">
                <header className="space-y-4 px-2 mb-10">
                    <div className="flex items-center gap-3">
                        <span className="bg-zinc-800 text-zinc-500 border border-white/5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
                            BETA FEATURE
                        </span>
                    </div>
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter opacity-50">
                        Banco de Dados
                    </h2>
                </header>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-24 px-6 border border-white/5 rounded-[3rem] bg-zinc-900/30 backdrop-blur-sm text-center"
                >
                    <div className="h-20 w-20 rounded-full bg-zinc-800/50 flex items-center justify-center mb-6 border border-white/5">
                        <Lock
                            size={32}
                            className="text-zinc-600"
                        />
                    </div>

                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">
                        Esta funcionalidade não está
                        disponível para este site
                    </h3>

                    <p className="text-zinc-500 text-sm max-w-[400px] mt-4 leading-relaxed font-medium">
                        Estamos trabalhando para adicionar
                        esta funcionalidade a todos nossos
                        clientes o mais rápido possível.
                        Agradecemos sua paciência.
                    </p>
                </motion.div>
            </div>
        );
    }

    // ESTADO: Com tabelas ativas
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
                {activeTableIds.map((tableId, index) => {
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
                                <div className="absolute inset-0 z-0">
                                    <img
                                        src={config.img}
                                        alt={config.name}
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-40 group-hover:opacity-60"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                </div>

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
