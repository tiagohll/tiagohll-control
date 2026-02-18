"use client";

import { useParams } from "next/navigation";
import { CHANGELOG_DATA } from "@/data/changelog";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import Link from "next/link";
import { ChevronLeft, GitMerge } from "lucide-react";

export default function ChangelogDetail() {
    const { slug } = useParams();
    const entry = CHANGELOG_DATA.find(
        (item) => item.slug === slug
    );

    if (!entry) return null;

    return (
        <main className="bg-black text-zinc-400 min-h-screen pb-40 selection:bg-blue-500/30">
            {/* Top Nav */}
            <nav className="max-w-2xl mx-auto px-6 py-16">
                <Link
                    href="/changelog"
                    className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-colors"
                >
                    <ChevronLeft
                        size={14}
                        className="group-hover:-translate-x-1 transition-transform"
                    />
                    Voltar para atualizações
                </Link>
            </nav>

            <article className="max-w-2xl mx-auto px-6">
                {/* Cabeçalho da Major Release */}
                <header className="mb-24">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-[10px] font-mono text-blue-500 font-black border border-blue-500/30 px-2 py-0.5 rounded">
                            BUILD_{entry.version}
                        </span>
                        <div className="h-[1px] flex-1 bg-zinc-900" />
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-4">
                        {entry.title}
                    </h1>
                    <p className="text-lg text-zinc-500 font-medium italic">
                        {entry.description}
                    </p>
                </header>

                {/* Listagem de Micro Versões */}
                <div className="space-y-32">
                    {entry.logs.map((log, index) => (
                        <section
                            key={index}
                            className="relative pl-8 border-l border-zinc-900"
                        >
                            {/* Indicador de Versão na linha do tempo */}
                            <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]" />

                            <div className="flex items-center gap-3 mb-8">
                                <GitMerge
                                    size={14}
                                    className="text-zinc-700"
                                />
                                <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                                    Update_Version_
                                    {log.microVersion}
                                </span>
                            </div>

                            <div
                                className="prose prose-invert prose-zinc max-w-none 
                prose-h3:text-white prose-h3:text-xl prose-h3:uppercase prose-h3:tracking-tighter
                prose-p:text-zinc-400 prose-p:text-lg prose-p:leading-relaxed
                prose-strong:text-zinc-200
                prose-code:text-blue-400 prose-code:bg-zinc-900/50 prose-code:px-1 prose-code:rounded"
                            >
                                <h3 className="mb-6">
                                    {log.updateTitle}
                                </h3>

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
                                                    className ||
                                                        ""
                                                );
                                            return !inline &&
                                                match ? (
                                                <SyntaxHighlighter
                                                    style={
                                                        vscDarkPlus
                                                    }
                                                    language={
                                                        match[1]
                                                    }
                                                    PreTag="div"
                                                    className="!bg-zinc-950 !p-6 rounded-2xl border border-white/5 my-8 !text-sm"
                                                    {...props}
                                                >
                                                    {String(
                                                        children
                                                    ).replace(
                                                        /\n$/,
                                                        ""
                                                    )}
                                                </SyntaxHighlighter>
                                            ) : (
                                                <code
                                                    {...props}
                                                >
                                                    {
                                                        children
                                                    }
                                                </code>
                                            );
                                        },
                                    }}
                                >
                                    {log.content}
                                </ReactMarkdown>
                            </div>
                        </section>
                    ))}
                </div>

                {/* Metadata de encerramento */}
                <footer className="mt-40 pt-12 border-t border-zinc-900 flex flex-col items-center">
                    <div className="text-[10px] font-mono text-zinc-700 uppercase tracking-[0.4em] mb-4">
                        Compilado em {entry.date}
                    </div>
                    <div className="w-1 h-16 bg-gradient-to-b from-zinc-800 to-transparent" />
                </footer>
            </article>
        </main>
    );
}
