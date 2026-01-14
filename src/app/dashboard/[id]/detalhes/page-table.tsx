export function PageTable({
    paginatedPages = [],
    currentPage,
    totalPages,
    setCurrentPage,
}: any) {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex items-center gap-2">
                <div className="p-1.5 bg-blue-500/10 rounded-lg">
                    <span className="text-blue-500 text-xs">
                        🔗
                    </span>
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-100">
                    Links mais acessados
                </h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[450px]">
                    <tbody className="divide-y divide-zinc-800/50">
                        {paginatedPages?.length > 0 ? (
                            paginatedPages.map(
                                ([path, count]: any) => (
                                    <tr
                                        key={path}
                                        className="group hover:bg-zinc-800/30 transition-colors"
                                    >
                                        <td className="py-4 px-6 font-medium text-zinc-400 group-hover:text-white transition-colors">
                                            {path}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <span className="font-black text-white">
                                                {count}
                                            </span>
                                            <span className="text-[10px] text-zinc-500 ml-2 uppercase">
                                                visitas
                                            </span>
                                        </td>
                                    </tr>
                                )
                            )
                        ) : (
                            <tr>
                                <td
                                    colSpan={2}
                                    className="py-10 text-center text-zinc-500 italic"
                                >
                                    Nenhum dado encontrado
                                    para este período.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="p-4 border-t border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                    <button
                        disabled={currentPage === 1}
                        onClick={() =>
                            setCurrentPage(
                                (p: number) => p - 1
                            )
                        }
                        className="text-[10px] font-black uppercase text-zinc-500 hover:text-white disabled:opacity-30"
                    >
                        Anterior
                    </button>
                    <span className="text-[10px] font-black text-zinc-600">
                        Página {currentPage} de {totalPages}
                    </span>
                    <button
                        disabled={
                            currentPage === totalPages
                        }
                        onClick={() =>
                            setCurrentPage(
                                (p: number) => p + 1
                            )
                        }
                        className="text-[10px] font-black uppercase text-zinc-500 hover:text-white disabled:opacity-30"
                    >
                        Próxima
                    </button>
                </div>
            )}
        </div>
    );
}
