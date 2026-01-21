"use client";
import { AdminRowActions } from "../AdminRowActions/AdminRowActions";
import { Users } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminTable({ profiles }: any) {
    return (
        <div className="bg-zinc-900/20 border border-zinc-800/50 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-zinc-800/50 bg-zinc-900/40">
                            <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                Detalhes do Perfil
                            </th>
                            <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center">
                                Permissão
                            </th>
                            <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center">
                                Limite
                            </th>
                            <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">
                                Ações
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/30 font-medium">
                        {profiles.map((profile: any) => (
                            <motion.tr
                                layout
                                initial={{
                                    opacity: 0,
                                }}
                                animate={{
                                    opacity: 1,
                                }}
                                exit={{
                                    opacity: 0,
                                }}
                                transition={{
                                    duration: 0.2,
                                }}
                                key={profile.id}
                                className="group hover:bg-zinc-800/20 transition-all duration-300"
                            >
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 group-hover:border-zinc-500 transition-colors">
                                            <Users
                                                size={18}
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm text-zinc-100 group-hover:text-white transition-colors tracking-tight">
                                                {
                                                    profile.email
                                                }
                                            </span>
                                            <span className="text-[9px] font-mono text-zinc-600">
                                                ID:{" "}
                                                {profile.id}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    {profile.is_admin ? (
                                        <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-tighter">
                                            Admin
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-zinc-500 text-[9px] font-black uppercase tracking-tighter">
                                            Cliente
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-5 text-center font-bold text-zinc-300">
                                    {profile.site_max_limit}
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <AdminRowActions
                                        profile={profile}
                                    />
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
