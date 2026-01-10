"use client";

import Link from "next/link";
import { Globe, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function SiteCard({ site }: { site: any }) {
    const [imgError, setImgError] = useState(false);
    const hasUrl = site.url && site.url.length > 5;
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${site.url}&sz=64`;

    return (
        <Link
            href={`/dashboard/sites/${site.id}`}
            className="group p-8 bg-zinc-950 border border-zinc-900 rounded-[2.5rem] hover:border-zinc-700 hover:bg-zinc-900/40 transition-all flex flex-col justify-between min-h-[220px] relative overflow-hidden"
        >
            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-zinc-900 rounded-2xl border border-zinc-800 flex items-center justify-center shrink-0 shadow-inner group-hover:border-zinc-600 transition-colors overflow-hidden">
                        {hasUrl && !imgError ? (
                            <img
                                src={faviconUrl}
                                alt=""
                                className="w-7 h-7 object-contain"
                                onError={() =>
                                    setImgError(true)
                                }
                            />
                        ) : (
                            <div className="text-zinc-600 group-hover:text-blue-500 transition-colors">
                                <Globe size={22} />
                            </div>
                        )}
                    </div>

                    <div className="overflow-hidden">
                        <h3 className="font-black text-xl tracking-tighter text-zinc-200 group-hover:text-white truncate">
                            {site.name}
                        </h3>
                        <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest truncate">
                            {hasUrl
                                ? site.url.replace(
                                      /^https?:\/\//,
                                      ""
                                  )
                                : "Configuração pendente"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between mt-4 relative z-10 border-t border-zinc-900/50 pt-5">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-700 group-hover:text-zinc-400 transition-colors">
                    Visualizar Dados
                </span>
                <ArrowRight
                    size={16}
                    className="text-zinc-800 group-hover:text-white group-hover:translate-x-1 transition-all"
                />
            </div>
        </Link>
    );
}
