"use client";

import { motion } from "framer-motion";
import { ReactLenis } from "lenis/react";
import {
    BarChart3,
    Database,
    ChevronDown,
    Lock,
    Terminal,
    Server,
    Edit3,
    AlertTriangle,
} from "lucide-react";
import Link from "next/link";

const BetaBadge = () => (
    <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded-full mb-4">
        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse" />
        <span className="text-yellow-500 text-[10px] font-black uppercase tracking-widest">
            Feature em Beta
        </span>
    </div>
);

const SectionTitle = ({
    title,
    subtitle,
}: {
    title: string;
    subtitle?: string;
}) => (
    <div className="space-y-4 mb-8 md:mb-12 z-10 relative text-center md:text-left">
        <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-[0.9]">
            {title}
            <span className="text-blue-600">.</span>
        </h2>
        {subtitle && (
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] md:text-xs max-w-lg mx-auto md:mx-0 md:border-l-2 border-blue-600/50 md:pl-4 hidden md:block">
                {subtitle}
            </p>
        )}
    </div>
);

// --- Cards ---
const FeatureCard = ({
    icon: Icon,
    title,
    desc,
    delay = 0,
}: {
    icon: any;
    title: string;
    desc: string;
    delay?: number;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
            duration: 0.7,
            delay,
            ease: "easeOut",
        }}
        viewport={{ once: true }}
        className="group relative h-auto md:h-[280px] w-full rounded-2xl md:rounded-[2rem] bg-zinc-900/50 backdrop-blur-sm border border-white/5 hover:border-blue-500/30 transition-all duration-500 flex flex-row md:flex-col items-center md:items-start p-4 md:p-8 gap-4 md:gap-0"
    >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl md:rounded-[2rem]" />

        <div className="relative z-10 shrink-0">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-zinc-800 border border-white/5 flex items-center justify-center text-zinc-400 group-hover:text-blue-400 transition-colors duration-300">
                <Icon size={20} />
            </div>
        </div>

        <div className="relative z-10 flex flex-col justify-between h-full pt-0 md:pt-4">
            <div>
                <h3 className="text-sm md:text-xl font-black text-white uppercase tracking-tighter mb-1 md:mb-3">
                    {title}
                </h3>
                <p className="text-zinc-500 text-[10px] md:text-[11px] font-bold uppercase tracking-widest leading-relaxed line-clamp-2 md:line-clamp-none">
                    {desc}
                </p>
            </div>
        </div>
    </motion.div>
);

// 1. Hero
const Hero = () => {
    return (
        <section className="h-dvh w-full snap-start relative flex flex-col items-center justify-center overflow-hidden bg-black p-4 md:p-6">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent z-10" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10" />

            <div className="z-20 text-center max-w-5xl space-y-6 md:space-y-8 mt-[-10vh] md:mt-0">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                >
                    <div className="flex items-center justify-center gap-2 mb-2 md:mb-4">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[9px] md:text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                            System Operational v1.3.3
                        </span>
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="text-4xl md:text-8xl lg:text-9xl font-black text-white uppercase tracking-tighter leading-[0.9]"
                >
                    THLL Control <br />
                    <span className="text-zinc-800 text-stroke-thin">
                        System
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] md:text-xs max-w-xs md:max-w-xl mx-auto leading-relaxed px-4"
                >
                    Ambiente de alta performance para gestão
                    centralizada. Acesso restrito a
                    parceiros.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.8,
                        delay: 0.7,
                    }}
                    className="pt-6 md:pt-10"
                >
                    <button className="group relative px-6 py-3 md:px-8 md:py-3 bg-zinc-900 border border-zinc-800 rounded-full overflow-hidden transition-all hover:border-blue-500/50">
                        <div className="absolute inset-0 w-full h-full bg-blue-600/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        <span className="relative flex items-center gap-3 text-[10px] md:text-xs font-black uppercase tracking-widest text-white">
                            <Lock
                                size={12}
                                className="text-blue-500"
                            />{" "}
                            Área do Cliente
                        </span>
                    </button>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-6 md:bottom-10 text-zinc-700 animate-bounce"
            >
                <ChevronDown
                    size={20}
                    className="md:hidden block"
                />
                <ChevronDown
                    size={24}
                    className="md:block hidden"
                />
            </motion.div>
        </section>
    );
};

