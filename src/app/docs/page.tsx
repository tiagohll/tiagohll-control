"use client";

import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
    Copy,
    Check,
    Search,
    ChevronRight,
    ExternalLink,
    Github,
    Menu,
    X,
} from "lucide-react";
import Link from "next/link";

export default function NextJsDocs() {
    const [currentSection, setCurrentSection] =
        useState("intro");
    const [isCopied, setIsCopied] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] =
        useState(false); // Novo estado
    const [searchQuery, setSearchQuery] = useState("");

    const copyCode = (text: string) => {
        navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    document.title = `THLL Control Docs - ${currentSection.toUpperCase()}`;

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsSearchOpen((open) => !open);
            }
            if (e.key === "Escape") setIsSearchOpen(false);
        };
        document.addEventListener("keydown", down);
        return () =>
            document.removeEventListener("keydown", down);
    }, []);

    const menu = [
        {
            title: "Primeiros Passos",
            items: [
                { id: "introdução", label: "Introdução" },
                {
                    id: "cors",
                    label: "Configuração de CORS",
                },
            ],
        },
        {
            title: "Instalação",
            items: [
                {
                    id: "nextjs",
                    label: "Next.js (App Router)",
                },
                {
                    id: "html",
                    label: "Script Universal",
                    new: true,
                },
            ],
        },
        {
            title: "Recursos Avançados",
            items: [
                {
                    id: "whatsapp",
                    label: "Tracking de WhatsApp",
                    new: true,
                },
                {
                    id: "custom",
                    label: "Eventos Customizados",
                    new: true,
                },
            ],
        },
    ];

    const allItems = menu.flatMap((g) => g.items);
    const filteredResults = allItems.filter((item) =>
        item.label
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-black text-[#888] font-sans selection:bg-blue-500/30 relative">
            {/* SEARCH MODAL (CMD+K) */}
            {isSearchOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() =>
                            setIsSearchOpen(false)
                        }
                    />
                    <div className="relative w-full max-w-xl bg-[#111] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center px-4 py-3 border-b border-zinc-800">
                            <Search
                                size={18}
                                className="text-zinc-500 mr-3"
                            />
                            <input
                                autoFocus
                                className="flex-1 bg-transparent border-none outline-none text-white text-sm"
                                placeholder="Buscar na documentação..."
                                value={searchQuery}
                                onChange={(e) =>
                                    setSearchQuery(
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                        <div className="max-h-[350px] overflow-y-auto p-2">
                            {filteredResults.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setCurrentSection(
                                            item.id
                                        );
                                        setIsSearchOpen(
                                            false
                                        );
                                        setSearchQuery("");
                                    }}
                                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-zinc-800/50 text-left group transition-colors"
                                >
                                    <span className="text-sm text-zinc-300 group-hover:text-white">
                                        {item.label}
                                    </span>
                                    <ChevronRight
                                        size={14}
                                        className="text-zinc-600 group-hover:text-blue-500"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* HEADER */}
            <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black/70 backdrop-blur-md">
                <div className="max-w-[1400px] mx-auto h-16 flex items-center justify-between px-4 md:px-6">
                    <div className="flex items-center gap-4">
                        {/* BOTÃO MENU MOBILE */}
                        <button
                            onClick={() =>
                                setIsMobileMenuOpen(
                                    !isMobileMenuOpen
                                )
                            }
                            className="lg:hidden p-2 text-zinc-400 hover:text-white transition-colors"
                        >
                            {isMobileMenuOpen ? (
                                <X size={20} />
                            ) : (
                                <Menu size={20} />
                            )}
                        </button>

                        <div className="text-white font-bold tracking-tight text-sm flex items-center gap-2">
                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                                <div className="w-3 h-3 bg-black rotate-45" />
                            </div>
                            <span className="hidden sm:inline text-zinc-500 font-normal italic">
                                Docs
                            </span>
                        </div>

                        {/* BUSCA DESKTOP */}
                        <div
                            onClick={() =>
                                setIsSearchOpen(true)
                            }
                            className="hidden md:flex items-center bg-zinc-900 border border-zinc-800 rounded-md px-3 py-1.5 gap-3 w-64 group cursor-pointer hover:border-zinc-700 transition-colors"
                        >
                            <Search
                                size={14}
                                className="group-hover:text-white"
                            />
                            <span className="text-xs">
                                Buscar...
                            </span>
                            <kbd className="ml-auto bg-black px-1.5 py-0.5 rounded border border-zinc-800 text-[10px] text-zinc-500 font-sans">
                                ⌘ K
                            </kbd>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* ÍCONE BUSCA MOBILE */}
                        <button
                            onClick={() =>
                                setIsSearchOpen(true)
                            }
                            className="md:hidden p-2 text-zinc-400"
                        >
                            <Search size={20} />
                        </button>
                        <Link
                            href="https://github.com/tiagohll/tiagohll-control"
                            target="_blank"
                        >
                            <Github
                                size={18}
                                className="hover:text-white cursor-pointer transition-colors"
                            />
                        </Link>
                    </div>
                </div>
            </header>

            <div className="max-w-[1400px] mx-auto flex">
                {/* SIDEBAR (ESQUERDA) - RESPONSIVA */}
                <aside
                    className={`
                    fixed inset-y-0 left-0 z-[60] w-72 bg-black border-r border-zinc-900 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:block
                    ${
                        isMobileMenuOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                `}
                >
                    <nav className="h-full overflow-y-auto p-6 space-y-8 pt-20 lg:pt-6">
                        {menu.map((group) => (
                            <div key={group.title}>
                                <h4 className="text-xs font-semibold text-white mb-4 italic tracking-wide">
                                    {group.title}
                                </h4>
                                <ul className="space-y-2 border-l border-zinc-800 ml-1">
                                    {group.items.map(
                                        (item) => (
                                            <li
                                                key={
                                                    item.id
                                                }
                                                onClick={() => {
                                                    setCurrentSection(
                                                        item.id
                                                    );
                                                    setIsMobileMenuOpen(
                                                        false
                                                    ); // Fecha ao clicar no mobile
                                                }}
                                                className={`pl-4 -ml-[1px] text-sm cursor-pointer transition-colors border-l ${
                                                    currentSection ===
                                                    item.id
                                                        ? "border-blue-500 text-blue-500 font-medium"
                                                        : "border-transparent hover:border-zinc-500 hover:text-white flex w-full items-center justify-between"
                                                }`}
                                            >
                                                <span>
                                                    {
                                                        item.label
                                                    }
                                                </span>

                                                {item.new &&
                                                    item.id !=
                                                        currentSection && (
                                                        <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-[9px] font-bold ml-2">
                                                            NEW
                                                        </span>
                                                    )}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        ))}
                    </nav>
                </aside>

                {/* OVERLAY MOBILE PARA SIDEBAR */}
                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-[55] lg:hidden"
                        onClick={() =>
                            setIsMobileMenuOpen(false)
                        }
                    />
                )}

                {/* CONTEÚDO PRINCIPAL */}
                <main className="flex-1 px-4 md:px-12 py-12 min-w-0">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-2 text-blue-500 text-[10px] uppercase font-bold tracking-widest mb-4">
                            Docs <ChevronRight size={10} />{" "}
                            {currentSection}
                        </div>

                        <DocContent
                            id={currentSection}
                            onCopy={copyCode}
                            isCopied={isCopied}
                        />

                        <footer className="mt-24 pt-10 border-t border-zinc-900 flex flex-col md:flex-row justify-between gap-4">
                            <div className="text-[11px] hover:text-white cursor-pointer flex items-center gap-2 transition-colors">
                                <Link
                                    href="https://github.com/tiagohll/tiagohll-control"
                                    target="_blank"
                                    className="flex items-center gap-2"
                                >
                                    <ExternalLink
                                        size={14}
                                    />{" "}
                                    Editar no GitHub
                                </Link>
                            </div>
                            <div className="text-[11px] font-mono opacity-50 uppercase tracking-tighter">
                                Last Update: Jan 2026
                            </div>
                        </footer>
                    </div>
                </main>

                {/* SIDEBAR DIREITA (Apenas Desktop) */}
                <aside className="w-64 hidden xl:block sticky top-16 h-[calc(100vh-64px)] p-8">
                    <h4 className="text-xs font-semibold text-white mb-4 uppercase tracking-tighter">
                        Nesta página
                    </h4>
                    <ul className="space-y-3 text-xs border-l border-zinc-900 pl-4">
                        <li className="text-blue-500 cursor-pointer">
                            Visão Geral
                        </li>
                        {/*                         <li className="hover:text-white cursor-pointer">
                            Implementação
                        </li> */}
                    </ul>
                </aside>
            </div>
        </div>
    );
}

