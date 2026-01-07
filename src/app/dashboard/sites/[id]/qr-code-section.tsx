"use client";

import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
    Download,
    Copy,
    Check,
    ImageIcon,
} from "lucide-react";

export default function QRCodeSection({
    site,
    qrStats,
}: {
    site: any;
    qrStats: any[];
}) {
    const [slug, setSlug] = useState("");
    const [logoUrl, setLogoUrl] = useState("");
    const [copied, setCopied] = useState(false);

    const finalUrl = `${site.url}?utm_source=${
        slug || "qrcode"
    }&utm_medium=qrcode`;

    const downloadPNG = () => {
        const canvas = document.getElementById(
            "qr-code-canvas"
        ) as HTMLCanvasElement;
        if (!canvas) return;
        const link = document.createElement("a");
        link.download = `qr-${slug || "site"}.png`;
        link.href = canvas.toDataURL();
        link.click();
    };

    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-zinc-900/30 p-8 rounded-2xl border border-zinc-800">
                <div className="space-y-6">
                    <h2 className="text-xl font-bold">
                        Configuração do QR Code
                    </h2>

                    <div className="space-y-4">
                        <label className="block">
                            <span className="text-sm text-zinc-400 font-medium">
                                Identificador (Ex: mesa_01)
                            </span>
                            <input
                                type="text"
                                className="w-full mt-1 bg-black border border-zinc-800 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
                                onChange={(e) =>
                                    setSlug(e.target.value)
                                }
                            />
                        </label>

                        <label className="block">
                            <span className="text-sm text-zinc-400 font-medium flex items-center gap-2">
                                <ImageIcon size={14} /> URL
                                da Logo (Opcional)
                            </span>
                            <input
                                type="text"
                                placeholder="https://example.com/logo.png"
                                className="w-full mt-1 bg-black border border-zinc-800 rounded-lg px-4 py-2 outline-none focus:border-blue-500 text-xs"
                                onChange={(e) =>
                                    setLogoUrl(
                                        e.target.value
                                    )
                                }
                            />
                        </label>
                    </div>

                    <div className="p-4 bg-black/50 border border-zinc-800 rounded-lg">
                        <code className="text-[10px] text-blue-400 break-all">
                            {finalUrl}
                        </code>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center">
                    <div className="p-4 bg-white rounded-xl">
                        <QRCodeCanvas
                            id="qr-code-canvas"
                            value={finalUrl}
                            size={200}
                            level="H"
                            imageSettings={
                                logoUrl
                                    ? {
                                          src: logoUrl,
                                          x: undefined,
                                          y: undefined,
                                          height: 40,
                                          width: 40,
                                          excavate: true,
                                      }
                                    : undefined
                            }
                        />
                    </div>
                    <button
                        onClick={downloadPNG}
                        className="mt-6 flex items-center gap-2 bg-white text-black px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform"
                    >
                        <Download size={18} /> Baixar PNG
                    </button>
                </div>
            </div>

            {/* Analytics Filtrada para QR Codes */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">
                    Desempenho por QR Code
                </h3>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-black/50 text-zinc-500 uppercase text-[10px] font-bold">
                            <tr>
                                <th className="px-6 py-3">
                                    Origem (UTM Source)
                                </th>
                                <th className="px-6 py-3 text-right">
                                    Acessos Únicos
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {qrStats.length > 0 ? (
                                qrStats.map((stat) => (
                                    <tr
                                        key={stat.source}
                                        className="hover:bg-zinc-800/30"
                                    >
                                        <td className="px-6 py-4 font-mono text-blue-400">
                                            {stat.source}
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold">
                                            {stat.count}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={2}
                                        className="px-6 py-8 text-center text-zinc-500"
                                    >
                                        Nenhum scan de QR
                                        Code detectado
                                        ainda.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
