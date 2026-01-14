import {
    ChevronLeft,
    ChevronRight,
    MousePointer2,
} from "lucide-react";

export function PageTable({
    paginatedPages,
    currentPage,
    totalPages,
    setCurrentPage,
}: any) {
    return (
        <div className="bg-zinc-900/20 border border-zinc-800 rounded-3xl overflow-hidden">
            <div className="p-5 border-b border-zinc-800 bg-zinc-900/40 flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-400">
                    <MousePointer2 size={14} />
                    <h3 className="text-xs font-bold uppercase tracking-widest">
                        Links mais acessados
                    </h3>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[450px]">
                    <tbody className="divide-y divide-zinc-800/50">
                        {paginatedPages.map(
                            ([path, count]: any) => (
                                <tr
                                    key={path}
                                    className="hover:bg-zinc-900/30 transition-colors"
                                >
                                    <td className="p-4 font-mono text-zinc-400 text-xs">
                                        {path}
                                    </td>
                                    <td className="p-4 text-right font-bold text-white whitespace-nowrap">
                                        {count} visitas
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
            {/* Paginação */}
            <div className="p-4 border-t border-zinc-800 flex items-center justify-between bg-zinc-900/40 text-[10px] font-bold uppercase text-zinc-500">
                <span>
                    Página {currentPage} de{" "}
                    {totalPages || 1}
                </span>
                <div className="flex gap-1">
                    <button
                        onClick={() =>
                            setCurrentPage((p: number) =>
                                Math.max(1, p - 1)
                            )
                        }
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-20"
                    >
                        <ChevronLeft size={14} />
                    </button>
                    <button
                        onClick={() =>
                            setCurrentPage((p: number) =>
                                Math.min(totalPages, p + 1)
                            )
                        }
                        disabled={
                            currentPage === totalPages ||
                            totalPages === 0
                        }
                        className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-20"
                    >
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}
