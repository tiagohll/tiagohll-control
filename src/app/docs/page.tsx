"use client";

import { use, useEffect, useState } from "react";
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
                    value: "O THLL Control é uma ferramenta de analytics leve e de alta performance, projetada especificamente para desenvolvedores que precisam de métricas precisas sem sacrificar a velocidade de carregamento (Web Vitals).",
                },
                {
                    type: "text",
                    value: "Diferente de rastreadores pesados que carregam scripts de terceiros complexos, o THLL Control foca no essencial: monitorar o fluxo de usuários, origens de tráfego e conversões críticas em tempo real através de uma integração nativa com sua própria infraestrutura.",
                },
                {
                    type: "subtitle",
                    value: "Por que usar?",
                },
                {
                    type: "text",
                    value: "Privacidade: Você tem controle total sobre os dados coletados.",
                },
                {
                    type: "text",
                    value: "Performance: Script minimalista que não impacta o LCP (Largest Contentful Paint).",
                },
                {
                    type: "text",
                    value: "Flexibilidade: Criado para funcionar perfeitamente com Next.js, mas compatível com qualquer site via Script Universal.",
                },
                {
                    type: "text",
                    value: "Inteligência de Origem: Rastreamento nativo de QR Codes e parâmetros UTM para identificar exatamente de onde vêm seus leads.",
                },
                {
                    type: "info",
                    value: "Compatível com todas as frameworks modernas e SSR (Server Side Rendering).",
                },
            ],
        },
        csp: {
            title: "Configuração de Segurança (CSP)",
            content: [
                {
                    type: "text",
                    value: "Se o seu site utiliza uma Content Security Policy (CSP) restritiva, você precisará autorizar o domínio do THLL Control para que as métricas sejam enviadas corretamente. Sem essa permissão, o navegador bloqueará o envio dos eventos por segurança.",
                },
                {
                    type: "subtitle",
                    value: "Liberando o domínio na CSP",
                },
                {
                    type: "text",
                    value: "Você deve adicionar a URL https://tiagohll-control.vercel.app na diretiva connect-src do seu arquivo de configuração do Next.js. Isso permite que o seu site faça requisições (como o envio de logs e page views) para o nosso servidor.",
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
              // Adicione nossa URL no connect-src abaixo:
              "connect-src 'self' https://tiagohll-control.vercel.app; " +
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
                    value: "Se você já possui outras URLs no seu connect-src (como Google Analytics ou APIs próprias), basta adicionar a nossa URL separada por um espaço dentro da mesma string.",
                },
                {
                    type: "subtitle",
                    value: "Como verificar se há bloqueio?",
                },
                {
                    type: "text",
                    value: 'Abra o console do seu navegador (F12) no seu site. Se você vir um erro mencionando Content Security Policy directive: "connect-src...", significa que a permissão ainda não foi aplicada corretamente.',
                },
            ],
        },
        env: {
            title: "Configuração de Variáveis de Ambiente",
            content: [
                {
                    type: "text",
                    value: "Para que o rastreador saiba para onde enviar os dados, você precisa configurar as variáveis de ambiente no seu projeto Next.js. Isso garante que, durante o desenvolvimento local, você possa testar sem poluir os dados de produção.",
                },
                {
                    type: "subtitle",
                    value: "Configurando o arquivo .env.local",
                },
                {
                    type: "text",
                    value: "Na raiz do seu projeto, crie ou edite o arquivo .env.local. Este arquivo é ignorado pelo Git e deve conter suas chaves privadas e URLs de API.",
                },
                {
                    type: "code",
                    value: `# URL da sua API de rastreamento (onde os eventos serão salvos)
NEXT_PUBLIC_ANALYTICS_URL=https://sua-api-thll.vercel.app/api/track

# ID único do site para este projeto (gerado no seu dashboard)
NEXT_PUBLIC_SITE_ID=seu_site_id_aqui"`,
                    filename: ".env.local",
                },
                {
                    type: "info",
                    value: "Lembre-se que variáveis que começam com NEXT_PUBLIC_ ficam expostas no navegador. Nunca coloque senhas de banco de dados ou chaves secretas com este prefixo.",
                },
                {
                    type: "text",
                    value: "Após adicionar essas variáveis, é necessário reiniciar o servidor de desenvolvimento (npm run dev) para que as alterações sejam aplicadas.",
                },
            ],
        },
        nextjs: {
            title: "Next.js (App Router)",
            content: [
                {
                    type: "text",
                    value: "Para rastrear visitas no Next.js de forma eficiente, utilize o componente abaixo. Ele gerencia hashes de visitantes únicos e evita disparos duplicados em menos de 30 segundos.",
                },
                {
                    type: "code",
                    value: `"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Analytics({ siteId }: { siteId: string }) {
    const pathname = usePathname();

    useEffect(() => {
        const today = new Date().toISOString().slice(0, 10);
        let token = localStorage.getItem("_track_token");
        let tokenDate = localStorage.getItem("_track_date");

        if (!token || tokenDate !== today) {
            token = Math.random().toString(36).substring(2, 15);
            localStorage.setItem("_track_token", token);
            localStorage.setItem("_track_date", today);
        }

        if (!token) return;

        const lastTrack = localStorage.getItem("_track_last");
        const now = Date.now();
        if (lastTrack && now - Number(lastTrack) < 30000) return;

        const urlParams = new URLSearchParams(window.location.search);
        const utmSource = urlParams.get("utm_source");
        const currentPath = window.location.pathname + window.location.search;

        const ENDPOINT = process.env.NEXT_PUBLIC_ANALYTICS_URL || "https://tiagohll-control.vercel.app/api/track";

        fetch(ENDPOINT, {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                site_id: siteId,
                path: currentPath,
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
                    value: "Como utilizar",
                },
                {
                    type: "text",
                    value: "Importe o componente no seu layout.tsx principal para que ele monitore todas as rotas da aplicação.",
                },
            ],
        },
        // Adicione outras seções seguindo o mesmo padrão de array no 'content'
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
                                className="text-base md:text-lg leading-relaxed mb-6 text-zinc-400"
                            >
                                {block.value}
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
                                    <strong>Dica:</strong>{" "}
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
