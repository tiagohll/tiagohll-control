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
import ReactMarkdown from "react-markdown";
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

    useEffect(() => {
        document.body.classList.add("docs");
        document.title = `THLL Control Docs - ${currentSection.toUpperCase()}`;
        return () => {
            document.body.classList.remove("docs");
        };
    }, []);

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
                    id: "csp",
                    label: "Configuração de CSP (Content Security Policy)",
                },
                {
                    id: "env",
                    label: "Variáveis de Ambiente",
                },
            ],
        },
        {
            title: "Início Rápido",
            items: [
                {
                    id: "nextjs",
                    label: "Next.js (App Router)",
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

            <div className="max-w-[1400px] mx-auto flex items-start">
                {/* SIDEBAR (ESQUERDA) */}
                <aside
                    className={`
                        lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] fixed inset-y-0 left-0 top-0 h-full z-50 w-72 bg-black border-r border-zinc-900 overflow-y-auto transform transition-transform duration-300 ease-in-out
                        ${
                            isMobileMenuOpen
                                ? "translate-x-0"
                                : "-translate-x-full lg:translate-x-0"
                        }
                    `}
                >
                    <nav className="p-6 space-y-8 z-[999]">
                        {menu.map((group) => (
                            <div key={group.title}>
                                <h4 className="text-xs font-semibold text-white mb-4 italic tracking-wide uppercase">
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
                                                    if (
                                                        window.innerWidth <
                                                        1024
                                                    )
                                                        setIsMobileMenuOpen(
                                                            false
                                                        );
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
                                                {/*                                                {item.new &&
                                                    item.id !==
                                                        currentSection && (
                                                        <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-[9px] font-bold ml-2">
                                                            NEW
                                                        </span>
                                                    )} */}
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
                        className="fixed inset-0 bg-black/50 z-10 lg:hidden"
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
            content: [
                {
                    type: "text",
                    value: "O **THLL Control** é uma solução de analytics de alta performance, projetada para desenvolvedores que buscam métricas precisas sem comprometer os **Core Web Vitals**.",
                },
                {
                    type: "text",
                    value: "Diferente de rastreadores convencionais que sobrecarregam o navegador com scripts de terceiros, o THLL Control foca no essencial: monitoramento de tráfego, conversões críticas e origem de leads em tempo real.",
                },
                {
                    type: "subtitle",
                    value: "Diferenciais",
                },
                {
                    type: "text",
                    value: "• **Privacidade:** Controle total sobre os dados coletados, sem compartilhamento com terceiros.",
                },
                {
                    type: "text",
                    value: "• **Performance:** Script ultra-leve que não impacta o **LCP** ou o **TBT** da sua aplicação.",
                },
                {
                    type: "text",
                    value: "• **Inteligência de Origem:** Rastreamento nativo de **QR Codes** e parâmetros **UTM** para atribuição precisa de leads.",
                },
                {
                    type: "info",
                    value: "Totalmente compatível com frameworks modernas, suportando **SSR (Server Side Rendering)** e **Static Generation**.",
                },
            ],
        },
        csp: {
            title: "Segurança (CSP)",
            content: [
                {
                    type: "text",
                    value: "Caso seu projeto utilize uma **Content Security Policy (CSP)** restritiva, é necessário autorizar o domínio do THLL Control. Sem isso, o navegador bloqueará as requisições de telemetria.",
                },
                {
                    type: "subtitle",
                    value: "Configurando a diretiva connect-src",
                },
                {
                    type: "text",
                    value: "Adicione o domínio abaixo à diretiva `connect-src` no seu arquivo `next.config.js`. Isso habilita o envio de logs e eventos para nossos servidores.",
                },
                {
                    type: "code",
                    value: `/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; " +
              "connect-src 'self' https://tiagohll-control.vercel.app; " + // Domínio autorizado
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
              "style-src 'self' 'unsafe-inline'; " +
              "object-src 'none';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;`,
                    language: "typescript",
                    filename: "next.config.mjs",
                },
                {
                    type: "info",
                    value: "Dica: Se já houver outros domínios no `connect-src`, basta separá-los por um espaço simples.",
                },
                {
                    type: "subtitle",
                    value: "Validando a Configuração",
                },
                {
                    type: "text",
                    value: "Abra o Console do Navegador (F12). Se houver um erro de CSP mencionando o bloqueio de `connect-src`, verifique se a URL foi adicionada corretamente no arquivo de configuração.",
                },
            ],
        },
        env: {
            title: "Variáveis de Ambiente",
            content: [
                {
                    type: "text",
                    value: "As variáveis de ambiente definem o destino dos dados e o identificador do projeto. Recomendamos o isolamento entre ambientes para evitar a poluição dos dados de produção.",
                },
                {
                    type: "subtitle",
                    value: "Configuração do .env.local",
                },
                {
                    type: "text",
                    value: "Crie ou edite o arquivo `.env.local` na raiz do seu projeto e adicione as seguintes chaves:",
                },
                {
                    type: "code",
                    value: `# Endpoint da API (fornecido no setup)
NEXT_PUBLIC_ANALYTICS_URL=https://sua-api-thll.vercel.app/api/track

# ID único do site (encontrado no seu Dashboard)
NEXT_PUBLIC_SITE_ID=seu_site_id_aqui`,
                    filename: ".env.local",
                },
                {
                    type: "info",
                    value: "⚠️ Segurança: Variáveis prefixadas com `NEXT_PUBLIC_` ficam acessíveis ao cliente (browser). Nunca armazene segredos ou credenciais de banco de dados aqui.",
                },
            ],
        },
        nextjs: {
            title: "Next.js (App Router)",
            content: [
                {
                    type: "text",
                    value: "Para monitorar rotas no Next.js de forma otimizada, utilize o componente de monitoramento persistente. Ele gerencia sessões de visitantes e evita disparos redundantes.",
                },
                {
                    type: "code",
                    value: `"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Analytics({ siteId }: { siteId: string }) {
    const pathname = usePathname();

    useEffect(() => {
        // Lógica de debounce e token de visita
        const today = new Date().toISOString().slice(0, 10);
        let token = localStorage.getItem("_track_token");
        let tokenDate = localStorage.getItem("_track_date");

        if (!token || tokenDate !== today) {
            token = Math.random().toString(36).substring(2, 15);
            localStorage.setItem("_track_token", token);
            localStorage.setItem("_track_date", today);
        }

        const lastTrack = localStorage.getItem("_track_last");
        const now = Date.now();
        
        // Evita disparos repetidos em menos de 30s
        if (lastTrack && now - Number(lastTrack) < 30000) return;

        const urlParams = new URLSearchParams(window.location.search);
        const utmSource = urlParams.get("utm_source");
        const ENDPOINT = process.env.NEXT_PUBLIC_ANALYTICS_URL || "https://tiagohll-control.vercel.app/api/track";

        fetch(ENDPOINT, {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                site_id: siteId,
                path: window.location.pathname + window.location.search,
                visitor_hash: token,
                event_type: utmSource ? \`qr_\${utmSource}\` : "page_view",
            }),
        })
        .then(() => localStorage.setItem("_track_last", Date.now().toString()))
        .catch((err) => console.error("Analytics Error:", err));
    }, [pathname, siteId]);

    return null;
}`,
                    filename: "components/Analytics.tsx",
                },
                {
                    type: "subtitle",
                    value: "Implementação",
                },
                {
                    type: "text",
                    value: "Importe o componente no seu `layout.tsx` principal. Por estar fora do Suspense e vinculado ao `pathname`, ele capturará todas as trocas de rota automaticamente.",
                },
            ],
        },
    };

    const data = sections[id] || sections.intro;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tighter italic">
                {data.title}
            </h1>

            {data.content.map(
                (block: any, index: number) => {
                    if (block.type === "text") {
                        return (
                            <p
                                key={index}
                                className="text-zinc-400 leading-relaxed mb-4"
                            >
                                <ReactMarkdown>
                                    {block.value}
                                </ReactMarkdown>
                            </p>
                        );
                    }

                    if (block.type === "subtitle") {
                        return (
                            <h3
                                key={index}
                                className="text-xl font-semibold text-white mt-10 mb-4"
                            >
                                {block.value}
                            </h3>
                        );
                    }

                    if (block.type === "info") {
                        return (
                            <div
                                key={index}
                                className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6 mb-8"
                            >
                                <p className="text-sm text-blue-400 leading-relaxed italic">
                                    {/* <strong>Dica:</strong>{" "} */}
                                    {block.value}
                                </p>
                            </div>
                        );
                    }

                    if (block.type === "code") {
                        return (
                            <div
                                key={index}
                                className="relative mt-8 mb-8 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl bg-[#0a0a0a]"
                            >
                                <div className="flex items-center justify-between bg-zinc-900/50 border-b border-zinc-800 px-5 py-3">
                                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                                        {block.filename}
                                    </span>
                                    <button
                                        onClick={() =>
                                            onCopy(
                                                block.value
                                            )
                                        }
                                        className="text-zinc-400 hover:text-white transition-all active:scale-90"
                                    >
                                        {isCopied ? (
                                            <Check
                                                size={14}
                                                className="text-emerald-500"
                                            />
                                        ) : (
                                            <Copy
                                                size={14}
                                            />
                                        )}
                                    </button>
                                </div>
                                <div className="overflow-x-auto text-[12px] md:text-[13px] cscroll-bar">
                                    <SyntaxHighlighter
                                        language="tsx"
                                        style={vscDarkPlus}
                                        customStyle={{
                                            background:
                                                "transparent",
                                            padding: "20px",
                                        }}
                                    >
                                        {block.value}
                                    </SyntaxHighlighter>
                                </div>
                            </div>
                        );
                    }
                    return null;
                }
            )}
        </div>
    );
}
