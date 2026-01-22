"use client";
import { AdminRowActions } from "../AdminRowActions/AdminRowActions";
import { Users } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminTable({ profiles }: any) {
    return (
        <div className="bg-zinc-950/50 border border-white/5 rounded-[2rem] backdrop-blur-md overflow-hidden">
            <div className="overflow-x-auto">
                {/* 2. Removido border-separate e adicionado w-full */}
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/[0.02]">
                            <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                                Perfil
                            </th>
                            <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] text-center">
                                Permissão
                            </th>
                            <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] text-center">
                                Limite
                            </th>
                            <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] text-right">
                                Ações
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                        {profiles.map((profile: any) => (
                            <motion.tr
                                key={profile.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="group hover:bg-white/[0.02] transition-colors relative hover:z-10"
                            >
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 group-hover:border-blue-500/50 group-hover:text-blue-500 transition-all">
                                            <Users
                                                size={20}
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-zinc-200">
                                                {
                                                    profile.email
                                                }
                                            </span>
                                            <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-tighter">
                                                ID:{" "}
                                                {
                                                    profile.id.split(
                                                        "-"
                                                    )[0]
                                                }
                                                ...
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-center">
                                    {profile.is_admin ? (
                                        <span className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase italic">
                                            Admin
                                        </span>
                                    ) : (
                                        <span className="px-4 py-1.5 rounded-full bg-zinc-800/30 border border-white/5 text-zinc-500 text-[10px] font-black uppercase italic">
                                            Cliente
                                        </span>
                                    )}
                                </td>
                                <td className="px-8 py-6 text-center font-black text-white text-lg italic">
                                    {profile.site_max_limit}
                                </td>
                                <td className="px-8 py-6 text-right">
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