// 2. Features
const Features = () => {
    return (
        <section className="min-h-dvh w-full md:h-dvh snap-start bg-black flex items-center justify-center p-4 md:p-6 relative">
            <div className="max-w-7xl w-full flex flex-col justify-center py-20 md:py-0">
                <SectionTitle
                    title="Infraestrutura"
                    subtitle="Ferramentas dedicadas para monitoramento e controle total da sua aplicação."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    <FeatureCard
                        icon={Server}
                        title="Hospedagem"
                        desc="Alta disponibilidade garantida."
                        delay={0.1}
                    />
                    <FeatureCard
                        icon={BarChart3}
                        title="Analytics"
                        desc="Métricas precisas de engajamento."
                        delay={0.2}
                    />
                    <FeatureCard
                        icon={Database}
                        title="Data Control"
                        desc="Manipulação direta de dados."
                        delay={0.3}
                    />
                    <FeatureCard
                        icon={Terminal}
                        title="Logs & IA"
                        desc="Resumos inteligentes via IA."
                        delay={0.4}
                    />
                </div>
            </div>
        </section>
    );
};

// 3. Database
const DatabaseEdit = () => {
    return (
        <section className="h-dvh w-full snap-start bg-zinc-950 flex flex-col md:flex-row items-center justify-center p-4 md:p-12 gap-8 md:gap-16 relative overflow-hidden">
            {/* Background Glow reduzido no mobile */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-900/10 blur-[80px] md:blur-[120px] rounded-full pointer-events-none" />

            {/* Texto */}
            <div className="w-full md:w-1/3 space-y-4 md:space-y-8 z-10 flex flex-col items-center md:items-start text-center md:text-left mt-10 md:mt-0">
                <BetaBadge />

                <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                    Edição <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-white">
                        Ao Vivo
                    </span>
                </h2>

                <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] md:text-xs leading-relaxed max-w-xs md:max-w-none">
                    Altere preços, títulos e conteúdos do
                    seu site instantaneamente sem depender
                    de mim.
                </p>

                <div className="flex flex-col gap-4 w-full md:w-auto">
                    <div className="flex items-center gap-4 p-3 md:p-4 rounded-xl bg-white/5 border border-white/5 mx-auto md:mx-0">
                        <Edit3
                            className="text-blue-500"
                            size={20}
                        />
                        <div className="flex flex-col text-left">
                            <span className="text-white text-[10px] md:text-xs font-bold uppercase">
                                Input Control
                            </span>
                            <span className="text-zinc-500 text-[9px] md:text-[10px] uppercase">
                                Edite textos como formulário
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Visual Mockup Responsivo */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{
                    duration: 1,
                    ease: "circOut",
                }}
                className="w-full md:w-1/2 max-w-xl"
            >
                <div className="relative bg-black border border-zinc-800 rounded-2xl p-4 md:p-6 shadow-2xl scale-90 md:scale-100 origin-top">
                    {/* Header da Janela */}
                    <div className="flex items-center justify-between mb-4 md:mb-8 pb-4 border-b border-zinc-900">
                        <div className="text-[10px] md:text-xs font-mono text-zinc-500 flex items-center gap-2">
                            <AlertTriangle
                                size={12}
                                className="text-yellow-500"
                            />
                            BETA ACCESS
                        </div>
                        <div className="px-2 py-1 bg-green-900/20 text-green-500 text-[9px] md:text-[10px] font-bold uppercase rounded">
                            Salvo
                        </div>
                    </div>

                    {/* Simulando Inputs - Layout Compacto no Mobile */}
                    <div className="space-y-4 md:space-y-6">
                        <div className="space-y-2">
                            <label className="text-[9px] md:text-[10px] text-blue-500 font-black uppercase tracking-widest">
                                Nome do Projeto
                            </label>
                            <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-xs md:text-sm text-white font-medium">
                                <span>
                                    Landing Page
                                    Institucional
                                </span>
                                <div className="w-1.5 h-3 md:h-4 bg-blue-500 animate-pulse" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 md:gap-4">
                            <div className="space-y-2">
                                <label className="text-[9px] md:text-[10px] text-zinc-600 font-black uppercase tracking-widest">
                                    Status
                                </label>
                                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-[10px] md:text-xs text-green-400 font-bold uppercase">
                                    Em Andamento
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] md:text-[10px] text-zinc-600 font-black uppercase tracking-widest">
                                    Prazo
                                </label>
                                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-[10px] md:text-sm text-white">
                                    24/10/2026
                                </div>
                            </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                            <div className="px-4 py-2 md:px-6 bg-zinc-800 text-zinc-400 text-[10px] md:text-xs font-bold uppercase rounded cursor-not-allowed border border-white/5">
                                Aguardando Aprovação
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

