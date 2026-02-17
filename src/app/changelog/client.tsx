"use client";

import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ReactLenis } from "lenis/react";
import {
    Calendar,
    GitBranch,
    Rocket,
    Terminal,
} from "lucide-react";
import Link from "next/link";

const CHANGELOG_DATA = [
    {
        version: "v1.3.3",
        date: "16 Fev, 2026",
        title: "Arquitetura de Conversão & UX",
        status: "current",
        content: `
### Nova Estrutura Estratégica
Reestruturamos a interface principal com foco total em **conversão de negócios**. 

- **Novo Hero Section**: Foco em controle e autonomia.
- **Integração Lenis**: Scroll suave otimizado para dispositivos móveis.
- **Refatoração de Tipagem**: Melhor performance no carregamento de componentes.

\`\`\`typescript
const config = {
  strategy: "conversion",
  focus: "business_value",
  performance: "ultra-fast"
};
\`\`\`
        `,
    },
    {
        version: "v1.2.0",
        date: "02 Fev, 2026",
        title: "Sistema de Analytics Integrado",
        status: "stable",
        content: `
### Monitoramento em Tempo Real
Implementamos a primeira camada do sistema de monitoramento de usuários.

1. **Rastreamento de Cliques**: Identificação de zonas de calor.
2. **Dashboard de Visitas**: Visualização simplificada de tráfego.
3. **QR Code Engine**: Gerador automático de links rastreáveis.

> "Sem dados, você é apenas mais uma pessoa com uma opinião."
        `,
    },
    {
        version: "v1.0.0",
        date: "15 Jan, 2026",
        title: "Lançamento da Infraestrutura",
        status: "stable",
        content: `
### O Nascimento do THLL Control
Base sólida construída em Next.js 15 e Tailwind CSS.

- Setup de autenticação via **NextAuth**.
- Conexão com banco de dados **Supabase**.
- Estrutura de componentes atômicos.
        `,
    },
];

const ChangelogSection = ({
    item,
    onInView,
}: {
    item: any;
    onInView: (v: string) => void;
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { amount: 0.3 }); // Sensibilidade ajustada

    useEffect(() => {
        if (isInView) onInView(item.version);
    }, [isInView, item.version, onInView]);

    return (
        <section
            id={item.version}
            ref={ref}
            className="py-24 border-b border-white/5 relative group last:border-0"
        >
            <div className="flex items-center gap-4 mb-8">
                <div
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        item.status === "current"
                            ? "bg-blue-600 text-white"
                            : "bg-zinc-800 text-zinc-500"
                    }`}
                >
                    {item.version}
                </div>
                <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono">
                    <Calendar size={14} /> {item.date}
                </div>
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-8 italic">
                {item.title}
            </h2>

            <div className="max-w-3xl prose prose-invert prose-zinc prose-p:text-zinc-400 prose-headings:text-white prose-strong:text-blue-500">
                <ReactMarkdown
                    components={{
                        code({
                            node,
                            inline,
                            className,
                            children,
                            ...props
                        }: any) {
                            const match =
                                /language-(\w+)/.exec(
                                    className || ""
                                );
                            return !inline && match ? (
                                <SyntaxHighlighter
                                    style={vscDarkPlus}
                                    language={match[1]}
                                    PreTag="div"
                                    className="rounded-xl border border-white/5 !bg-zinc-950/50"
                                    {...props}
                                >
                                    {String(
                                        children
                                    ).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                            ) : (
                                <code
                                    className="bg-zinc-900 px-1.5 py-0.5 rounded text-blue-400 font-mono text-sm"
                                    {...props}
                                >
                                    {children}
                                </code>
                            );
                        },
                    }}
                >
                    {item.content}
                </ReactMarkdown>
            </div>
        </section>
    );
};

export default function ChangelogClient() {
    const [activeVersion, setActiveVersion] = useState(
        CHANGELOG_DATA[0].version
    );

    const scrollToVersion = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 80; // Compensar cabeçalho se houver
            const bodyRect =
                document.body.getBoundingClientRect().top;
            const elementRect =
                element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        }
    };

    return (
        <ReactLenis
            root
            options={{ lerp: 0.1, duration: 1.5 }}
        >
            <main className="bg-black text-white min-h-screen flex selection:bg-blue-600/30">
                {/* SIDEBAR */}
                <aside className="fixed left-0 top-0 w-20 md:w-72 h-full border-r border-white/5 bg-black z-50 hidden md:flex flex-col p-10">
                    <div className="mb-16">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.2)]">
                            <GitBranch
                                className="text-white"
                                size={24}
                            />
                        </div>
                        <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">
                            THLL / System
                        </h1>
                    </div>

                    <nav className="space-y-6">
                        {CHANGELOG_DATA.map((item) => (
                            <button
                                key={item.version}
                                onClick={() =>
                                    scrollToVersion(
                                        item.version
                                    )
                                }
                                className="group flex items-center gap-6 w-full text-left outline-none"
                            >
                                <div
                                    className={`w-1 h-10 rounded-full transition-all duration-700 ${
                                        activeVersion ===
                                        item.version
                                            ? "bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.8)] scale-y-110"
                                            : "bg-zinc-900 group-hover:bg-zinc-700"
                                    }`}
                                />
                                <div className="flex flex-col gap-1">
                                    <span
                                        className={`text-xs font-black uppercase tracking-widest transition-all ${
                                            activeVersion ===
                                            item.version
                                                ? "text-white translate-x-1"
                                                : "text-zinc-600 group-hover:text-zinc-400"
                                        }`}
                                    >
                                        {item.version}
                                    </span>
                                    <span className="text-[10px] font-mono text-zinc-800 uppercase tracking-tighter">
                                        {item.date}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </nav>

                    <div className="mt-auto pt-8 border-t border-white/5">
                        <Link
                            href="/intro"
                            className="text-[10px] font-black text-zinc-600 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2"
                        >
                            ← Voltar
                        </Link>
                    </div>
                </aside>

                {/* CONTEÚDO */}
                <div className="flex-1 md:ml-72 p-6 md:p-24 relative">
                    <div className="max-w-4xl mx-auto">
                        <header className="mb-32 space-y-6">
                            <div className="flex items-center gap-3 text-blue-500">
                                <Terminal size={18} />
                                <span className="font-mono text-xs uppercase tracking-[0.3em] font-black">
                                    Release_Manifest
                                </span>
                            </div>
                            <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none">
                                Change
                                <br />
                                <span className="text-zinc-900 text-stroke-thin">
                                    Log.
                                </span>
                            </h1>
                        </header>

                        <div className="relative">
                            {CHANGELOG_DATA.map((item) => (
                                <ChangelogSection
                                    key={item.version}
                                    item={item}
                                    onInView={(v) =>
                                        setActiveVersion(v)
                                    }
                                />
                            ))}
                        </div>

                        {/* FADE OUT FINAL DA PÁGINA */}
                        <div className="relative py-60 text-center space-y-8">
                            {/* O Degrade que você pediu, apenas no final */}
                            <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-transparent to-black pointer-events-none z-10" />

                            <div className="relative z-20 space-y-4">
                                <Rocket
                                    className="mx-auto text-blue-600 animate-pulse"
                                    size={48}
                                />
                                <p className="text-zinc-500 font-black uppercase text-xs tracking-[0.5em]">
                                    Fim da Transmissão
                                </p>
                                <div className="text-[10px] font-mono text-zinc-800">
                                    SISTEMA EM EVOLUÇÃO
                                    CONTÍNUA • PRÓXIMA BUILD
                                    EM AGENDAMENTO
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </ReactLenis>
    );
}
