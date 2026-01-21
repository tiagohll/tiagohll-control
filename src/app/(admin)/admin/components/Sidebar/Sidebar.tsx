"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    ShieldCheck,
    PiggyBank,
    Flag,
    Menu,
    X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MENU_ITEMS = [
    {
        name: "Dashboard",
        icon: LayoutDashboard,
        href: "/admin/dashboard",
    },
    {
        name: "Gerenciar Usuários",
        icon: Users,
        href: "/admin/users",
    },
    {
        name: "Financeiro",
        icon: PiggyBank,
        href: "/admin/finance",
    },
    {
        name: "Relatórios",
        icon: Flag,
        href: "/admin/reports",
    },
    {
        name: "Configurações",
        icon: Settings,
        href: "/admin/settings",
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const SidebarContent = ({
        isMobile,
    }: {
        isMobile: boolean;
    }) => (
        <>
            <div className="p-6 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                        <ShieldCheck
                            size={18}
                            className="text-white"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white font-black text-sm tracking-tighter uppercase leading-none">
                            THLL{" "}
                            <span className="text-blue-500">
                                CONTROL
                            </span>
                        </span>
                        <span className="text-[9px] text-zinc-500 font-bold tracking-[1px] uppercase mt-1">
                            v1.3.0
                        </span>
                    </div>
                </div>
                {isMobile && (
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 text-zinc-500"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            <nav className="flex-1 px-3 space-y-1">
                <p className="px-4 text-[10px] font-black text-zinc-600 uppercase tracking-[2px] mb-4">
                    Menu Principal
                </p>
                {MENU_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="block relative group"
                        >
                            <div
                                className={`
                                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                                ${isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300"}
                            `}
                            >
                                <item.icon
                                    size={18}
                                    className={`relative z-10 ${isActive ? "text-blue-500" : "group-hover:scale-110 transition-transform"}`}
                                />
                                <span className="relative z-10 text-sm font-bold tracking-tight">
                                    {item.name}
                                </span>

                                {isActive && (
                                    <motion.div
                                        // O segredo para não bugar: layoutId diferente para cada ambiente
                                        layoutId={
                                            isMobile
                                                ? "pill-mobile"
                                                : "pill-desktop"
                                        }
                                        className="absolute inset-0 bg-blue-600/5 border border-blue-500/20 rounded-xl"
                                        initial={false}
                                        transition={{
                                            type: "spring",
                                            stiffness: 500,
                                            damping: 35,
                                            mass: 1,
                                        }}
                                    />
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/5 bg-black/20 mt-auto">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/5 transition-all font-bold text-xs uppercase tracking-widest group">
                    <LogOut
                        size={16}
                        className="group-hover:-translate-x-1 transition-transform"
                    />
                    Sair do Painel
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Trigger Mobile */}
            <div className="lg:hidden fixed top-4 left-4 z-[60]">
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-3 bg-zinc-900 border border-white/10 rounded-2xl text-white shadow-xl"
                >
                    <Menu size={20} />
                </button>
            </div>

            {/* Sidebar Desktop */}
            <aside className="hidden lg:flex w-64 border-r border-white/5 bg-[#050505] flex-col h-screen sticky top-0">
                <SidebarContent isMobile={false} />
            </aside>

            {/* Sidebar Mobile */}
            <AnimatePresence mode="wait">
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{
                                type: "tween",
                                duration: 0.3,
                                ease: "easeOut",
                            }}
                            className="fixed inset-y-0 left-0 w-72 bg-[#050505] z-[80] flex flex-col lg:hidden border-r border-white/10"
                        >
                            <SidebarContent
                                isMobile={true}
                            />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
