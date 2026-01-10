"use client";

import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
    ChevronRight,
    Download,
    ImageIcon,
    ChevronLeft,
    QrCode,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function QRCodeSection({
    site,
    qrStats,
}: any) {
    const [slug, setSlug] = useState("");
    const [logoUrl, setLogoUrl] = useState("");

    // Estados para Paginação
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const qrContainerRef = useRef<HTMLDivElement>(null);

    const finalUrl = `${site.url}?utm_source=${
        slug || "direto"
    }&utm_medium=qrcode`;

    // Lógica de Paginação
    const totalPages = Math.ceil(
        qrStats.length / itemsPerPage
    );
    const paginatedStats = qrStats.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const downloadPNG = () => {
        const canvas =
            qrContainerRef.current?.querySelector("canvas");
        if (!canvas) return;

        try {
            const pngUrl = canvas.toDataURL("image/png");
            const downloadLink =
                document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = `qr-${
                slug || "thll"
            }.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        } catch (err) {
            alert(
                "Erro de segurança: A logo escolhida não permite download."
            );
        }
    };

    return (
        <div className="space-y-12">
            {/* Seção de Configuração */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-zinc-900/30 p-8 rounded-[2rem] border border-zinc-800">
                <div className="space-y-6">
                    <h2 className="text-xl font-bold tracking-tight">
                        Gerador de QR Code
                    </h2>

                    <div className="space-y-4">
                        <label className="block">
                            <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
                                Identificador (Ex: mesa_01,
                                balcao)
                            </span>
                            <input
                                type="text"
                                className="w-full mt-2 bg-black border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-white transition-all"
                                placeholder="Onde o QR será colado?"
                                onChange={(e) =>
                                    setSlug(
                                        e.target.value.replace(
                                            /\s+/g,
                                            "_"
                                        )
                                    )
                                }
                            />
                        </label>

                        <label className="block">
                            <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-2">
                                <ImageIcon size={14} /> URL
                                da Logo (Opcional)
                            </span>
                            <input
                                type="text"
                                placeholder="Link da imagem png/jpg"
                                className="w-full mt-2 bg-black border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-sm text-white transition-all"
                                onChange={(e) =>
                                    setLogoUrl(
                                        e.target.value
                                    )
                                }
                            />
                        </label>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center bg-zinc-900/50 rounded-2xl p-8 border border-zinc-800/50">
                    <div
                        ref={qrContainerRef}
                        className="p-4 bg-white rounded-2xl shadow-2xl"
                    >
                        <QRCodeCanvas
                            value={finalUrl}
                            size={180}
                            level="H"
                            imageSettings={
                                logoUrl
                                    ? {
                                          src: logoUrl,
                                          height: 40,
                                          width: 40,
                                          excavate: true,
                                          // @ts-ignore
                                          crossOrigin:
                                              "anonymous",
                                      }
                                    : undefined
                            }
                        />
                    </div>

                    <button
                        onClick={downloadPNG}
                        className="mt-6 flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold transition-all hover:scale-105 active:scale-95"
                    >
                        <Download size={18} /> Salvar Imagem
                    </button>
                </div>
            </div>

            {/* Tabela de Estatísticas Melhorada */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                    <QrCode
                        size={18}
                        className="text-blue-500"
                    />
                    <h3 className="text-sm font-black text-zinc-300 uppercase tracking-widest">
                        Acessos por Ponto de Origem
                    </h3>
                </div>

                <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-zinc-900/80 text-zinc-500 uppercase text-[10px] font-black tracking-[0.15em]">
                                <tr>
                                    <th className="px-6 py-4">
                                        Ponto de Origem
                                    </th>
                                    <th className="px-6 py-4 text-right">
                                        Total de Visitas
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50">
                                <AnimatePresence mode="wait">
                                    {qrStats.length > 0 ? (
                                        paginatedStats.map(
                                            (stat: any) => (
                                                <motion.tr
                                                    initial={{
                                                        opacity: 0,
                                                        y: 5,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        y: -5,
                                                    }}
                                                    key={
                                                        stat.source
                                                    }
                                                    className="group hover:bg-zinc-800/20 transition-colors"
                                                >
                                                    <td className="px-6 py-4 font-mono text-blue-400 group-hover:text-blue-300 transition-colors">
                                                        qr_
                                                        {
                                                            stat.source
                                                        }
                                                    </td>
                                                    <td className="px-6 py-4 text-right font-black text-white text-base">
                                                        {
                                                            stat.count
                                                        }
                                                    </td>
                                                </motion.tr>
                                            )
                                        )
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={2}
                                                className="px-6 py-12 text-center text-zinc-600 font-medium"
                                            >
                                                Nenhum dado
                                                de QR Code
                                                capturado
                                                ainda.
                                            </td>
                                        </tr>
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>

                    {/* Paginação Compacta */}
                    {totalPages > 1 && (
                        <div className="p-4 border-t border-zinc-800/50 flex items-center justify-between bg-zinc-900/60">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                Página {currentPage} de{" "}
                                {totalPages}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() =>
                                        setCurrentPage(
                                            (p) =>
                                                Math.max(
                                                    1,
                                                    p - 1
                                                )
                                        )
                                    }
                                    disabled={
                                        currentPage === 1
                                    }
                                    className="p-2 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 disabled:opacity-20 transition-all"
                                >
                                    <ChevronLeft
                                        size={16}
                                    />
                                </button>
                                <button
                                    onClick={() =>
                                        setCurrentPage(
                                            (p) =>
                                                Math.min(
                                                    totalPages,
                                                    p + 1
                                                )
                                        )
                                    }
                                    disabled={
                                        currentPage ===
                                        totalPages
                                    }
                                    className="p-2 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 disabled:opacity-20 transition-all"
                                >
                                    <ChevronRight
                                        size={16}
                                    />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Link
                href={`/dashboard/[id]/detalhes`.replace(
                    "[id]",
                    site.id
                )}
                className="w-full flex items-center justify-center gap-2 bg-zinc-100 hover:bg-white text-black py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all shadow-lg active:scale-[0.98]"
            >
                Ver Relatório Completo{" "}
                <ChevronRight size={18} />
            </Link>
        </div>
    );
}