// 4. Footer - Agora H-DVH (Full Screen)
const Footer = () => {
    return (
        <section className="h-dvh w-full snap-start bg-black border-t border-zinc-900 flex flex-col items-center justify-center p-6 relative">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 mix-blend-overlay"></div>

            <div className="text-center space-y-6 md:space-y-8 z-10 max-w-2xl px-4">
                <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-zinc-900 rounded-2xl flex items-center justify-center mb-4 border border-zinc-800 shadow-[0_0_50px_-10px_rgba(59,130,246,0.3)]"
                >
                    <Lock
                        size={24}
                        className="text-blue-500"
                    />
                </motion.div>

                <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">
                    Acesso Exclusivo
                </h2>

                <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] md:text-xs leading-relaxed">
                    Esta ferramenta é um benefício incluso
                    no seu pacote de manutenção.
                    <br className="hidden md:block" /> Seus
                    dados, seus clientes e seus projetos em
                    um só lugar.
                </p>

                <div className="flex flex-col md:flex-row gap-4 justify-center pt-8">
                    <Link
                        href="/login"
                        className="bg-white text-black px-8 py-4 rounded-full font-black uppercase tracking-wider text-[10px] md:text-xs hover:bg-zinc-200 transition-colors"
                    >
                        ACESSAR PLATAFORMA
                    </Link>
                    <Link
                        href="https://wa.me/5534996805599?text=Ol%C3%A1,%20gostaria%20de%20saber%20mais%20sobre%20o%20THLL%20Control%20System"
                        target="_blank"
                        className="px-8 py-4 rounded-full font-black uppercase tracking-wider text-[10px] md:text-xs text-zinc-400 border border-white/10 hover:bg-white/5 transition-colors"
                    >
                        FALE CONOSCO
                    </Link>
                </div>
            </div>

            <div className="absolute bottom-6 text-[9px] md:text-[10px] text-zinc-800 font-mono uppercase text-center w-full">
                THLL Control System © 2026 • Private Beta
                Build
            </div>
        </section>
    );
};

export default function ClientPage() {
    return (
        <ReactLenis
            root
            options={{
                lerp: 0.08,
                duration: 1.2,
                smoothWheel: true,
                // Importante: syncTouch para não bugar o Snap no mobile
                syncTouch: true,
            }}
        >
            <main
                className="bg-black text-white selection:bg-blue-500/30 selection:text-blue-200"
                style={{
                    height: "100dvh",
                    scrollSnapType: "y mandatory",
                    scrollBehavior: "smooth",
                    WebkitOverflowScrolling: "touch", // Suavidade no iOS
                }}
            >
                <div style={{ scrollSnapAlign: "start" }}>
                    <Hero />
                </div>
                <div style={{ scrollSnapAlign: "start" }}>
                    <Features />
                </div>
                <div style={{ scrollSnapAlign: "start" }}>
                    <DatabaseEdit />
                </div>
                <div style={{ scrollSnapAlign: "start" }}>
                    <Footer />
                </div>
            </main>
        </ReactLenis>
    );
}
