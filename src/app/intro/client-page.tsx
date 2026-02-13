"use client";

import { motion } from "framer-motion";
import { ReactLenis } from "lenis/react";
import {
    ArrowRight,
    LayoutDashboard,
    BarChart3,
    QrCode,
    ShieldCheck,
    Settings,
    ChevronDown,
} from "lucide-react";
import Link from "next/link";

// --- Componentes de Apoio ---

const Badge = ({
    children,
}: {
    children: React.ReactNode;
}) => (
    <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full mb-6">
        <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em]">
            {children}
        </span>
    </div>
);

// --- 1. HERO: A Promessa de Controle ---
const Hero = () => (
    <section className="h-dvh w-full flex flex-col items-center justify-center bg-black p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#111_0%,_transparent_100%)] opacity-50" />

        <div className="z-20 max-w-4xl space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Badge>Desenvolvimento Estratégico</Badge>
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9]"
            >
                Eu não entrego <br /> apenas um site. <br />
                <span className="text-blue-600 text-stroke-thin ">
                    Eu entrego controle.
                </span>
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] md:text-sm max-w-2xl mx-auto leading-relaxed"
            >
                Todo projeto desenvolvido por mim inclui
                acesso a um painel exclusivo para você
                acompanhar dados, atualizar conteúdos e
                evoluir seu negócio em tempo real.
            </motion.p>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="pt-8"
            >
                <Link
                    href="#como-funciona"
                    className="group bg-white text-black px-10 py-5 rounded-full font-black uppercase text-xs tracking-[0.2em] transition-all hover:bg-blue-600 hover:text-white flex items-center gap-3 mx-auto w-fit"
                >
                    Conhecer como funciona
                    <ArrowRight size={18} />
                </Link>
            </motion.div>
        </div>

        <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-10 text-zinc-800"
        >
            <ChevronDown size={32} />
        </motion.div>
    </section>
);

// --- 2. A PROPOSTA DE VALOR: O que está incluso ---
const ValueProp = () => {
    const items = [
        {
            icon: LayoutDashboard,
            t: "Painel Exclusivo",
            d: "Área administrativa personalizada para seu negócio.",
        },
        {
            icon: BarChart3,
            t: "Métricas Reais",
            d: "Saiba quem entra e onde clica sem adivinhações.",
        },
        {
            icon: QrCode,
            t: "QR Code Integrado",
            d: "Conecte o mundo físico ao seu ecossistema digital.",
        },
        {
            icon: ShieldCheck,
            t: "Evolução Contínua",
            d: "Seu sistema sempre atualizado e em expansão.",
        },
    ];

    return (
        <section className="min-h-dvh w-full bg-zinc-950 flex items-center justify-center p-6 py-24">
            <div className="max-w-7xl w-full">
                <div className="mb-16">
                    <h2 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter">
                        O que está incluso <br /> no meu
                        serviço
                        <span className="text-blue-600">
                            .
                        </span>
                    </h2>
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-4">
                        Não é um adicional. É a base do meu
                        trabalho.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {items.map((item, i) => (
                        <div
                            key={i}
                            className="p-8 bg-black border border-white/5 rounded-[2rem] space-y-4 hover:border-blue-500/30 transition-colors"
                        >
                            <item.icon
                                className="text-blue-500"
                                size={28}
                            />
                            <h3 className="text-lg font-black text-white uppercase tracking-tighter">
                                {item.t}
                            </h3>
                            <p className="text-zinc-500 text-[10px] font-bold uppercase leading-relaxed">
                                {item.d}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- 3. COMO FUNCIONA: O Pós-Lançamento ---
const StepByStep = () => (
    <section
        id="como-funciona"
        className="min-h-dvh w-full bg-black flex items-center justify-center p-6 py-24"
    >
        <div className="max-w-5xl w-full">
            <div className="text-center mb-20">
                <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter">
                    Depois que seu <br /> site vai ao ar
                </h2>
            </div>

            <div className="space-y-4">
                {[
                    {
                        step: "01",
                        t: "Acesso Imediato",
                        d: "Você recebe as credenciais da sua área administrativa exclusiva.",
                    },
                    {
                        step: "02",
                        t: "Monitoramento",
                        d: "Acompanhe em tempo real as visitas e interações dos seus clientes.",
                    },
                    {
                        step: "03",
                        t: "Autonomia",
                        d: "Atualize textos, preços e imagens quando quiser, sem depender de ninguém.",
                    },
                    {
                        step: "04",
                        t: "Evolução",
                        d: "Receba melhorias de segurança e novas funcionalidades mensalmente.",
                    },
                ].map((item, i) => (
                    <div
                        key={i}
                        className="group flex flex-col md:flex-row items-center gap-6 p-8 bg-zinc-900/30 border border-white/5 rounded-3xl hover:bg-blue-600/5 transition-all"
                    >
                        <span className="text-4xl font-black text-zinc-800 group-hover:text-blue-500 transition-colors">
                            {item.step}
                        </span>
                        <div className="text-center md:text-left">
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter">
                                {item.t}
                            </h3>
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">
                                {item.d}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

// --- Componente Principal ---
export default function IntroPage() {
    return (
        <ReactLenis
            root
            options={{
                lerp: 0.08,
                duration: 1.2,
                smoothWheel: true,
            }}
        >
            <main className="bg-black text-white">
                <Hero />
                <ValueProp />
                <StepByStep />

                {/* CTA FINAL: Posicionamento */}
                <section className="h-dvh w-full flex flex-col items-center justify-center bg-zinc-950 p-6 text-center">
                    <div className="space-y-8 max-w-3xl">
                        <Settings
                            className="text-blue-500 mx-auto animate-spin-slow"
                            size={48}
                        />
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                            Pronto para ter o <br />{" "}
                            controle do seu negócio?
                        </h2>
                        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] md:text-xs leading-relaxed">
                            Trabalho com projetos que
                            valorizam estratégia e
                            acompanhamento real. <br />
                            Sua estrutura digital deixa de
                            ser um custo e vira um ativo.
                        </p>
                        <div className="flex flex-col md:flex-row gap-4 justify-center pt-6">
                            <Link
                                href="/login"
                                className="bg-white text-black px-12 py-5 rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 transition-transform"
                            >
                                Acessar Minha Estrutura
                            </Link>
                            <Link
                                href="https://wa.me/5534996805599"
                                className="border border-white/10 text-white px-12 py-5 rounded-full font-black uppercase text-xs tracking-widest hover:bg-white/5 transition-all"
                            >
                                Falar sobre meu projeto
                            </Link>
                        </div>
                    </div>
                    <div className="absolute bottom-10 font-mono text-[9px] text-zinc-800 uppercase tracking-[0.3em]">
                        Thll Control System © 2026 • Private
                        Infrastructure
                    </div>
                </section>
            </main>
        </ReactLenis>
    );
}