// CONTEÚDO DINÂMICO (Sub-componente)
function DocContent({ id, onCopy, isCopied }: any) {
    const sections: any = {
        intro: {
            title: "Introdução",
            text: "O rastreador THLL Control é uma solução de analytics otimizada para Web Vitals. Capture cada interação sem comprometer o carregamento da sua página.",
            info: "Compatível com todas as frameworks modernas e SSR (Server Side Rendering).",
        },
        cors: {
            title: "Configuração de CORS",
            text: "Para permitir que sites externos enviem eventos para sua API no Next.js, configure o next.config.js.",
            code: `/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [{
      source: "/api/track",
      headers: [
        { key: "Access-Control-Allow-Origin", value: "*" },
        { key: "Access-Control-Allow-Methods", value: "POST, OPTIONS" }
      ],
    }];
  },
};
export default nextConfig;`,
            filename: "next.config.mjs",
        },
        nextjs: {
            title: "Next.js (App Router)",
            text: "Use o hook usePathname para monitorar navegação em SPAs.",
            code: `"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Analytics({ siteId }) {
  const pathname = usePathname();
  useEffect(() => {
    fetch('/api/track', {
        method: 'POST',
        body: JSON.stringify({ site_id: siteId, path: pathname })
    });
  }, [pathname]);
  return null;
}`,
            filename: "components/Analytics.tsx",
        },
        html: {
            title: "Script Universal",
            text: "Cole antes da tag </body>.",
            code: `<script src="https://tiagohll-control.vercel.app/tracker.js" data-site="ID"></script>`,
            filename: "index.html",
        },
        whatsapp: {
            title: "Tracking de WhatsApp",
            text: "Monitore cliques em botões de WhatsApp.",
            code: `window.thll.track('whatsapp_conversion');`,
            filename: "Conversion.js",
            info: "Este recurso esta em beta e pode ser alterado sem aviso prévio.",
        },
        custom: {
            title: "Eventos Customizados",
            text: "Envie dados personalizados como valores de venda ou nomes de leads.",
            code: `window.thll.track('purchase', { value: 97.00, currency: 'BRL' });`,
            filename: "Checkout.js",
            info: "Este recurso esta em beta e pode ser alterado sem aviso prévio.",
        },
    };

    const data = sections[id] || sections.intro;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tighter italic">
                {data.title}
            </h1>
            <p className="text-base md:text-lg leading-relaxed mb-8 text-zinc-400">
                {data.text}
            </p>

            {data.info && (
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6 mb-8">
                    <p className="text-sm text-blue-400 leading-relaxed italic">
                        <strong>Dica:</strong> {data.info}
                    </p>
                </div>
            )}

            {data.code && (
                <div className="relative mt-8 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl bg-[#0a0a0a]">
                    <div className="flex items-center justify-between bg-zinc-900/50 border-b border-zinc-800 px-5 py-3">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                            {data.filename}
                        </span>
                        <button
                            onClick={() =>
                                onCopy(data.code)
                            }
                            className="text-zinc-400 hover:text-white transition-all active:scale-90"
                        >
                            {isCopied ? (
                                <Check
                                    size={14}
                                    className="text-emerald-500"
                                />
                            ) : (
                                <Copy size={14} />
                            )}
                        </button>
                    </div>
                    <div className="overflow-x-auto text-[12px] md:text-[13px]">
                        <SyntaxHighlighter
                            language="tsx"
                            style={vscDarkPlus}
                            customStyle={{
                                background: "transparent",
                                padding: "20px",
                            }}
                        >
                            {data.code}
                        </SyntaxHighlighter>
                    </div>
                </div>
            )}
        </div>
    );
}
